import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Get user streaks
router.get('/streak', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT daily_streak, last_activity_date FROM progress WHERE user_id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    const progress = result.rows[0];
    const today = new Date().toDateString();
    const lastActivity = progress.last_activity_date
      ? new Date(progress.last_activity_date).toDateString()
      : null;

    res.json({
      current_streak: progress.daily_streak,
      last_activity: progress.last_activity_date,
      active_today: lastActivity === today,
      next_reminder: getNextReminderTime(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch streak' });
  }
});

// Update streak (called when user completes a lesson)
router.post('/update-streak', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await pool.query(
      `UPDATE progress
       SET daily_streak = CASE
             WHEN last_activity_date = CURRENT_DATE THEN daily_streak
             WHEN last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN daily_streak + 1
             ELSE 1
           END,
           last_activity_date = CURRENT_DATE
       WHERE user_id = $1
       RETURNING daily_streak`,
      [req.userId]
    );

    const streak = result.rows[0].daily_streak;
    let bonus = 0;

    // Streak milestones
    if (streak === 7) bonus = 50;   // 7-day streak
    if (streak === 30) bonus = 200; // 30-day streak
    if (streak === 100) bonus = 500; // 100-day streak

    if (bonus > 0) {
      await pool.query(
        `UPDATE progress SET total_xp = total_xp + $1 WHERE user_id = $2`,
        [bonus, req.userId]
      );
    }

    res.json({
      current_streak: streak,
      milestone_bonus: bonus,
      message: bonus > 0 ? `Milestone! +${bonus} XP for ${streak}-day streak! 🔥` : '✅ Streak updated!',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

// Schedule reminder (user sets preferred time)
router.post('/set-reminder', async (req, res) => {
  const { time } = req.body; // e.g., "09:00"

  try {
    const result = await pool.query(
      `INSERT INTO reminder_settings (user_id, reminder_time, enabled)
       VALUES ($1, $2, TRUE)
       ON CONFLICT (user_id) DO UPDATE SET reminder_time = $2
       RETURNING reminder_time, enabled`,
      [req.userId, time]
    );

    res.json({
      message: 'Reminder set for ' + time,
      settings: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to set reminder' });
  }
});

function getNextReminderTime() {
  const now = new Date();
  // Default: 9 AM
  const reminderTime = new Date();
  reminderTime.setHours(9, 0, 0, 0);
  
  if (now > reminderTime) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }
  
  return reminderTime;
}

export default router;
