document.addEventListener('DOMContentLoaded', async () => {
  const refreshButton = document.getElementById('refreshData');
  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      if (data.success && data.user) {
        const user = data.user;
        document.title = `${user.username} | Nexus AI Dashboard`;
      }
    } catch (error) {
      console.warn('No authenticated session; showing demo dashboard.', error);
    }
  };

  refreshButton?.addEventListener('click', fetchDashboard);
  fetchDashboard();
});
