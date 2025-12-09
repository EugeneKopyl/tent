import { verifyToken, getTokenFromRequest } from './auth';
import connectDB from './mongodb';
import User from '../models/User';

/**
 * Проверяет авторизацию на сервере
 * @param {Object} req - Request объект от Next.js
 * @returns {Object|null} - Объект с userId и role, или null если не авторизован
 */
export async function checkServerAuth(req) {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return null;
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return null;
        }

        // Если userId это строка и похож на ObjectId MongoDB
        if (
            decoded.userId &&
            typeof decoded.userId === 'string' &&
            decoded.userId.length > 8
        ) {
            await connectDB();
            const user = await User.findById(decoded.userId).select('role');
            if (
                !user ||
                (user.role !== 'admin' && user.role !== 'superadmin')
            ) {
                return null;
            }
            return { userId: decoded.userId, role: user.role };
        }

        // Для superadmin (если используется)
        if (decoded.userId === 'superadmin') {
            return { userId: 'superadmin', role: 'superadmin' };
        }

        return null;
    } catch (error) {
        console.error('Server auth check error:', error);
        return null;
    }
}
