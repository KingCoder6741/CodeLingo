import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.userId;

    // User progress
    const progressResult = await pool.query(
      `SELECT u.name, u.created_at, p.total_xp, p.level, p.daily_streak,
              p.progress_language, p.progress_code
       FROM users u
       JOIN progress p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    // Lessons completed
    const lessonsResult = await pool.query(
      `SELECT COUNT(*) as total_completed,
              SUM(l.xp_reward) as total_xp_earned
       FROM user_lesson_progress ulp
       JOIN lessons l ON ulp.lesson_id = l.id
       WHERE ulp.user_id = $1 AND ulp.completed = TRUE`,
      [userId]
    );

    // Code submissions
    const submissionsResult = await pool.query(
      `SELECT COUNT(*) as total_submissions,
              SUM(CASE WHEN passed = TRUE THEN 1 ELSE 0 END) as passed_submissions,
              AVG(score) as avg_score
       FROM code_submissions
       WHERE user_id = $1`,
      [userId]
    );

    // Weekly activity
    const weeklyResult = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as activity_count
       FROM user_lesson_progress
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [userId]
    );

    // Rank on leaderboard
    const rankResult = await pool.query(
      `SELECT rank FROM leaderboard WHERE id = $1`,
      [userId]
    );

    const user = progressResult.rows[0];
    const lessons = lessonsResult.rows[0];
    const submissions = submissionsResult.rows[0];

    res.json({
      user: {
        name: user.name,
        joined: user.created_at,
        level: user.level,
        total_xp: user.total_xp,
        streak: user.daily_streak,
      },
      learning: {
        language_progress: user.progress_language,
        code_progress: user.progress_code,
        lessons_completed: parseInt(lessons.total_completed) || 0,
        xp_from_lessons: parseInt(lessons.total_xp_earned) || 0,
      },
      coding: {
        submissions: parseInt(submissions.total_submissions) || 0,
        passed: parseInt(submissions.passed_submissions) || 0,
        avg_score: Math.round(submissions.avg_score || 0),
      },
      leaderboard_rank: rankResult.rows[0]?.rank || null,
      weekly_activity: weeklyResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get platform-wide stats (public)
router.get('/platform', async (req, res) => {
  try {
    const statsResult = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM users WHERE verified_at IS NOT NULL) as active_users,
        (SELECT COUNT(*) FROM lessons) as total_lessons,
        (SELECT COUNT(*) FROM user_lesson_progress WHERE completed = TRUE) as lessons_completed,
        (SELECT COUNT(*) FROM code_submissions) as code_submissions,
        (SELECT AVG(total_xp) FROM progress) as avg_xp,
        (SELECT ROUND(AVG(daily_streak)) FROM progress) as avg_streak`
    );

    const platformStats = statsResult.rows[0];

    res.json({
      active_users: parseInt(platformStats.active_users),
      total_lessons: parseInt(platformStats.total_lessons),
      lessons_completed: parseInt(platformStats.lessons_completed),
      code_submissions: parseInt(platformStats.code_submissions),
      avg_user_xp: Math.round(platformStats.avg_xp || 0),
      avg_user_streak: Math.round(platformStats.avg_streak || 0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch platform stats' });
  }
});

export default router;
