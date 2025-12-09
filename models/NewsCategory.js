import mongoose from 'mongoose';
import { generateSlug } from '@/lib/helpers';

const NewsCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

NewsCategorySchema.pre('validate', function (next) {
    if (
        !this.slug ||
        (typeof this.slug === 'string' && this.slug.trim() === '')
    ) {
        this.slug = generateSlug(this.name, 'category-');
    }
    next();
});

NewsCategorySchema.pre('save', function (next) {
    if (this.isModified('name') && this.name) {
        this.slug = generateSlug(this.name, 'category-');
    }
    if (!this.slug || this.slug.trim() === '') {
        this.slug = generateSlug(this.name || 'category', 'category-');
    }
    next();
});

const NewsCategory =
    mongoose.models.NewsCategory ||
    mongoose.model('NewsCategory', NewsCategorySchema);

export default NewsCategory;
