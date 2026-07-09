import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/pool.js';

const router = express.Router();

// Track analytics event
router.post('/event',
  body('event_type').isString().isLength({ min: 1, max: 100 }),
  body('event_data').optional().isObject(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { event_type, event_data } = req.body;
    const userId = req.userId;

    try {
      const result = await pool.query(
        'INSERT INTO analytics_events (user_id, event_type, event_data) VALUES ($1, $2, $3) RETURNING id',
        [userId, event_type, JSON.stringify(event_data || {})]
      );

      res.json({ event_id: result.rows[0].id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to track event' });
    }
  }
);

export default router;
