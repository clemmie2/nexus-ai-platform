class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai';
  }

  async chat({ bot, message, context = {} }) {
    return {
      content: `AI response for ${bot.name}: ${message}`,
      metadata: {
        model: bot.config?.model || 'gpt-4o-mini',
        latencyMs: 210,
        safe: true,
        tokens: 85
      }
    };
  }
}

module.exports = { AIService };
