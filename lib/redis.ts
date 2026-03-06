import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

const globalForRedis = global as unknown as { 
  redis: Redis | undefined;
  redisSub: Redis | undefined;
};

const redisOptions = {
  tls: {
    rejectUnauthorized: false
  }
};

export const redis = globalForRedis.redis ?? new Redis(redisUrl, redisOptions);

// For Pub/Sub we need a separate client
export const redisSub = globalForRedis.redisSub ?? new Redis(redisUrl, redisOptions);

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
  globalForRedis.redisSub = redisSub;
}
