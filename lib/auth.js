import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-me';

export function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    if (req.cookies && req.cookies.adminToken) {
        return req.cookies.adminToken;
    }

    return null;
}
