import mongoose from 'mongoose';
import { generateSlug } from '@/lib/helpers';

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
        previewImage: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        published: {
            type: Boolean,
            default: false,
            required: true,
        },
        publishedAt: {
            type: Date,
            default: null,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NewsCategory',
            required: true,
        },
    },
    {
        timestamps: true,
        strictPopulate: false,
    },
);

NewsSchema.pre('validate', function (next) {
    if (!this.slug || this.slug.trim() === '') {
        this.slug = generateSlug(this.title ?? 'news', 'news-');
    }
    next();
});

NewsSchema.pre('save', function (next) {
    if (this.isModified('title') && this.title) {
        this.slug = generateSlug(this.title, 'news-');
    }
    if (!this.slug || this.slug.trim() === '') {
        this.slug = generateSlug(this.title || 'news', 'news-');
    }
    if (this.isModified('published') && this.published && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

NewsSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.title) {
        update.slug = generateSlug(update.title, 'news-');
    }

    if (update.published === true && !update.publishedAt) {
        const originalPublished = this._conditions.published;
        if (!originalPublished || originalPublished === false) {
            update.publishedAt = new Date();
        }
    }

    update.updatedAt = new Date();

    next();
});
const News = mongoose.models.News || mongoose.model('News', NewsSchema);

export default News;
