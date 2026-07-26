const axios = require('axios');
const logger = require('../../utils/logger');

class GroqAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.groq.com/openai/v1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async chatCompletions(payload) {
    try {
      const response = await this.client.post('/chat/completions', payload, {
        responseType: payload.stream ? 'stream' : 'json'
      });
      return response;
    } catch (error) {
      logger.error(`Groq API Error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = GroqAdapter;
