import express from 'express';
import { OpenAI } from 'openai';
import pool from '../db/pool.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Grade code submission
router.post('/grade',
  body('code').isString().isLength({ min: 1, max: 10000 }),
  body('language').isIn(['javascript', 'python', 'ruby', 'java']),
  body('lesson_id').isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, language, lesson_id } = req.body;
    const userId = req.userId;

    try {
      // Get lesson details
      const lessonResult = await pool.query(
        'SELECT title, description FROM lessons WHERE id = $1',
        [lesson_id]
      );

      if (lessonResult.rows.length === 0) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      const lesson = lessonResult.rows[0];

      // Use OpenAI to grade the code
      const prompt = `
You are an expert code reviewer for a programming learning platform.
Grade the following ${language} code submission for the lesson: "${lesson.title}"

Lesson Description: ${lesson.description}

Code to grade:
\`\`\`${language}
${code}
\`\`\`

Provide feedback in JSON format:
{
  "score": 0-100,
  "feedback": "detailed feedback",
  "improvements": ["suggestion 1", "suggestion 2"],
  "passed": true/false,
  "xp_bonus": 0-20
}
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const gradingResult = JSON.parse(completion.choices[0].message.content);

      // Save submission
      const submissionResult = await pool.query(
        `INSERT INTO code_submissions (user_id, lesson_id, code, language, score, feedback, passed)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, score, feedback, passed`,
        [userId, lesson_id, code, language, gradingResult.score, JSON.stringify(gradingResult), gradingResult.passed]
      );

      // Add XP if passed
      if (gradingResult.passed) {
        const xpReward = 20 + (gradingResult.xp_bonus || 0);
        await pool.query(
          `UPDATE progress
           SET progress_code = progress_code + $1,
               total_xp = total_xp + $1,
               level = (total_xp + $1) / 100
           WHERE user_id = $2`,
          [xpReward, userId]
        );
      }

      res.json({
        submission_id: submissionResult.rows[0].id,
        ...gradingResult,
        xp_earned: gradingResult.passed ? 20 + (gradingResult.xp_bonus || 0) : 0,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Grading failed: ' + err.message });
    }
  }
);

// Get submission history
router.get('/submissions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, lesson_id, score, passed, created_at FROM code_submissions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router;
