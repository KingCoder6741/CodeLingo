// Progress and XP management

let currentLessonId = null;

async function updateDashboard() {
  if (!authToken) return;

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const progress = await getProgress();

    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('dash-name').innerText = user.name || 'User';
    document.getElementById('dash-plan').innerText =
      user.plan === 'FREE_YOUTH' ? 'Youth Free Access' : 'Standard';
    document.getElementById('dash-level').innerText = progress.level || 0;
    document.getElementById('dash-xp').innerText = progress.total_xp || 0;
    document.getElementById('dash-streak').innerText = progress.daily_streak || 0;
    document.getElementById('dash-title').innerText = getTitleByXP(progress.total_xp);

    // Update hero card
    document.getElementById('hero-lang-xp').innerText = progress.progress_language + ' XP';
    document.getElementById('hero-code-xp').innerText = progress.progress_code + ' XP';
    document.getElementById('hero-level').innerText = progress.level || 0;
    document.getElementById('hero-streak').innerText = (progress.daily_streak || 0) + ' 🔥';
  } catch (error) {
    console.error('Failed to update dashboard:', error);
  }
}

function getTitleByXP(xp) {
  if (xp >= 1000) return 'Mastermind';
  if (xp >= 600) return 'Prodigy';
  if (xp >= 300) return 'Creator';
  return 'Learner';
}

async function completeLesson() {
  if (!currentLessonId) {
    notify('No lesson selected.');
    return;
  }

  try {
    const response = await completeLesson(currentLessonId);
    notify(`${response.message}! +${response.xp_gained} XP`);
    closeLessonModal();
    updateDashboard();
  } catch (error) {
    // Error already shown
  }
}
