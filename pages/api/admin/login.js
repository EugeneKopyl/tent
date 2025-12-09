import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateToken } from '@/lib/auth';
import { checkRateLimit, getClientIP, resetRateLimit } from '@/lib/rateLimiter';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP, 5, 15 * 60 * 1000);

    res.setHeader('X-RateLimit-Limit', '5');
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimit.resetTime.toISOString());

    if (!rateLimit.allowed) {
        const resetTimeSeconds = Math.ceil(
            (rateLimit.resetTime.getTime() - Date.now()) / 1000,
        );
        return res.status(429).json({
            message: `Слишком много попыток входа. Попробуйте снова через ${Math.ceil(resetTimeSeconds / 60)} минут.`,
            resetTime: rateLimit.resetTime.toISOString(),
        });
    }

    try {
        await connectDB();

        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username, isActive: true });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
                remainingAttempts: rateLimit.remaining,
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
                remainingAttempts: rateLimit.remaining,
            });
        }

        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Access denied. Admin role required.',
                remainingAttempts: rateLimit.remaining,
            });
        }

        resetRateLimit(clientIP);

        await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

        const token = generateToken(user._id);

        res.setHeader(
            'Set-Cookie',
            `adminToken=${token}; HttpOnly; Path=/; Max-Age=86400`,
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user.toJSON(),
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
