import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  const healthStatus: {
    status: string;
    timestamp: string;
    services: {
      mongodb: string;
      redis: string;
    };
  } = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    // Check MongoDB
    await dbConnect();
    if (mongoose.connection.readyState === 1) {
      healthStatus.services.mongodb = 'connected';
    } else {
      healthStatus.services.mongodb = 'error';
      healthStatus.status = 'unhealthy';
    }
  } catch (err) {
    console.error('MongoDB Health Check Error:', err);
    healthStatus.services.mongodb = 'error';
    healthStatus.status = 'unhealthy';
  }

  try {
    // Check Redis
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      tls: {
        rejectUnauthorized: false
      }
    });
    const ping = await redis.ping();
    if (ping === 'PONG') {
      healthStatus.services.redis = 'connected';
    }
    await redis.quit();
  } catch (err) {
    console.error('Redis Health Check Error:', err);
    healthStatus.services.redis = 'error';
    healthStatus.status = 'unhealthy';
  }

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  return NextResponse.json(healthStatus, { status: statusCode });
}
