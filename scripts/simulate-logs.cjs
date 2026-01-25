const { Redis } = require('ioredis');
require('dotenv').config({ path: '.env.local' });

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error('REDIS_URL not found in .env.local');
  process.exit(1);
}

const redis = new Redis(REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  }
});

const LOG_CHANNEL = 'log-stream';
const LEVELS = ['INFO', 'WARN', 'ERROR'];
const SOURCES = ['auth-service', 'payment-gateway', 'inventory-manager', 'api-gateway'];
const MESSAGES = [
  'User login successful',
  'Cache miss on product details',
  'API latency spike detected',
  'Database connection pool high',
  'Failed to process transaction',
  'Service unavailable',
  'Configuration updated',
  'Resource usage warning'
];

function generateLog() {
  const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  return {
    timestamp: new Date().toISOString(),
    level,
    source,
    message,
    metadata: {
      pid: Math.floor(Math.random() * 10000),
      region: 'us-east-1'
    }
  };
}

async function startSimulation() {
  console.log('Starting log simulation... Press Ctrl+C to stop.');
  
  setInterval(() => {
    const log = generateLog();
    redis.publish(LOG_CHANNEL, JSON.stringify(log));
    console.log(`[${log.level}] Sent: ${log.message}`);
  }, 1000); // 1 log per second
}

startSimulation().catch(console.error);
