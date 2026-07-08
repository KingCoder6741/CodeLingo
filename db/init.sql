-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  plan VARCHAR(50) DEFAULT 'NONE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress_language INT DEFAULT 0,
  progress_code INT DEFAULT 0,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 0,
  daily_streak INT DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  lesson_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  level INT DEFAULT 1,
  xp_reward INT DEFAULT 20,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lesson steps table
CREATE TABLE IF NOT EXISTS lesson_steps (
  id SERIAL PRIMARY KEY,
  lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content TEXT NOT NULL
);

-- User lesson completion table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  xp_threshold INT NOT NULL
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  correct_option_index INT NOT NULL
);

-- Quiz options table
CREATE TABLE IF NOT EXISTS quiz_options (
  id SERIAL PRIMARY KEY,
  quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_index INT NOT NULL
);

-- Leaderboard (view based on XP)
CREATE VIEW leaderboard AS
SELECT 
  u.id,
  u.name,
  p.total_xp,
  p.level,
  ROW_NUMBER() OVER (ORDER BY p.total_xp DESC) as rank
FROM users u
JOIN progress p ON u.id = p.user_id
ORDER BY p.total_xp DESC;

CREATE INDEX idx_user_id ON progress(user_id);
CREATE INDEX idx_lesson_id ON lesson_steps(lesson_id);
CREATE INDEX idx_user_lesson ON user_lesson_progress(user_id, lesson_id);
