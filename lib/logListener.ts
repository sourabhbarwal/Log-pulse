import { Redis } from 'ioredis';
import Log from '@/models/Log';
import dbConnect from './mongodb';
import { generateFingerprint } from './fingerprint';
import { checkSmartThreshold } from './thresholds';
import { sendWebhookAlert } from './webhooks';

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
        
        // Generate fingerprint for grouping
        const fingerprint = generateFingerprint(logData.message);
        const enrichedLog = { ...logData, fingerprint };

        // Save to MongoDB
        const newLog = new Log(enrichedLog);
        await newLog.save();
        
        // Smart Alerting for ERRORS
        if (enrichedLog.level === 'ERROR') {
          const isThresholdBreached = await checkSmartThreshold(fingerprint);
          if (isThresholdBreached) {
            console.log(`🔥 Alert Threshold Hit: Dispatched webhooks for ${fingerprint}`);
            await sendWebhookAlert(enrichedLog);
          }
        }

        onLog(enrichedLog);
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
