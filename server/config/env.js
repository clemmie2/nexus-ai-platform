module.exports = {
  port: Number(process.env.PORT || 3000),
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nexus_ai',
  discordClientId: process.env.DISCORD_CLIENT_ID || '',
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  discordCallbackUrl: process.env.DISCORD_CALLBACK_URL || 'http://localhost:3000/auth/discord/callback',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-me',
  aiProvider: process.env.AI_PROVIDER || 'openai',
  aiApiKey: process.env.AI_API_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || ''
};
