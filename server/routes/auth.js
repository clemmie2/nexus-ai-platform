const express = require('express');
const { z } = require('zod');
const { prisma } = require('../database/prisma');
const { createToken } = require('../utils/crypto');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/discord', (req, res) => {
  const { discordClientId, discordCallbackUrl } = require('../config/env');

  if (!discordClientId || !discordCallbackUrl) {
    return res.status(400).json({
      success: false,
      error: 'Discord OAuth is not configured. Set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in your .env file.'
    });
  }

  const scope = 'identify guilds';
  const url = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(discordCallbackUrl)}&response_type=code&scope=${encodeURIComponent(scope)}`;
  res.redirect(url);
});

router.get('/discord/callback', async (req, res) => {
  const { discordClientId, discordClientSecret, discordCallbackUrl } = require('../config/env');

  if (!discordClientId || !discordClientSecret) {
    return res.status(400).json({
      success: false,
      error: 'Discord OAuth is not configured. Set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in your .env file.'
    });
  }

  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ success: false, error: 'No OAuth code received.' });
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: discordClientId,
        client_secret: discordClientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: discordCallbackUrl
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Discord token exchange failed.');
    }

    const tokenData = await tokenResponse.json();
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Discord user data.');
    }

    const discordUser = await userResponse.json();

    let user = await prisma.user.findUnique({ where: { discordId: discordUser.id } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          discordId: discordUser.id,
          username: discordUser.username,
          avatar: discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : null,
          role: 'bot_creator'
        }
      });
    }

    req.login(user, (err) => {
      if (err) throw err;
      const token = createToken(user);
      res.cookie('nexus_token', token, { httpOnly: true, sameSite: 'lax' });
      res.redirect('/dashboard.html');
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Discord connection failed.' });
  }
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('nexus_token');
    res.redirect('/');
  });
});

router.get('/me', authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      subscriptions: true,
      apiKeys: true,
      bots: { include: { config: true, personality: true } }
    }
  });

  res.json({ success: true, user });
});

module.exports = { authRoutes: router };
