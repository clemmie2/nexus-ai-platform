const demoStats = [
  { label: 'Total bots', value: '12' },
  { label: 'Online bots', value: '7' },
  { label: 'Messages', value: '56.5k' },
  { label: 'AI usage', value: '126k' }
];

const demoBots = [
  { name: 'Nova', status: 'online', servers: 35, messages: 13642, lastActive: '2 min ago' },
  { name: 'Sage', status: 'deploying', servers: 19, messages: 9241, lastActive: '12 min ago' },
  { name: 'Rook', status: 'offline', servers: 8, messages: 3140, lastActive: '1 hr ago' }
];

const activity = [
  { event: 'Nova deployed', time: '3 min ago' },
  { event: 'AI usage spike', time: '17 min ago' },
  { event: 'Sage updated personality', time: '42 min ago' }
];

const renderStats = () => {
  const statsRoot = document.getElementById('overviewStats');
  if (!statsRoot) return;

  statsRoot.innerHTML = demoStats.map((item) => `
    <div class="glass-panel stat-box">
      <p>${item.label}</p>
      <strong>${item.value}</strong>
    </div>
  `).join('');
};

const renderBots = () => {
  const root = document.getElementById('botCards');
  if (!root) return;

  root.innerHTML = demoBots.map((bot) => `
    <div class="bot-item">
      <div class="bot-meta">
        <div class="avatar avatar-sm"></div>
        <div>
          <strong>${bot.name}</strong><br />
          <small>${bot.servers} servers • ${bot.messages} messages</small>
        </div>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <span class="status-pill status-${bot.status}">${bot.status}</span>
        <button class="ghost-btn small-btn" data-bot="${bot.name}">Manage</button>
      </div>
    </div>
  `).join('');
};

const renderActivity = () => {
  const root = document.getElementById('activityList');
  if (!root) return;

  root.innerHTML = activity.map((item) => `
    <li><span>${item.event}</span><span>${item.time}</span></li>
  `).join('');
};

const bindButtons = () => {
  document.querySelectorAll('[data-action="create-bot"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Nova Builder',
          username: 'nova_builder',
          description: 'A fresh AI bot ready for deployment.',
          status: 'draft',
          accentColor: '#7c78ff'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Bot created successfully.');
        window.location.href = '/dashboard.html';
      } else {
        alert(data.error || 'Unable to create bot.');
      }
    });
  });
};

if (typeof window !== 'undefined') {
  renderStats();
  renderBots();
  renderActivity();
  bindButtons();
}
