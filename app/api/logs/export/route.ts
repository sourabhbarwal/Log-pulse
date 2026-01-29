import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Log from '@/models/Log';
import { auth } from '@/auth';

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'json';

  try {
    await dbConnect();
    const logs = await Log.find().sort({ timestamp: -1 }).limit(1000).lean();

    if (format === 'csv') {
      const headers = ['Timestamp', 'Level', 'Source', 'Message'].join(',');
      const rows = logs.map((log: any) => {
        return [
          new Date(log.timestamp).toISOString(),
          log.level,
          `"${(log.source || 'system').replace(/"/g, '""')}"`,
          `"${log.message.replace(/"/g, '""')}"`
        ].join(',');
      });
      const csvStr = [headers, ...rows].join('\n');

      return new NextResponse(csvStr, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=logpulse-export.csv',
        },
      });
    }

    return NextResponse.json(logs, {
      headers: {
        'Content-Disposition': 'attachment; filename=logpulse-export.json',
      },
    });
  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json({ error: 'Failed to export logs' }, { status: 500 });
  }
}) as any;
