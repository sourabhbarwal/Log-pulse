import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Redis from 'ioredis';

export async function GET() {
  const healthStatus: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    // Check MongoDB
    if (mongoose.connection.readyState === 1) {
      healthStatus.services.mongodb = 'connected';
    } else {
      await mongoose.connect(process.env.MONGODB_URI!);
      healthStatus.services.mongodb = 'connected';
    }
  } catch (err) {
    healthStatus.services.mongodb = 'error';
    healthStatus.status = 'unhealthy';
  }

  try {
    // Check Redis
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    const ping = await redis.ping();
    if (ping === 'PONG') {
      healthStatus.services.redis = 'connected';
    }
    await redis.quit();
  } catch (err) {
    healthStatus.services.redis = 'error';
    healthStatus.status = 'unhealthy';
  }

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  return NextResponse.json(healthStatus, { status: statusCode });
}
