document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('publicBots');
  if (!root) return;

  const cards = [
    { name: 'Aether', creator: 'Nexus Labs', description: 'A welcoming community assistant for onboarding, support, and server guidance.', tags: ['Community', 'Support'], servers: 148 },
    { name: 'Code Nova', creator: 'ByteForge', description: 'A coding companion for developer channels and project updates.', tags: ['Developer', 'AI'], servers: 91 },
    { name: 'Echo', creator: 'Rivet Studio', description: 'Story-driven roleplay character built for events and immersive communities.', tags: ['Roleplay', 'Events'], servers: 74 }
  ];

  root.innerHTML = cards.map((bot) => `
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
