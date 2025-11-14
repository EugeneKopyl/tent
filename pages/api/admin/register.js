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

        const { username, email, password, firstName, lastName } = req.body;

        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({
                message:
                    'All fields are required: username, email, password, firstName, lastName',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long',
            });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this username or email already exists',
            });
        }

        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            role: 'admin',
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
