const express = require('express');
const { z } = require('zod');
const { prisma } = require('../database/prisma');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

const toolSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().min(5).max(250),
  permissions: z.object({}).passthrough().optional(),
  config: z.object({}).passthrough().optional(),
  isEnabled: z.boolean().optional(),
  usageLimit: z.number().int().optional()
});

router.post('/tools', authRequired, async (req, res) => {
  const parsed = toolSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid tool definition.' });
  }

  const { botId, ...rest } = req.body;
  if (!botId) {
    return res.status(400).json({ success: false, error: 'Bot ID is required.' });
  }

  const bot = await prisma.bot.findFirst({
    where: { id: botId, ownerId: req.user.id, isDeleted: false }
  });

  if (!bot) {
    return res.status(404).json({ success: false, error: 'Bot not found.' });
  }

  const tool = await prisma.tool.create({
    data: {
      botId,
      name: parsed.data.name,
      description: parsed.data.description,
      permissions: parsed.data.permissions || {},
      config: parsed.data.config || {},
      isEnabled: parsed.data.isEnabled ?? true,
      usageLimit: parsed.data.usageLimit ?? 100
    }
  });

  res.status(201).json({ success: true, tool });
});

module.exports = { toolRoutes: router };
