const GatewayService = require('../services/gateway.service');

class GatewayController {
  static async chatCompletions(req, res, next) {
    try {
      // In a real scenario, this would be authorized by the APIKey validation middleware
      // which would set req.organizationId and req.user based on the API Key.
      // For now, we'll use the JWT authMiddleware's req.user (for testing)
      
      const user = req.user;
      const organizationId = req.user.organizationId;
      const payload = req.body;

      if (!payload.model) {
        return res.status(400).json({ error: 'model is required' });
      }
      if (!payload.messages || !Array.isArray(payload.messages)) {
        return res.status(400).json({ error: 'messages array is required' });
      }

      const response = await GatewayService.handleChatCompletions(user, organizationId, payload);

      if (payload.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        response.data.pipe(res);
      } else {
        res.status(response.status).json(response.data);
      }
    } catch (error) {
      if (error.response) {
        // Forward provider error
        res.status(error.response.status).json(error.response.data);
      } else {
        next(error);
      }
    }
  }
}

module.exports = GatewayController;
