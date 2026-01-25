import { Redis } from 'ioredis';
import { redis } from './redis';

const LOG_CHANNEL = 'log-stream';

export const startLogListener = (onLog: (log: any) => void) => {
  const subClient = new Redis(process.env.REDIS_URL!, {
    tls: {
      rejectUnauthorized: false
    }
  });

  subClient.subscribe(LOG_CHANNEL, (err, count) => {
    if (err) {
      console.error('Failed to subscribe to Redis channel:', err);
      return;
    }
    console.log(`Subscribed to ${LOG_CHANNEL}. Current subscriptions: ${count}`);
  });

  subClient.on('message', (channel, message) => {
    if (channel === LOG_CHANNEL) {
      try {
        const logData = JSON.parse(message);
        onLog(logData);
      } catch (error) {
        console.error('Error parsing log message:', error);
      }
    }
  });

  return () => {
    subClient.unsubscribe(LOG_CHANNEL);
    subClient.quit();
  };
};
