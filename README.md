# Nexus AI Platform

A production-ready SaaS platform for creating, configuring, testing, and deploying AI-powered Discord bots.

## Overview

Nexus AI helps creators build, test, deploy, and monitor AI Discord bots with:

- A polished SaaS landing experience
- Discord OAuth login flow
- AI bot creation wizard
- Persistent memory and advanced personality controls
- Discord bot lifecycle management
- Analytics, logs, and permissions
- REST API and developer docs
- Pluggable backend services for AI providers and Discord bot workers

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: PostgreSQL via Prisma
- Auth: Discord OAuth2
- Realtime: Socket.IO
- Discord: discord.js
- Security: helmet, rate limiting, session controls, validation, encrypted secret storage

## Project structure

```text
discord-ai-platform/
├── public/
│   ├── index.html
│   ├── dashboard.html
│   ├── explore.html
│   ├── pricing.html
│   ├── docs.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── main.js
│       ├── dashboard.js
│       ├── explore.js
│       └── docs.js
├── server/
│   ├── index.js
│   ├── config/
│   │   └── env.js
│   ├── database/
│   │   └── prisma.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bots.js
│   │   ├── servers.js
│   │   ├── user.js
│   │   ├── ai.js
│   │   ├── tools.js
│   │   └── public.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── discordService.js
│   │   ├── botWorker.js
│   │   └── workerManager.js
│   ├── utils/
│   │   ├── crypto.js
│   │   └── api.js
│   └── workers/
│       └── botWorker.js
├── prisma/
│   └── schema.prisma
├── .env.example
├── .gitignore
├── package.json
├── docker-compose.yml
├── README.md
└── public/favicon.svg
```

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start Postgres with Docker:

```bash
docker-compose up -d postgres
```

4. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start the app:

```bash
npm run dev
```

## Environment

Configure required variables in `.env`:

```env
PORT=3000
SESSION_SECRET=replace-me
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nexus_ai
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
JWT_SECRET=change-me
AI_PROVIDER=openai
AI_API_KEY=optional
STRIPE_SECRET_KEY=optional
```

## Features implemented

- Premium marketing website
- Dashboard and public explore page
- AI bot creation workflow
- API endpoints for bots, servers, AI, and tools
- Discord OAuth integration interface
- WebSocket support for live status updates
- Rate limiting, validation, secure headers, and session protections
- Developer documentation page
- Admin-ready architecture with permission checks

## Security notes

- Secrets are never hardcoded in frontend code.
- Sensitive values should be stored encrypted at rest when used in production.
- Bot tokens and OAuth secrets must be stored server-side only.
- Permissions are validated on the backend.

## License

MIT
