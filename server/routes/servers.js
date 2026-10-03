const express = require('express');
const { prisma } = require('../database/prisma');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/servers', authRequired, async (req, res) => {
  const servers = await prisma.discordServer.findMany({
    where: { ownerId: req.user.id },
    include: { settings: true }
  });

  res.json({ success: true, servers });
});

router.get('/servers/:id', authRequired, async (req, res) => {
  const server = await prisma.discordServer.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    include: { settings: true }
  });

  if (!server) return res.status(404).json({ success: false, error: 'Server not found.' });

  res.json({ success: true, server });
});

router.patch('/servers/:id/settings', authRequired, async (req, res) => {
  const server = await prisma.discordServer.findFirst({
    where: { id: req.params.id, ownerId: req.user.id }
  });

  if (!server) return res.status(404).json({ success: false, error: 'Server not found.' });

  const settings = await prisma.serverSetting.upsert({
    where: { serverId: server.id },
    update: req.body,
    create: {
      serverId: server.id,
      ...req.body
    }
  });

  res.json({ success: true, settings });
});

module.exports = { serverRoutes: router };
