// API Base URL
const API_URL = 'http://localhost:5000/api';

// Store auth token
let authToken = localStorage.getItem('authToken');

// Generic API call helper
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (authToken) {
    options.headers.Authorization = `Bearer ${authToken}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || 'API request failed');
    }

    return json;
  } catch (error) {
    console.error('API Error:', error);
    notify(`Error: ${error.message}`);
    throw error;
  }
}

// Auth endpoints
async function register(name, email, password, age) {
  const response = await apiCall('/auth/register', 'POST', {
    name,
    email,
    password,
    age,
  });
  authToken = response.token;
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('user', JSON.stringify(response.user));
  return response;
}

async function login(email, password) {
  const response = await apiCall('/auth/login', 'POST', {
    email,
    password,
  });
  authToken = response.token;
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('user', JSON.stringify(response.user));
  return response;
}

// User endpoints
async function getProfile() {
  return await apiCall('/users/me');
}

async function getLeaderboard() {
  return await apiCall('/users/leaderboard');
}

// Lesson endpoints
async function getLessons() {
  return await apiCall('/lessons');
}

async function getLesson(id) {
  return await apiCall(`/lessons/${id}`);
}

async function getQuizzes(lessonId) {
  return await apiCall(`/lessons/${lessonId}/quizzes`);
}

// Progress endpoints
async function getProgress() {
  return await apiCall('/progress');
}

async function addXP(type, amount) {
  return await apiCall('/progress/xp', 'POST', { type, amount });
}

async function completeLesson(lessonId) {
  return await apiCall(`/progress/lesson/${lessonId}/complete`, 'POST');
}
