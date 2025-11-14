import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
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

        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res
                .status(400)
                .json({ message: 'User ID and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long',
            });
        }

        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToUpdate.role === 'superadmin') {
            return res
                .status(403)
                .json({ message: 'Cannot change superadmin password' });
        }

        userToUpdate.password = newPassword;
        await userToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
