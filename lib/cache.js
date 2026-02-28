const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

let store = global.__apiCache;
if (!store) {
    store = global.__apiCache = new Map();
}

function get(key) {
    const entry = store.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
        return null;
    }
    return entry.value;
}

function set(key, value) {
    store.set(key, {
        value,
        expiresAt: Date.now() + TTL_MS,
    });
}

function invalidate(pattern) {
    const prefix = pattern.replace(/\*$/, '');
    for (const key of store.keys()) {
        if (key.startsWith(prefix)) {
            store.delete(key);
        }
    }
}

export { get, set, invalidate };
