// UI utilities

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
`;
document.head.appendChild(style);

// Load initial data
window.addEventListener('DOMContentLoaded', () => {
  loadLessons();
  if (authToken) {
    updateDashboard();
  }
});
