const { Redis } = require('ioredis');
require('dotenv').config({ path: '.env.local' });

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  console.error('REDIS_URL not found');
  process.exit(1);
}

const redis = new Redis(REDIS_URL, { tls: { rejectUnauthorized: false } });
const LOG_CHANNEL = 'log-stream';

async function runBenchmark(durationSeconds = 10, logsPerSecond = 50) {
  console.log(`🚀 Starting Scalability Benchmark...`);
  console.log(`Target: ${logsPerSecond} logs/sec for ${durationSeconds} seconds.`);
  
  let sentCount = 0;
  const startTime = Date.now();
  
  const interval = setInterval(async () => {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed >= durationSeconds) {
      clearInterval(interval);
      console.log(`\n✅ Benchmark Complete!`);
      console.log(`Total Logs Sent: ${sentCount}`);
      console.log(`Actual Rate: ${(sentCount / durationSeconds).toFixed(2)} logs/sec`);
      process.exit(0);
    }

    // Send a batch of logs for this tick
    for (let i = 0; i < logsPerSecond; i++) {
        const log = {
          timestamp: new Date().toISOString(),
          level: Math.random() > 0.9 ? 'ERROR' : (Math.random() > 0.7 ? 'WARN' : 'INFO'),
          source: 'benchmark-node',
          message: `Benchmark log payload ${sentCount + i}`,
          metadata: { batch: sentCount }
        };
        redis.publish(LOG_CHANNEL, JSON.stringify(log));
    }
    sentCount += logsPerSecond;
    process.stdout.write(`\rSent: ${sentCount} logs...`);
  }, 1000);
}

runBenchmark().catch(console.error);
