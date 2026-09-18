/**
 * High-Performance In-Memory Cache Middleware with TTL & Pattern Invalidation
 */

const memoryCache = new Map();

/**
 * Cache middleware for Express GET routes
 * @param {number} ttlSeconds - Time to live in seconds (default 300s = 5 mins)
 * @param {string} prefix - Optional namespace prefix for targeted invalidation
 */
const cacheResponse = (ttlSeconds = 300, prefix = '') => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${prefix ? prefix + ':' : ''}${req.originalUrl || req.url}`;
    const cachedEntry = memoryCache.get(key);
    const now = Date.now();

    if (cachedEntry) {
      if (now < cachedEntry.expiresAt) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=120`);
        return res.json(cachedEntry.data);
      }
      // Expired entry
      memoryCache.delete(key);
    }

    // Intercept res.json to capture response payload
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      // Only cache successful 2xx responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(key, {
          data,
          expiresAt: Date.now() + ttlSeconds * 1000,
        });
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=120`);
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Invalidate cache by prefix or regex
 * @param {string|RegExp} pattern - Prefix string or RegExp to match keys
 */
const invalidateCache = (pattern) => {
  if (!pattern) {
    memoryCache.clear();
    return;
  }

  const isRegex = pattern instanceof RegExp;
  for (const key of memoryCache.keys()) {
    if (isRegex ? pattern.test(key) : key.startsWith(pattern)) {
      memoryCache.delete(key);
    }
  }
};

module.exports = {
  cacheResponse,
  invalidateCache,
  memoryCache,
};
