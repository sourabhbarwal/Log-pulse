import dbConnect from './mongodb';
import Log from '@/models/Log';

/**
 * Generates a summary of logs for a specific time range.
 */
export async function generateLogSummary(days = 7) {
  await dbConnect();
  
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - days);

  const stats = await Log.aggregate([
    { $match: { timestamp: { $gte: startTime } } },
    { $group: {
        _id: "$level",
        count: { $sum: 1 }
      }
    }
  ]);

  const topErrors = await Log.aggregate([
    { $match: { level: 'ERROR', timestamp: { $gte: startTime } } },
    { $group: {
        _id: "$fingerprint",
        message: { $first: "$message" },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  return {
    period: `${days} days`,
    stats: stats.reduce((acc: any, curr: any) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    topErrors
  };
}
