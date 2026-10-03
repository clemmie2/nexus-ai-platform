const express = require('express');
const { prisma } = require('../database/prisma');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/user', authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      bots: { include: { config: true, personality: true } },
      subscriptions: true,
      apiKeys: true,
      usage: true
    }
  });

  res.json({ success: true, user });
});

router.get('/user/usage', authRequired, async (req, res) => {
  const usage = await prisma.usage.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  res.json({ success: true, usage });
});

module.exports = { userRoutes: router };
