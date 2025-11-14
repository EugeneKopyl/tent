import Part from '@/models/Part';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

const PARTS_BACKUP_PATH = path.resolve(process.cwd(), 'parts.json');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    await dbConnect();
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
    let userRole = 'admin';
    if (
        decoded.userId &&
        typeof decoded.userId === 'string' &&
        decoded.userId.length > 8
    ) {
        const User = require('@/models/User').default;
        const user = await User.findById(decoded.userId).select('role');
        userRole = user?.role || 'admin';
    } else if (decoded.userId === 'superadmin') {
        userRole = 'superadmin';
    }
    if (userRole !== 'superadmin') {
        return res
            .status(403)
            .json({ message: 'Access denied. Superadmin only.' });
    }
    const action = req.query.action;
    if (action === 'backup') {
        // Бэкап всех Part
        const allParts = await Part.find({}).lean();
        try {
            fs.writeFileSync(
                PARTS_BACKUP_PATH,
                JSON.stringify(allParts, null, 2),
                'utf-8',
            );
            return res.status(200).json({
                success: true,
                message: 'Backup completed',
                count: allParts.length,
            });
        } catch (e) {
            return res
                .status(500)
                .json({ message: 'Backup failed', error: e.message });
        }
    } else if (action === 'restore') {
        // Восстановление
        try {
            const partsData = JSON.parse(
                fs.readFileSync(PARTS_BACKUP_PATH, 'utf-8'),
            );
            await Part.deleteMany({});
            await Part.insertMany(partsData);
            return res.status(200).json({
                success: true,
                message: 'Restore completed',
                count: partsData.length,
            });
        } catch (e) {
            return res
                .status(500)
                .json({ message: 'Restore failed', error: e.message });
        }
    } else {
        return res.status(400).json({ message: 'Unknown action' });
    }
}
