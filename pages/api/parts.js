import Part from '@/models/Part';
import dbConnect from '@/lib/mongodb';
import { partsItems } from '@/constants/parts';
import { get, set, invalidate } from '@/lib/cache';

const CACHE_KEY = 'parts:list';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const cached = get(CACHE_KEY);
        if (cached) {
            return res.status(200).json(cached);
        }
        try {
            const parts = await Part.find({})
                .sort({ order: 1, createdAt: -1 })
                .lean();
            if (parts && parts.length > 0) {
                set(CACHE_KEY, parts);
                return res.status(200).json(parts);
            }
            console.log('No data in DB, using constant fallback');
            return res.status(200).json(partsItems);
        } catch (error) {
            console.error('Error fetching parts from DB:', error);
            if (cached) {
                return res.status(200).json(cached);
            }
            return res.status(200).json(partsItems);
        }
    }

    if (req.method === 'POST') {
        try {
            const part = new Part(req.body);
            await part.save();
            invalidate('parts:');
            return res.status(201).json(part);
        } catch (error) {
            console.error('Error creating part:', error);
            return res.status(400).json({ message: 'Failed to create part' });
        }
    }

    if (req.method === 'PUT') {
        const { _id, ...rest } = req.body;
        try {
            const updatedPart = await Part.findByIdAndUpdate(
                _id,
                { ...rest, updatedAt: new Date() },
                { new: true },
            );
            if (!updatedPart) {
                return res.status(404).json({ message: 'Part not found' });
            }
            invalidate('parts:');
            return res.status(200).json(updatedPart);
        } catch (error) {
            console.error('Error updating part:', error);
            return res.status(400).json({ message: 'Failed to update part' });
        }
    }

    if (req.method === 'DELETE') {
        const { _id } = req.body;
        try {
            const deleted = await Part.findByIdAndDelete(_id);
            if (!deleted) {
                return res.status(404).json({ message: 'Part not found' });
            }
            invalidate('parts:');
            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            console.error('Error deleting part:', error);
            return res.status(400).json({ message: 'Failed to delete part' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
