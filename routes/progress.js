import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Add XP
router.post('/xp', async (req, res) => {
  const { type, amount } = req.body; // type: 'language' or 'code'

  if (!['language', 'code'].includes(type) || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const column = type === 'language' ? 'progress_language' : 'progress_code';
    
    const result = await pool.query(
      `UPDATE progress 
       SET ${column} = ${column} + $1, 
           total_xp = total_xp + $1,
           level = (total_xp + $1) / 100,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2
       RETURNING progress_language, progress_code, total_xp, level`,
      [amount, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.json({ message: 'XP added', progress: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add XP' });
  }
});

// Complete lesson
router.post('/lesson/:lessonId/complete', async (req, res) => {
  try {
    // Mark lesson as completed
    await pool.query(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, completed, completed_at) 
       VALUES ($1, $2, TRUE, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id) 
       DO UPDATE SET completed = TRUE, completed_at = CURRENT_TIMESTAMP`,
      [req.userId, req.params.lessonId]
    );

    // Get XP reward from lesson
    const lessonResult = await pool.query(
      'SELECT xp_reward FROM lessons WHERE id = $1',
      [req.params.lessonId]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const xpReward = lessonResult.rows[0].xp_reward;

    // Add XP
    const progressResult = await pool.query(
      `UPDATE progress
       SET progress_language = progress_language + $1,
           total_xp = total_xp + $1,
           level = (total_xp + $1) / 100,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2
       RETURNING *`,
      [xpReward, req.userId]
    );

    res.json({ message: 'Lesson completed', xp_gained: xpReward, progress: progressResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// Get user progress
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM progress WHERE user_id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
