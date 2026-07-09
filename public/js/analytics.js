// Analytics Dashboard

let analyticsData = null;

async function loadAnalytics() {
  if (!authToken) {
    notify('Please sign in to view analytics.');
    return;
  }

  try {
    const response = await apiCall('/analytics/dashboard');
    analyticsData = response;
    renderAnalyticsDashboard(response);
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
}

function renderAnalyticsDashboard(data) {
  // Update overview cards
  document.getElementById('ana-level').textContent = data.user.level || 0;
  document.getElementById('ana-xp').textContent = data.user.total_xp || 0;
  document.getElementById('ana-streak').textContent = data.user.streak || 0;

  // Update progress bars
  const langProgress = data.learning.language_progress || 0;
  const codeProgress = data.learning.code_progress || 0;

  document.getElementById('ana-lang-progress').querySelector('.progress-fill').style.width = langProgress + '%';
  document.getElementById('ana-lang-text').textContent = langProgress + '%';

  document.getElementById('ana-code-progress').querySelector('.progress-fill').style.width = codeProgress + '%';
  document.getElementById('ana-code-text').textContent = codeProgress + '%';

  // Update coding stats
  document.getElementById('ana-submissions').textContent = data.coding.submissions || 0;
  document.getElementById('ana-passed').textContent = data.coding.passed || 0;
  document.getElementById('ana-avg-score').textContent = (data.coding.avg_score || 0) + '%';

  // Update lessons completed
  const lessonsCompleted = data.learning.lessons_completed || 0;
  const lessonsPercent = Math.round((lessonsCompleted / 25) * 100);
  document.getElementById('ana-lessons-completed').textContent = lessonsCompleted;
  document.getElementById('ana-lessons-bar').querySelector('.progress-fill').style.width = lessonsPercent + '%';

  // Update leaderboard rank
  document.getElementById('ana-rank').textContent = data.leaderboard_rank || 'Unranked';
}

function viewAnalytics() {
  scrollToSection('analytics');
  document.getElementById('analytics').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
  loadAnalytics();
}
