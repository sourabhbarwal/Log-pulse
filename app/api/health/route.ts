import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { redis } from '@/lib/redis';
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
    const ping = await redis.ping();
    if (ping === 'PONG') {
      healthStatus.services.redis = 'connected';
    }
  } catch (err) {
    console.error('Redis Health Check Error:', err);
    healthStatus.services.redis = 'error';
    healthStatus.status = 'unhealthy';
  }

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  return NextResponse.json(healthStatus, { status: statusCode });
}
