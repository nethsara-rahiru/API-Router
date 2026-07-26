const UsageLog = require('../models/UsageLog');

class UsageService {
  static async getDashboardStats(organizationId) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayStats, monthStats, totalRequests] = await Promise.all([
      UsageLog.aggregate([
        { $match: { organizationId, timestamp: { $gte: startOfDay } } },
        { $group: { _id: null, requests: { $sum: 1 }, tokens: { $sum: '$totalTokens' }, errors: { $sum: { $cond: [{ $gte: ['$status', 400] }, 1, 0] } } } }
      ]),
      UsageLog.aggregate([
        { $match: { organizationId, timestamp: { $gte: startOfMonth } } },
        { $group: { _id: null, requests: { $sum: 1 }, tokens: { $sum: '$totalTokens' } } }
      ]),
      UsageLog.countDocuments({ organizationId })
    ]);

    return {
      today: {
        requests: todayStats[0]?.requests || 0,
        tokens: todayStats[0]?.tokens || 0,
        errors: todayStats[0]?.errors || 0,
      },
      month: {
        requests: monthStats[0]?.requests || 0,
        tokens: monthStats[0]?.tokens || 0,
      },
      total: totalRequests,
    };
  }

  static async getRecentLogs(organizationId, limit = 20) {
    return UsageLog.find({ organizationId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('provider model inputTokens outputTokens totalTokens responseTimeMs status createdAt');
  }

  static async getChartData(organizationId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await UsageLog.aggregate([
      { $match: { organizationId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          requests: { $sum: 1 },
          tokens: { $sum: '$totalTokens' },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return data;
  }
}

module.exports = UsageService;
