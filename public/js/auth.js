// Auth UI and logic

function openAuth() {
  if (authToken) {
    logout();
  } else {
    document.getElementById('auth-modal').classList.remove('hidden');
  }
}

function closeAuth() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function loginMode() {
  document.getElementById('auth-name').style.display = 'none';
  document.getElementById('auth-mode-text').innerText = 'Sign in to your account';
  // Update button to login instead
  const btn = document.querySelector('#auth-modal button.btn-primary');
  btn.onclick = () => loginUser();
}

async function registerUser() {
  const name = document.getElementById('auth-name').value;
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-pass').value;
  const age = parseInt(document.getElementById('auth-age').value);

  if (!name || !email || !password || isNaN(age)) {
    notify('Please fill in all fields.');
    return;
  }

  try {
    const response = await register(name, email, password, age);
    notify(response.message);
    closeAuth();
    updateDashboard();
    loadLessons();
  } catch (error) {
    // Error already shown by apiCall
  }
}

async function loginUser() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-pass').value;

  if (!email || !password) {
    notify('Please enter email and password.');
    return;
  }

  try {
    const response = await login(email, password);
    notify('Login successful!');
    closeAuth();
    updateDashboard();
    loadLessons();
  } catch (error) {
    // Error already shown by apiCall
  }
}

function logout() {
  authToken = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  notify('Logged out');
  document.getElementById('dashboard').style.display = 'none';
  loadLessons();
}
