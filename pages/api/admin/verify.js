import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        let role = 'admin';
        let user = null;
        if (
            decoded.userId &&
            typeof decoded.userId === 'string' &&
            decoded.userId.length > 8
        ) {
            const mongoose = require('mongoose');
            const User = mongoose.models.User || mongoose.model('User');
            const dbConnectImported = require('../../../lib/mongodb');
            const dbConnect = dbConnectImported.default || dbConnectImported;
            await dbConnect();
            user = await User.findById(decoded.userId).select('role');
            role = user?.role || 'admin';
        } else if (decoded.userId === 'superadmin') {
            role = 'superadmin';
        }
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            role,
        });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({
            message: 'Token verification failed',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
}
