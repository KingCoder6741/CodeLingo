// Lesson loading and display

let lessons = [];

async function loadLessons() {
  try {
    lessons = await getLessons();
    renderLessons();
    renderPricing();
  } catch (error) {
    console.error('Failed to load lessons:', error);
  }
}

function renderLessons() {
  const grid = document.getElementById('lessons-grid');
  grid.innerHTML = lessons
    .map(
      (lesson) => `
    <div class="card" onclick="openLesson(${lesson.id})">
      <div class="card-label">${lesson.category.toUpperCase()}</div>
      <div class="card-title">${lesson.title}</div>
      <div class="card-text">${lesson.description || 'Learn the basics'}</div>
      <div class="pill-row">
        <span class="pill">Level ${lesson.level}</span>
        <span class="pill">+${lesson.xp_reward} XP</span>
      </div>
    </div>
  `
    )
    .join('');
}

function renderPricing() {
  const grid = document.getElementById('pricing-grid');
  const plans = [
    {
      name: 'Free',
      desc: 'Forever',
      features: ['All lessons', 'Community', 'Basic badges'],
    },
    {
      name: 'Youth Free',
      desc: 'Under 18',
      features: ['Everything', 'No ads', 'Premium badge'],
      badge: true,
    },
    {
      name: 'Pro',
      desc: '$4.99/mo',
      features: ['All features', 'Priority support', 'Custom avatar'],
    },
    {
      name: 'Premium',
      desc: '$9.99/mo',
      features: ['Everything', 'Offline access', '1-on-1 coaching'],
    },
  ];

  grid.innerHTML = plans
    .map(
      (plan) => `
    <div class="price-card">
      <div class="price-name">${plan.name}</div>
      <div class="price-tag">${plan.desc}</div>
      <ul class="price-list">
        ${plan.features.map((f) => `<li>✓ ${f}</li>`).join('')}
      </ul>
      ${plan.badge ? '<span class="youth-badge">🎓 For You</span>' : ''}
    </div>
  `
    )
    .join('');
}

async function openLesson(id) {
  if (!authToken) {
    notify('Please sign in first.');
    openAuth();
    return;
  }

  try {
    currentLessonId = id;
    const lesson = await getLesson(id);
    document.getElementById('lesson-title').innerText = lesson.title;
    document.getElementById('lesson-steps').innerHTML = lesson.steps
      .map((step) => `<li>${step.content}</li>`)
      .join('');
    document.getElementById('lesson-modal').style.display = 'flex';
  } catch (error) {
    console.error('Failed to load lesson:', error);
  }
}

function closeLessonModal() {
  document.getElementById('lesson-modal').style.display = 'none';
  currentLessonId = null;
}
