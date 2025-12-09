const attempts = new Map();

setInterval(
    () => {
        const now = Date.now();
        for (const [key, value] of attempts.entries()) {
            if (now - value.firstAttempt > 15 * 60 * 1000) {
                attempts.delete(key);
            }
        }
    },
    5 * 60 * 1000,
);

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

export function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return (
        req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown'
    );
}

export function resetRateLimit(ip) {
    attempts.delete(ip);
}
