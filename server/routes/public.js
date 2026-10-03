const express = require('express');
const { prisma } = require('../database/prisma');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/public/bots', async (req, res) => {
  const bots = await prisma.bot.findMany({
    where: { isPublic: true, isDeleted: false },
    include: { config: true, personality: true },
    take: 20
  });

  res.json({ success: true, bots });
});

router.get('/public/bots/:id', async (req, res) => {
  const bot = await prisma.bot.findFirst({
    where: { id: req.params.id, isPublic: true, isDeleted: false },
    include: { config: true, personality: true }
  });

  if (!bot) return res.status(404).json({ success: false, error: 'Public bot not found.' });

  res.json({ success: true, bot });
});

router.get('/admin/users', authRequired, async (req, res) => {
  if (req.user.role !== 'platform_owner' && !req.user.isAdmin) {
    return res.status(403).json({ success: false, error: 'Admin access required.' });
  }

  const users = await prisma.user.findMany({ take: 50 });
  res.json({ success: true, users });
});

module.exports = { publicRoutes: router };
