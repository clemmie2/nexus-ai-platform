const express = require('express');
const { prisma } = require('../database/prisma');
const { z } = require('zod');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

const botSchema = z.object({
  name: z.string().min(2).max(80),
  username: z.string().min(2).max(40),
  description: z.string().max(500).optional(),
  status: z.string().optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  isPublic: z.boolean().optional()
});

router.get('/bots', authRequired, async (req, res) => {
  const bots = await prisma.bot.findMany({
    where: { ownerId: req.user.id, isDeleted: false },
    include: { config: true, personality: true, servers: true }
  });

  res.json({ success: true, bots });
});

router.post('/bots', authRequired, async (req, res) => {
  const parsed = botSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid bot configuration.' });
  }

  const bot = await prisma.bot.create({
    data: {
      ownerId: req.user.id,
      name: parsed.data.name,
      username: parsed.data.username,
      description: parsed.data.description || '',
      status: parsed.data.status || 'draft',
      accentColor: parsed.data.accentColor || '#7c78ff',
      isPublic: !!parsed.data.isPublic,
      config: {
        create: {
          aiProvider: 'openai',
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 1200,
          contextWindow: 8192,
          memorySettings: { shortTerm: 20, longTerm: 100 },
          toolPermissions: { webAccess: false, imageGeneration: false, fileUnderstanding: false }
        }
      },
      personality: {
        create: {
          shortDescription: parsed.data.description || 'A helpful AI assistant.',
          longDescription: 'An intelligent companion tailored for Discord communities.',
          tone: 'friendly',
          humor: 'light',
          formality: 'balanced',
          friendliness: 'warm',
          intelligenceStyle: 'practical',
          responseLength: 'medium',
          writingStyle: 'clear',
          conversationRules: 'Stay helpful and concise.'
        }
      }
    },
    include: { config: true, personality: true }
  });

  res.status(201).json({ success: true, bot });
});

router.get('/bots/:id', authRequired, async (req, res) => {
  const bot = await prisma.bot.findFirst({
    where: { id: req.params.id, ownerId: req.user.id, isDeleted: false },
    include: { config: true, personality: true, conversations: true, memories: true, servers: true }
  });

  if (!bot) return res.status(404).json({ success: false, error: 'Bot not found.' });

  res.json({ success: true, bot });
});

router.patch('/bots/:id', authRequired, async (req, res) => {
  const bot = await prisma.bot.findFirst({
    where: { id: req.params.id, ownerId: req.user.id, isDeleted: false }
  });

  if (!bot) return res.status(404).json({ success: false, error: 'Bot not found.' });

  const updated = await prisma.bot.update({
    where: { id: bot.id },
    data: { ...req.body, updatedAt: new Date() },
    include: { config: true, personality: true }
  });

  res.json({ success: true, bot: updated });
});

router.delete('/bots/:id', authRequired, async (req, res) => {
  const bot = await prisma.bot.findFirst({
    where: { id: req.params.id, ownerId: req.user.id, isDeleted: false }
  });

  if (!bot) return res.status(404).json({ success: false, error: 'Bot not found.' });

  await prisma.bot.update({
    where: { id: bot.id },
    data: { isDeleted: true, status: 'archived' }
  });

  res.json({ success: true, message: 'Bot deleted.' });
});

router.post('/bots/:id/deploy', authRequired, async (req, res) => {
  const bot = await prisma.bot.findFirst({
    where: { id: req.params.id, ownerId: req.user.id, isDeleted: false }
  });

  if (!bot) return res.status(404).json({ success: false, error: 'Bot not found.' });

  const deployment = await prisma.deployment.create({
    data: {
      botId: bot.id,
      version: 'v1.0.0',
      status: 'deploying',
      target: 'discord',
      logs: 'Deployment started.'
    }
  });

  await prisma.bot.update({
    where: { id: bot.id },
    data: { status: 'deploying' }
  });

  res.status(202).json({ success: true, deployment, message: 'Bot deployment started.' });
});

router.post('/bots/:id/stop', authRequired, async (req, res) => {
  const bot = await prisma.bot.findFirst({
    where: { id: req.params.id, ownerId: req.user.id, isDeleted: false }
  });

  if (!bot) return res.status(404).json({ success: false, error: 'Bot not found.' });

  await prisma.bot.update({
    where: { id: bot.id },
    data: { status: 'offline' }
  });

  res.json({ success: true, message: 'Bot stopped.' });
});

router.post('/bots/:id/restart', authRequired, async (req, res) => {
  const bot = await prisma.bot.findFirst({
    where: { id: req.params.id, ownerId: req.user.id, isDeleted: false }
  });

  if (!bot) return res.status(404).json({ success: false, error: 'Bot not found.' });

  await prisma.bot.update({
    where: { id: bot.id },
    data: { status: 'online' }
  });

  res.json({ success: true, message: 'Bot restarted.' });
});

router.get('/bots/:id/logs', authRequired, async (req, res) => {
  const logs = await prisma.logEntry.findMany({
    where: { botId: req.params.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  res.json({ success: true, logs });
});

router.get('/bots/:id/analytics', authRequired, async (req, res) => {
  const analytics = await prisma.analytics.findMany({
    where: { botId: req.params.id },
    orderBy: { createdAt: 'desc' },
    take: 30
  });

  res.json({ success: true, analytics });
});

module.exports = { botRoutes: router };
