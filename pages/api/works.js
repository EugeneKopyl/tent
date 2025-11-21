import Work from '@/models/Work';
import dbConnect from '@/lib/mongodb';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const works = await Work.find({}).sort({ createdAt: -1 }).lean();
            return res.status(200).json(works);
        } catch (error) {
            console.error('Error fetching works from DB:', error);
            return res.status(500).json({ message: 'Failed to fetch works' });
        }
    }

    if (req.method === 'POST') {
        try {
            const work = new Work(req.body);
            await work.save();
            return res.status(201).json(work);
        } catch (error) {
            console.error('Error creating work:', error);
            return res.status(400).json({ message: 'Failed to create work' });
        }
    }

    if (req.method === 'PUT') {
        const { _id, ...rest } = req.body;
        try {
            const updatedWork = await Work.findByIdAndUpdate(
                _id,
                { ...rest, updatedAt: new Date() },
                { new: true },
            );
            if (!updatedWork) {
                return res.status(404).json({ message: 'Work not found' });
            }
            return res.status(200).json(updatedWork);
        } catch (error) {
            console.error('Error updating work:', error);
            return res.status(400).json({ message: 'Failed to update work' });
        }
    }

    if (req.method === 'DELETE') {
        const { _id } = req.body;
        try {
            const deleted = await Work.findByIdAndDelete(_id);
            if (!deleted) {
                return res.status(404).json({ message: 'Work not found' });
            }
            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            console.error('Error deleting work:', error);
            return res.status(400).json({ message: 'Failed to delete work' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
