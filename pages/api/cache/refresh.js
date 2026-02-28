import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { invalidate } from '@/lib/cache';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

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
    if (userRole !== 'admin' && userRole !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { type } = req.body || {};
    if (!type || !['parts', 'news', 'news-categories'].includes(type)) {
        return res.status(400).json({
            message: 'Invalid type. Use: parts, news, or news-categories',
        });
    }

    if (type === 'parts') {
        invalidate('parts:');
    } else if (type === 'news') {
        invalidate('news:');
        invalidate('news-categories:');
    } else if (type === 'news-categories') {
        invalidate('news-categories:');
        invalidate('news:');
    }

    return res.status(200).json({ ok: true, message: 'Cache invalidated' });
}
