import { Redis } from 'ioredis';
import Log from '@/models/Log';
import dbConnect from './mongodb';

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

  subClient.on('message', async (channel, message) => {
    if (channel === LOG_CHANNEL) {
      try {
        const logData = JSON.parse(message);
        
        // Save to MongoDB
        const newLog = new Log(logData);
        await newLog.save();
        
        onLog(logData);
      } catch (error) {
        console.error('Error processing log message:', error);
      }
    }
  });

  return () => {
    subClient.unsubscribe(LOG_CHANNEL);
    subClient.quit();
  };
};
