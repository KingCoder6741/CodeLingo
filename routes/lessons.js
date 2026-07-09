import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Get all lessons
router.get('/', async (req, res) => {
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

// Get lesson by ID with steps
router.get('/:id', async (req, res) => {
  try {
    const lessonResult = await pool.query(
      'SELECT id, lesson_key, title, description, category, level, xp_reward FROM lessons WHERE id = $1',
      [req.params.id]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const stepsResult = await pool.query(
      'SELECT id, step_number, content FROM lesson_steps WHERE lesson_id = $1 ORDER BY step_number',
      [req.params.id]
    );

    const lesson = lessonResult.rows[0];
    lesson.steps = stepsResult.rows;

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Get quizzes for lesson
router.get('/:id/quizzes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.id, q.question, 
              array_agg(json_build_object('index', qo.option_index, 'text', qo.option_text) 
                       ORDER BY qo.option_index) as options,
              q.correct_option_index
       FROM quizzes q
       JOIN quiz_options qo ON q.id = qo.quiz_id
       WHERE q.lesson_id = $1
       GROUP BY q.id`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

export default router;
