import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();

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

        const token = generateToken(user._id);

        res.setHeader(
            'Set-Cookie',
            `adminToken=${token}; HttpOnly; Path=/; Max-Age=86400`,
        );

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            user: user.toJSON(),
            token,
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
