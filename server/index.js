const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: DiscordStrategy } = require('passport-discord');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const http = require('http');
const { Server } = require('socket.io');
const { z } = require('zod');
require('dotenv').config();

const env = require('./config/env');
const { prisma } = require('./database/prisma');
const { errorHandler } = require('./middleware/error');
const { authRequired, optionalAuth, requireRole } = require('./middleware/auth');
const { botRoutes } = require('./routes/bots');
const { authRoutes } = require('./routes/auth');
const { serverRoutes } = require('./routes/servers');
const { userRoutes } = require('./routes/user');
const { aiRoutes } = require('./routes/ai');
const { toolRoutes } = require('./routes/tools');
const { publicRoutes } = require('./routes/public');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", 'ws:', 'wss:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com']
    }
  }
}));
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
});
app.use(sessionMiddleware);

if (env.discordClientId && env.discordClientSecret) {
  passport.use(new DiscordStrategy({
    clientID: env.discordClientId,
    clientSecret: env.discordClientSecret,
    callbackURL: env.discordCallbackUrl,
    scope: ['identify', 'guilds']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existing = await prisma.user.findUnique({
        where: { discordId: profile.id }
      });

      if (existing) {
        return done(null, existing);
      }

      const user = await prisma.user.create({
        data: {
          discordId: profile.id,
          username: profile.username || 'discord-user',
          avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
          email: profile.email || null,
          role: 'bot_creator'
        }
      });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user || null);
  } catch (error) {
    done(error);
  }
});
app.use(passport.initialize());
app.use(passport.session());

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Rate limit reached.' }
});
app.use('/api', apiLimiter);

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/api', botRoutes);
app.use('/api', serverRoutes);
app.use('/api', userRoutes);
app.use('/api', aiRoutes);
app.use('/api', toolRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', service: 'nexus-ai-platform' });
});

io.on('connection', (socket) => {
  socket.emit('server:status', { message: 'Realtime connection ready.' });

  socket.on('bot:subscribe', (botId) => {
    if (botId) socket.join(`bot:${botId}`);
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

app.use(errorHandler);

const port = env.port || 3000;

server.listen(port, () => {
  console.log(`Nexus AI Platform running on http://localhost:${port}`);
});

module.exports = { app, io };
