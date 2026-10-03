const { Client, GatewayIntentBits } = require('discord.js');

class DiscordService {
  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
    });
    this.ready = false;
  }

  async login(token) {
    if (!token) {
      throw new Error('Discord bot token not provided.');
    }

    await this.client.login(token);
    this.ready = true;
    return this.client;
  }

  async shutdown() {
    if (this.client && this.client.isReady()) {
      await this.client.destroy();
    }
    this.ready = false;
  }
}

module.exports = { DiscordService };
