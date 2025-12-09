import Part from '@/models/Part';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.resolve(process.cwd(), 'backups');
const PARTS_BACKUP_PATH = path.resolve(BACKUP_DIR, 'parts.json');

if (!fs.existsSync(BACKUP_DIR)) {
    try {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    } catch (e) {
        console.error('Failed to create backup directory:', e);
    }
}

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
        try {
            const allParts = await Part.find({}).lean();

            if (!fs.existsSync(BACKUP_DIR)) {
                fs.mkdirSync(BACKUP_DIR, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.resolve(
                BACKUP_DIR,
                `parts-${timestamp}.json`,
            );

            fs.writeFileSync(
                backupFile,
                JSON.stringify(allParts, null, 2),
                'utf-8',
            );

            fs.writeFileSync(
                PARTS_BACKUP_PATH,
                JSON.stringify(allParts, null, 2),
                'utf-8',
            );

            return res.status(200).json({
                success: true,
                message: 'Backup completed',
                count: allParts.length,
                filename: `parts-${timestamp}.json`,
            });
        } catch (e) {
            console.error('Backup error:', e);
            return res
                .status(500)
                .json({ message: 'Backup failed', error: e.message });
        }
    } else if (action === 'restore') {
        try {
            if (!fs.existsSync(PARTS_BACKUP_PATH)) {
                return res.status(404).json({
                    message:
                        'Backup file not found. Please create a backup first.',
                });
            }

            const fileContent = fs.readFileSync(PARTS_BACKUP_PATH, 'utf-8');
            const partsData = JSON.parse(fileContent);

            if (!Array.isArray(partsData)) {
                return res.status(400).json({
                    message: 'Invalid backup file format',
                });
            }

            await Part.deleteMany({});
            if (partsData.length > 0) {
                await Part.insertMany(partsData);
            }

            return res.status(200).json({
                success: true,
                message: 'Restore completed',
                count: partsData.length,
            });
        } catch (e) {
            console.error('Restore error:', e);
            return res
                .status(500)
                .json({ message: 'Restore failed', error: e.message });
        }
    } else if (action === 'download') {
        try {
            const allParts = await Part.find({}).lean();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `parts-backup-${timestamp}.json`;

            res.setHeader('Content-Type', 'application/json');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${filename}"`,
            );
            return res.status(200).json(allParts);
        } catch (e) {
            console.error('Download error:', e);
            return res
                .status(500)
                .json({ message: 'Download failed', error: e.message });
        }
    } else if (action === 'upload') {
        try {
            if (!req.body || !Array.isArray(req.body)) {
                return res.status(400).json({
                    message: 'Invalid backup data. Expected JSON array.',
                });
            }

            const partsData = req.body;

            if (partsData.length === 0) {
                return res.status(400).json({
                    message: 'Backup file is empty',
                });
            }

            if (!fs.existsSync(BACKUP_DIR)) {
                fs.mkdirSync(BACKUP_DIR, { recursive: true });
            }
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.resolve(
                BACKUP_DIR,
                `parts-before-restore-${timestamp}.json`,
            );
            const currentParts = await Part.find({}).lean();
            fs.writeFileSync(
                backupFile,
                JSON.stringify(currentParts, null, 2),
                'utf-8',
            );

            await Part.deleteMany({});
            await Part.insertMany(partsData);

            return res.status(200).json({
                success: true,
                message: 'Restore from file completed',
                count: partsData.length,
            });
        } catch (e) {
            console.error('Upload restore error:', e);
            return res.status(500).json({
                message: 'Restore from file failed',
                error: e.message,
            });
        }
    } else {
        return res.status(400).json({ message: 'Unknown action' });
    }
}
