import mongoose from 'mongoose';

const WorkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Work = mongoose.models.Work || mongoose.model('Work', WorkSchema);

export default Work;
