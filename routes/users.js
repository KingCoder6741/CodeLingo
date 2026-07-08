import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.age, u.plan, u.created_at,
              p.progress_language, p.progress_code, p.total_xp, p.level, p.daily_streak
       FROM users u
       JOIN progress p ON u.id = p.user_id
       WHERE u.id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, total_xp, level, rank FROM leaderboard LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
