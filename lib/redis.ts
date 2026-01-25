import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

const globalForRedis = global as unknown as { redis: Redis | undefined };

export const redis = globalForRedis.redis ?? new Redis(redisUrl, {
  tls: {
    rejectUnauthorized: false
  }
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
