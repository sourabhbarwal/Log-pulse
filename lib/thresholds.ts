import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!, {
  tls: { rejectUnauthorized: false }
});

const THRESHOLD_WINDOW_SECONDS = 60;
const ERROR_THRESHOLD = 5;

/**
 * Checks if the error frequency has exceeded the threshold.
 * Uses a Redis sorted set or simple counter with expiry.
 */
export async function checkSmartThreshold(fingerprint: string): Promise<boolean> {
  const key = `threshold:${fingerprint}`;
  
  // Increment error count for this fingerprint
  const count = await redis.incr(key);
  
  // Set expiry on first error
  if (count === 1) {
    await redis.expire(key, THRESHOLD_WINDOW_SECONDS);
  }

  // If threshold hit exactly (e.g., 5th error), return true
  // This prevents spamming on the 6th, 7th error etc. until the window resets
  return count === ERROR_THRESHOLD;
}
