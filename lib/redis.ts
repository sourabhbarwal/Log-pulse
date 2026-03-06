import { Redis } from "ioredis";

const globalForRedis = global as unknown as { 
  redis: Redis | undefined;
  redisSub: Redis | undefined;
};

const redisOptions = {
  tls: {
    rejectUnauthorized: false
  }
};

/**
 * Lazy initialization of Redis client to prevent build errors
 * when environment variables are missing.
 */
function getRedisClient(isSub = false) {
  const redisUrl = process.env.REDIS_URL;
  
  if (isSub) {
    if (globalForRedis.redisSub) return globalForRedis.redisSub;
    if (!redisUrl) return null;
    const client = new Redis(redisUrl, redisOptions);
    if (process.env.NODE_ENV !== "production") globalForRedis.redisSub = client;
    return client;
  }

  if (globalForRedis.redis) return globalForRedis.redis;
  if (!redisUrl) return null;
  const client = new Redis(redisUrl, redisOptions);
  if (process.env.NODE_ENV !== "production") globalForRedis.redis = client;
  return client;
}

// Proxies to handle lazy loading
export const redis = new Proxy({} as Redis, {
  get: (target, prop) => {
    const client = getRedisClient();
    if (!client) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('REDIS_URL missing during Redis operation');
        }
        throw new Error("REDIS_URL is not defined");
    }
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  }
});

export const redisSub = new Proxy({} as Redis, {
  get: (target, prop) => {
    const client = getRedisClient(true);
    if (!client) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('REDIS_URL missing during Redis Sub operation');
        }
        throw new Error("REDIS_URL is not defined");
    }
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  }
});
