import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/pool.js';
import { adminAuth } from '../middleware/admin.js';

const router = express.Router();
router.use(adminAuth);

// Get all lessons
router.get('/lessons', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, lesson_key, title, description, category, level, xp_reward FROM lessons ORDER BY level, id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Create lesson
router.post('/lessons',
  body('lesson_key').trim().isLength({ min: 2 }),
  body('title').trim().isLength({ min: 3 }),
  body('category').isIn(['language', 'code']),
  body('level').isInt({ min: 1, max: 10 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lesson_key, title, description, category, level, xp_reward } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO lessons (lesson_key, title, description, category, level, xp_reward) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [lesson_key, title, description || null, category, level, xp_reward || 20]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create lesson' });
    }
  }
);

// Update lesson
router.put('/lessons/:id',
  body('title').optional().trim().isLength({ min: 3 }),
  body('description').optional(),
  body('level').optional().isInt({ min: 1 }),
  body('xp_reward').optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, level, xp_reward } = req.body;
    const { id } = req.params;

    try {
      const result = await pool.query(
        'UPDATE lessons SET title = COALESCE($1, title), description = COALESCE($2, description), level = COALESCE($3, level), xp_reward = COALESCE($4, xp_reward) WHERE id = $5 RETURNING *',
        [title, description, level, xp_reward, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update lesson' });
    }
  }
);

// Delete lesson
router.delete('/lessons/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM lessons WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ message: 'Lesson deleted', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Add lesson step
router.post('/lessons/:id/steps',
  body('step_number').isInt({ min: 1 }),
  body('content').trim().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { step_number, content } = req.body;
    const { id } = req.params;

    try {
      const result = await pool.query(
        'INSERT INTO lesson_steps (lesson_id, step_number, content) VALUES ($1, $2, $3) RETURNING *',
        [id, step_number, content]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add step' });
    }
  }
);

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users WHERE verified_at IS NOT NULL');
    const lessonsResult = await pool.query('SELECT COUNT(*) as count FROM lessons');
    const completionsResult = await pool.query('SELECT COUNT(*) as count FROM user_lesson_progress WHERE completed = TRUE');

    res.json({
      verified_users: parseInt(usersResult.rows[0].count),
      total_lessons: parseInt(lessonsResult.rows[0].count),
      lesson_completions: parseInt(completionsResult.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
