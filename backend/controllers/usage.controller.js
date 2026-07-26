const UsageService = require('../services/usage.service');

class UsageController {
  static async getStats(req, res, next) {
    try {
      const stats = await UsageService.getDashboardStats(req.user.organizationId);
      res.json(stats);
    } catch (error) { next(error); }
  }

  static async getLogs(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const logs = await UsageService.getRecentLogs(req.user.organizationId, limit);
      res.json({ logs });
    } catch (error) { next(error); }
  }

  static async getChartData(req, res, next) {
    try {
      const days = parseInt(req.query.days) || 7;
      const data = await UsageService.getChartData(req.user.organizationId, days);
      res.json({ data });
    } catch (error) { next(error); }
  }
}

module.exports = UsageController;
