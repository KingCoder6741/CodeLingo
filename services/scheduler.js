import schedule from 'node-schedule';
import pool from '../db/pool.js';
import { sendStreakReminder } from './email.js';

// Send daily reminders for streaks
export function startStreakReminders() {
  // Every day at 9 AM
  schedule.scheduleJob('0 9 * * *', async () => {
    try {
      console.log('📧 Sending streak reminders...');

      // Get users who have reminders enabled and haven't completed today
      const result = await pool.query(
        `SELECT u.id, u.email, u.name, p.daily_streak
         FROM users u
         JOIN progress p ON u.id = p.user_id
         JOIN reminder_settings r ON u.id = r.user_id
         WHERE r.enabled = TRUE
         AND (p.last_activity_date IS NULL OR p.last_activity_date < CURRENT_DATE)`
      );

      for (const user of result.rows) {
        await sendStreakReminder(user.email, user.name, user.daily_streak);
      }

      console.log(`✅ Sent ${result.rows.length} reminders`);
    } catch (error) {
      console.error('Error sending reminders:', error);
    }
  });

  console.log('🔔 Streak reminder scheduler started');
}

// Check for milestone achievements
export function startMilestoneChecker() {
  // Every hour
  schedule.scheduleJob('0 * * * *', async () => {
    try {
      // Users who just hit streak milestones
      const result = await pool.query(
        `SELECT id, email, name FROM users u
         JOIN progress p ON u.id = p.user_id
         WHERE p.daily_streak IN (7, 30, 100, 365)
         AND p.updated_at > NOW() - INTERVAL '1 hour'`
      );

      for (const user of result.rows) {
        // Milestone emails could be sent here
        console.log(`🎉 Milestone user: ${user.name}`);
      }
    } catch (error) {
      console.error('Error checking milestones:', error);
    }
  });

  console.log('🏅 Milestone checker started');
}
