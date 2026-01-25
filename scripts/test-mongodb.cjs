const mongoose = require('mongoose');
const { Redis } = require('ioredis');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const REDIS_URL = process.env.REDIS_URL;

if (!MONGODB_URI || !REDIS_URL) {
  console.error('Credentials missing in .env.local');
  process.exit(1);
}

// Define Schema for testing
const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  level: String,
  message: String,
});
const Log = mongoose.models.Log || mongoose.model('Log', LogSchema);

async function runTest() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const testLog = {
      level: 'INFO',
      message: 'MongoDB persistence test'
    };

    console.log('Saving test log...');
    const newLog = new Log(testLog);
    await newLog.save();
    console.log('Log saved successfully ID:', newLog._id);

    // Verify
    const found = await Log.findById(newLog._id);
    if (found) {
      console.log('Verification: Log found in DB.');
    } else {
      console.error('Verification: Log NOT found in DB.');
      process.exit(1);
    }

    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

runTest();
