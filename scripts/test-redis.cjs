const { Redis } = require('ioredis');
require('dotenv').config({ path: '.env.local' });

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error('REDIS_URL not found in .env.local');
  process.exit(1);
}

const pub = new Redis(redisUrl, { tls: { rejectUnauthorized: false } });
const sub = new Redis(redisUrl, { tls: { rejectUnauthorized: false } });

const LOG_CHANNEL = 'log-stream';

sub.subscribe(LOG_CHANNEL, (err) => {
  if (err) {
    console.error('Subscription error:', err);
    process.exit(1);
  }
  console.log('Successfully subscribed to channel.');
  
  // Publish a test message
  const testLog = {
    level: 'INFO',
    message: 'Redis connection test successful',
    timestamp: new Date().toISOString()
  };
  
  pub.publish(LOG_CHANNEL, JSON.stringify(testLog));
});

sub.on('message', (channel, message) => {
  console.log(`Received message on channel ${channel}:`, message);
  process.exit(0);
});

setTimeout(() => {
  console.error('Test timed out after 10 seconds');
  process.exit(1);
}, 10000);
