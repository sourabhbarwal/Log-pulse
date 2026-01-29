import { NextResponse } from 'next/server';
import { generateLogSummary } from '@/lib/reports';
import { auth } from '@/auth';

export const GET = auth(async (req) => {
  if (!req.auth || (req.auth.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const report = await generateLogSummary(7);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Report failed:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}) as any;
