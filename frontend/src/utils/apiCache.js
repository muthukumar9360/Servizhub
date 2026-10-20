// High-performance in-memory cache for instant navigation & page transitions
const memoryCache = new Map();

export const getCachedData = (url, ttlMs = 5 * 60 * 1000) => {
  if (!url) return null;
  const cached = memoryCache.get(url);
  if (!cached) return null;
  if (Date.now() - cached.timestamp < ttlMs) {
    return cached.data;
  }
  return null;
};

export const fetchWithCache = async (url, options = {}, ttlMs = 5 * 60 * 1000) => {
  const method = (options.method || "GET").toUpperCase();
  
  // Non-GET requests and session checks bypass cache
  if (method !== "GET" || (options.credentials === "include" && url.includes("/session/me"))) {
    const res = await fetch(url, options);
    return res.json();
  }

  const cached = getCachedData(url, ttlMs);
  if (cached) {
    return cached;
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    memoryCache.set(url, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    // If network fails but any cache exists, fall back to it
    const stale = memoryCache.get(url);
    if (stale) return stale.data;
    throw err;
  }
};

export const clearApiCache = () => memoryCache.clear();
