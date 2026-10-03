const { prisma } = require('../database/prisma');
const { createToken } = require('../utils/crypto');

const demoUser = {
  id: 'demo-user-1',
  username: 'clemmie2',
  avatar: 'https://images.unsplash.com/...'
};

const createDemoSession = () => ({
  id: demoUser.id,
  username: demoUser.username,
  avatar: demoUser.avatar,
  role: 'platform_owner'
});

const getDemoContext = async () => ({
  stats: {
    totalBots: 12,
    onlineBots: 7,
    messages: 56540,
    aiUsage: 126000,
    servers: 84
  },
  bots: [
    { id: 'demo-bot-1', name: 'Nova', status: 'online', servers: 35, messages: 13642, lastActive: '2 minutes ago' },
    { id: 'demo-bot-2', name: 'Sage', status: 'deploying', servers: 19, messages: 9241, lastActive: '12 minutes ago' },
    { id: 'demo-bot-3', name: 'Rook', status: 'offline', servers: 8, messages: 3140, lastActive: '1 hour ago' }
  ],
  publicBots: [
    { id: 'public-1', name: 'Aether', description: 'Friendly community concierge for large Discord communities.', creator: 'Nexus Labs', tags: ['Community', 'Support'], servers: 148, popularity: 96 },
    { id: 'public-2', name: 'Codec', description: 'A developer assistant for build alerts and code explainers.', creator: 'ByteForge', tags: ['Developer', 'Code'], servers: 91, popularity: 88 },
    { id: 'public-3', name: 'Echo', description: 'Roleplay storyteller built for lively communities.', creator: 'Rivet Studio', tags: ['Roleplay', 'Events'], servers: 74, popularity: 80 }
  ]
});

module.exports = { demoUser, createDemoSession, getDemoContext };
