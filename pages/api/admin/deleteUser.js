import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();

        const token = getTokenFromRequest(req);
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        let requesterRole = 'admin';
        if (
            decoded.userId &&
            typeof decoded.userId === 'string' &&
            decoded.userId.length > 8
        ) {
            const mongoose = require('mongoose');
            const UserModel = mongoose.models.User || mongoose.model('User');
            const requester = await UserModel.findById(decoded.userId).select(
                'role',
            );
            requesterRole = requester?.role || 'admin';
        } else if (decoded.userId === 'superadmin') {
            requesterRole = 'superadmin';
        }

        if (requesterRole !== 'superadmin') {
            return res
                .status(403)
                .json({ message: 'Access denied. Superadmin only.' });
        }

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const userToDelete = await User.findById(userId);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToDelete.role === 'superadmin') {
            return res
                .status(403)
                .json({ message: 'Cannot delete superadmin' });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
        });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
