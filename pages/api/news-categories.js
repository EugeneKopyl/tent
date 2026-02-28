import NewsCategory from '@/models/NewsCategory';
import connectDB from '@/lib/mongodb';
import { generateSlug } from '@/lib/helpers';
import { get, set, invalidate } from '@/lib/cache';

const CACHE_KEY = 'news-categories:list';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        const cached = get(CACHE_KEY);
        if (cached) {
            return res.status(200).json(cached);
        }
        try {
            const categories = await NewsCategory.find({})
                .sort({ name: 1 })
                .lean();
            if (categories && categories.length > 0) {
                set(CACHE_KEY, categories);
            }
            return res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            if (cached) {
                return res.status(200).json(cached);
            }
            return res
                .status(500)
                .json({ message: 'Failed to fetch categories' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, description } = req.body;

            if (!name || !name.trim()) {
                return res
                    .status(400)
                    .json({ message: 'Category name is required' });
            }

            const slug = generateSlug(name, 'category-');

            const category = new NewsCategory({
                name: name.trim(),
                slug: slug,
                description: description || '',
            });

            await category.save();
            invalidate('news-categories:');
            invalidate('news:');
            return res.status(201).json(category);
        } catch (error) {
            console.error('Error creating category:', error);
            return res.status(400).json({
                message: 'Failed to create category',
                error: error.message,
            });
        }
    }

    if (req.method === 'PUT') {
        const { _id, ...rest } = req.body;
        try {
            const updatedCategory = await NewsCategory.findByIdAndUpdate(
                _id,
                { ...rest, updatedAt: new Date() },
                { new: true },
            );
            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            invalidate('news-categories:');
            invalidate('news:');
            return res.status(200).json(updatedCategory);
        } catch (error) {
            console.error('Error updating category:', error);
            return res
                .status(400)
                .json({ message: 'Failed to update category' });
        }
    }

    if (req.method === 'DELETE') {
        const { _id } = req.body;
        try {
            const News = (await import('@/models/News')).default;
            const newsCount = await News.countDocuments({ category: _id });

            if (newsCount > 0) {
                return res.status(400).json({
                    message: `Cannot delete category. ${newsCount} news item(s) use this category.`,
                });
            }

            const deleted = await NewsCategory.findByIdAndDelete(_id);
            if (!deleted) {
                return res.status(404).json({ message: 'Category not found' });
            }
            invalidate('news-categories:');
            invalidate('news:');
            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            console.error('Error deleting category:', error);
            return res
                .status(400)
                .json({ message: 'Failed to delete category' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
