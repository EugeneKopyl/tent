import { verifyToken, getTokenFromRequest } from '../../../lib/auth';

export default function handler(req, res) {
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

        res.status(200).json({
            success: true,
            message: 'Token is valid',
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
