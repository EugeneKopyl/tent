// Простой rate limiter для защиты от ботов

const attempts = new Map();

// Очистка старых записей каждые 5 минут
setInterval(
    () => {
        const now = Date.now();
        for (const [key, value] of attempts.entries()) {
            if (now - value.firstAttempt > 15 * 60 * 1000) {
                // Удаляем записи старше 15 минут
                attempts.delete(key);
            }
        }
    },
    5 * 60 * 1000,
);

/**
 * Проверяет rate limit для IP адреса
 * @param {string} ip - IP адрес клиента
 * @param {number} maxAttempts - Максимальное количество попыток
 * @param {number} windowMs - Временное окно в миллисекундах
 * @returns {Object} { allowed: boolean, remaining: number, resetTime: Date }
 */
export function checkRateLimit(ip, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const key = ip;

    if (!attempts.has(key)) {
        attempts.set(key, {
            count: 1,
            firstAttempt: now,
            lastAttempt: now,
        });
        return {
            allowed: true,
            remaining: maxAttempts - 1,
            resetTime: new Date(now + windowMs),
        };
    }

    const record = attempts.get(key);
    const timeSinceFirstAttempt = now - record.firstAttempt;

    // Если прошло больше времени окна, сбрасываем счетчик
    if (timeSinceFirstAttempt > windowMs) {
        attempts.set(key, {
            count: 1,
            firstAttempt: now,
            lastAttempt: now,
        });
        return {
            allowed: true,
            remaining: maxAttempts - 1,
            resetTime: new Date(now + windowMs),
        };
    }

    // Увеличиваем счетчик
    record.count += 1;
    record.lastAttempt = now;

    const remaining = Math.max(0, maxAttempts - record.count);
    const allowed = record.count <= maxAttempts;

    return {
        allowed,
        remaining,
        resetTime: new Date(record.firstAttempt + windowMs),
    };
}

/**
 * Получает IP адрес из запроса
 * @param {Object} req - Request объект
 * @returns {string} IP адрес
 */
export function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];

    if (forwarded) {
        // x-forwarded-for может содержать несколько IP через запятую
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return (
        req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown'
    );
}

/**
 * Сбрасывает счетчик попыток для IP (используется после успешного входа)
 * @param {string} ip - IP адрес клиента
 */
export function resetRateLimit(ip) {
    attempts.delete(ip);
}
