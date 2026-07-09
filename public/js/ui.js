// UI utilities and page navigation

function notify(message) {
  // Simple notification
  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 240, 122, 0.9);
    color: #000;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  el.innerText = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Navigation helpers
function showLessons() {
  document.getElementById('lessons').style.display = 'block';
  document.getElementById('sandbox').style.display = 'none';
  document.getElementById('analytics').style.display = 'none';
  document.getElementById('dashboard').style.display = 'none';
  scrollToSection('lessons');
}

function updateNavBar() {
  const navAuthGroup = document.getElementById('nav-auth-group');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (authToken && user.name) {
    navAuthGroup.innerHTML = `
      <span style="font-size: 14px; color: var(--text-soft);">Welcome, ${user.name}!</span>
      <button class="nav-cta" onclick="viewDashboard()">Dashboard</button>
      <button class="nav-cta" style="background: rgba(10, 26, 47, 0.9); color: var(--white);" onclick="logout()">Logout</button>
    `;
  }
}

function viewDashboard() {
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('lessons').style.display = 'none';
  document.getElementById('sandbox').style.display = 'none';
  document.getElementById('analytics').style.display = 'none';
  scrollToSection('dashboard');
  updateDashboard();
}

// Add slide-in animation
const style = document.createElement('style');
style.innerText = `
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Load initial data
window.addEventListener('DOMContentLoaded', () => {
  // Check if redirected from OAuth
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (token) {
    authToken = token;
    localStorage.setItem('authToken', token);
    window.history.replaceState({}, document.title, window.location.pathname);
    notify('✅ Logged in successfully!');
    loadLessons();
    updateDashboard();
    updateNavBar();
  } else {
    loadLessons();
    if (authToken) {
      updateDashboard();
      updateNavBar();
    }
  }
});
