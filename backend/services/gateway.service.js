const RoutingService = require('./routing.service');
const GroqAdapter = require('../providers/groq/groq.adapter');
const UsageLog = require('../models/UsageLog');
const logger = require('../utils/logger');

class GatewayService {
  static async handleChatCompletions(user, organizationId, payload) {
    const startTime = Date.now();
    let provider = 'groq'; // Default to Groq for phase 1

    try {
      // 1. Select the best provider key using the routing engine
      const { keyId, apiKey } = await RoutingService.selectBestKey(organizationId, provider);
      
      // 2. Initialize provider adapter
      const adapter = new GroqAdapter(apiKey);
      
      // 3. Forward request
      const response = await adapter.chatCompletions(payload);

      // 4. Calculate Tokens (For MVP, parse from response, or estimate)
      // Groq provides usage in non-streaming responses
      let inputTokens = 0;
      let outputTokens = 0;
      let totalTokens = 0;
      
      if (!payload.stream && response.data.usage) {
        inputTokens = response.data.usage.prompt_tokens || 0;
        outputTokens = response.data.usage.completion_tokens || 0;
        totalTokens = response.data.usage.total_tokens || 0;
      }

      // 5. Log usage async
      const responseTime = Date.now() - startTime;
      
      this.logUsage({
        userId: user.userId,
        organizationId: organizationId,
        provider,
        model: payload.model || 'unknown',
        inputTokens,
        outputTokens,
        totalTokens,
        responseTimeMs: responseTime,
        status: response.status
      });

      // 6. Return response to controller
      return response;
    } catch (error) {
      logger.error(`Gateway Error: ${error.message}`);
      
      // Log failed request
      const responseTime = Date.now() - startTime;
      this.logUsage({
        userId: user.userId,
        organizationId: organizationId,
        provider,
        model: payload.model || 'unknown',
        status: error.response?.status || 500,
        responseTimeMs: responseTime
      });
      
      throw error;
    }
  }

  static async logUsage(logData) {
    try {
      await UsageLog.create(logData);
    } catch (error) {
      logger.error(`Failed to record usage log: ${error.message}`);
    }
  }
}

module.exports = GatewayService;
