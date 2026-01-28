const { Redis } = require('ioredis');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const REDIS_URL = process.env.REDIS_URL;

if (!MONGODB_URI || !REDIS_URL) {
  console.error('Environment variables missing');
  process.exit(1);
}

async function prune() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for pruning...');

    const retentionDays = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await mongoose.connection.collection('logs').deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    console.log(`✅ Pruned ${result.deletedCount} logs older than ${retentionDays} days.`);
    process.exit(0);
  } catch (error) {
    console.error('Pruning failed:', error);
    process.exit(1);
  }
}

prune();
