import mongoose from 'mongoose';

const PartSchema = new mongoose.Schema(
    {
        currency: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        order: {
            type: Number,
        },
    },
    {
        timestamps: true,
    },
);

const Part = mongoose.models.Part || mongoose.model('Part', PartSchema);

export default Part;
