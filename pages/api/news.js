import mongoose from 'mongoose';
import NewsCategory from '@/models/NewsCategory';
import News from '@/models/News';
import connectDB from '@/lib/mongodb';
import { generateSlug } from '@/lib/helpers';
import { get, set, invalidate } from '@/lib/cache';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        const { slug, preview } = req.query;
        const isPreview = preview === 'true';

        if (slug) {
            const cacheKey = `news:item:${slug}${isPreview ? ':preview' : ''}`;
            const cached = get(cacheKey);
            if (cached) {
                return res.status(200).json(cached);
            }
            try {
                const query = { slug };
                if (!isPreview) {
                    query.published = true;
                }

                const NewsModel = mongoose.models.News || News;

                const news = await NewsModel.findOne(query)
                    .populate({
                        path: 'category',
                        model: 'NewsCategory',
                        select: 'name slug',
                    })
                    .lean();

                if (!news) {
                    return res.status(404).json({ message: 'News not found' });
                }

                const normalized = { ...news };

                if (!normalized.previewImage) {
                    normalized.previewImage = '/logo512.png';
                }

                set(cacheKey, normalized);
                return res.status(200).json(normalized);
            } catch (error) {
                console.error('Error fetching news:', error);
                if (cached) {
                    return res.status(200).json(cached);
                }
                return res
                    .status(500)
                    .json({ message: 'Failed to fetch news' });
            }
        }

        const listCacheKey = isPreview ? 'news:list:preview' : 'news:list';
        const cached = get(listCacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }
        try {
            const query = isPreview ? {} : { published: true };

            const NewsModel = mongoose.models.News || News;

            const newsList = await NewsModel.find(query)
                .populate({
                    path: 'category',
                    model: 'NewsCategory',
                    select: 'name slug',
                })
                .sort({ publishedAt: -1, createdAt: -1 })
                .lean();

            const normalizedList = newsList.map((item) => {
                const normalized = { ...item };
                if (!normalized.slug && normalized.title) {
                    normalized.slug = generateSlug(normalized.title);
                }
                if (!normalized.previewImage) {
                    normalized.previewImage = '/logo512.png';
                }
                return normalized;
            });

            if (normalizedList.length > 0) {
                set(listCacheKey, normalizedList);
            }
            return res.status(200).json(normalizedList);
        } catch (error) {
            console.error('Error fetching news:', error);
            if (cached) {
                return res.status(200).json(cached);
            }
            return res.status(500).json({ message: 'Failed to fetch news' });
        }
    }

    if (req.method === 'POST') {
        try {
            const newsData = { ...req.body };

            const news = new News(newsData);
            await news.save();

            const NewsModel = mongoose.models.News || News;

            let populated;
            try {
                populated = await NewsModel.findById(news._id)
                    .populate({
                        path: 'category',
                        model: 'NewsCategory',
                        select: 'name slug',
                    })
                    .lean();
            } catch (populateError) {
                console.warn(
                    'Populate failed, returning news without category:',
                    populateError,
                );
                populated = news.toObject();
                if (populated.category) {
                    populated.category = await NewsCategory.findById(
                        populated.category,
                    ).lean();
                }
            }

            invalidate('news:');
            return res.status(201).json(populated);
        } catch (error) {
            console.error('Error creating news:', error);
            return res.status(400).json({
                message: 'Failed to create news',
                error: error.message,
            });
        }
    }

    if (req.method === 'PUT') {
        const { _id, ...rest } = req.body;
        try {
            const updateData = { ...rest };

            const NewsModel = mongoose.models.News || News;

            const updatedNews = await NewsModel.findByIdAndUpdate(
                _id,
                { ...updateData, updatedAt: new Date() },
                { new: true },
            )
                .populate({
                    path: 'category',
                    model: 'NewsCategory',
                    select: 'name slug',
                })
                .lean();

            if (!updatedNews) {
                return res.status(404).json({ message: 'News not found' });
            }

            invalidate('news:');
            return res.status(200).json(updatedNews);
        } catch (error) {
            console.error('Error updating news:', error);
            return res.status(400).json({ message: 'Failed to update news' });
        }
    }

    if (req.method === 'DELETE') {
        const { _id } = req.body;
        try {
            const deleted = await News.findByIdAndDelete(_id);
            if (!deleted) {
                return res.status(404).json({ message: 'News not found' });
            }
            invalidate('news:');
            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            console.error('Error deleting news:', error);
            return res.status(400).json({ message: 'Failed to delete news' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
