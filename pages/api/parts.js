import Part from '@/models/Part';
import dbConnect from '@/lib/mongodb';
import { partsItems } from '@/constants/parts';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const parts = await Part.find({}).lean();

        if (parts && parts.length > 0) {
            return res.status(200).json(parts);
        } else {
            console.log('No data in DB, using constant fallback');
            return res.status(200).json(partsItems);
        }
    } catch (error) {
        console.error('Error fetching parts from DB:', error);
        return res.status(200).json(partsItems);
    }
}
