const publicBots = [
  {
    name: 'Aether',
    creator: 'Nexus Labs',
    description: 'Friendly community concierge for active Discord server environments.',
    tags: ['Community', 'Support'],
    servers: 148,
    popularity: 96
  },
  {
    name: 'Codec',
    creator: 'ByteForge',
    description: 'Developer assistant for build alerts, code explainers, and support macros.',
    tags: ['Developer', 'API'],
    servers: 91,
    popularity: 88
  },
  {
    name: 'Echo',
    creator: 'Rivet Studio',
    description: 'Roleplay storyteller tuned for events, quests, and lively chat communities.',
    tags: ['Roleplay', 'Events'],
    servers: 74,
    popularity: 80
  }
];

const renderPublicBots = () => {
  const root = document.getElementById('publicBots');
  if (!root) return;

  root.innerHTML = publicBots.map((bot) => `
    <article class="glass-panel public-bot-card">
      <div class="avatar avatar-lg"></div>
      <h3>${bot.name}</h3>
      <p>${bot.description}</p>
      <div class="tag-row">
        ${bot.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="stat-row"><span>Creator</span><strong>${bot.creator}</strong></div>
      <div class="stat-row"><span>Servers</span><strong>${bot.servers}</strong></div>
      <div class="stat-row"><span>Popularity</span><strong>${bot.popularity}%</strong></div>
      <button class="primary-btn" style="margin-top: 16px; width: 100%;">Open demo</button>
    </article>
  `).join('');
};

const bindSearch = () => {
  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');
  if (!input || !btn) return;

  btn.addEventListener('click', () => {
    const keyword = input.value.trim().toLowerCase();
    const filtered = publicBots.filter((bot) =>
      bot.name.toLowerCase().includes(keyword) ||
      bot.description.toLowerCase().includes(keyword) ||
      bot.tags.some((tag) => tag.toLowerCase().includes(keyword))
    );

    const root = document.getElementById('publicBots');
    root.innerHTML = filtered.map((bot) => `
      <article class="glass-panel public-bot-card">
        <div class="avatar avatar-lg"></div>
        <h3>${bot.name}</h3>
        <p>${bot.description}</p>
        <div class="tag-row">
          ${bot.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="stat-row"><span>Creator</span><strong>${bot.creator}</strong></div>
        <div class="stat-row"><span>Servers</span><strong>${bot.servers}</strong></div>
        <button class="primary-btn" style="margin-top: 16px; width: 100%;">Open demo</button>
      </article>
    `).join('');
  });
};

if (typeof window !== 'undefined') {
  renderPublicBots();
  bindSearch();
}
