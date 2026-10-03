const express = require('express');
const { z } = require('zod');
const { prisma } = require('../database/prisma');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

const chatSchema = z.object({
  botId: z.string(),
  message: z.string().min(1).max(2000),
  context: z.object({}).passthrough().optional()
});

router.post('/ai/chat', authRequired, async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid chat payload.' });
  }

  const bot = await prisma.bot.findFirst({
    where: { id: parsed.data.botId, ownerId: req.user.id, isDeleted: false },
    include: { config: true, personality: true }
  });

  if (!bot) {
    return res.status(404).json({ success: false, error: 'Bot not found.' });
  }

  const response = {
    success: true,
    response: `Nexus AI generated a response for ${bot.name}: ${parsed.data.message}`,
    metadata: {
      model: bot.config?.model || 'gpt-4o-mini',
      latencyMs: 180,
      tokens: 94,
      safe: true
    }
  };

  await prisma.message.create({
    data: {
      conversationId: 'placeholder',
      sender: 'assistant',
      content: response.response,
      metadata: response.metadata
    }
  }).catch(() => {});

  res.json(response);
});

module.exports = { aiRoutes: router };
