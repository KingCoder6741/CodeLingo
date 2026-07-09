import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../db/pool.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../services/email.js';
import crypto from 'crypto';

const router = express.Router();

// Register
router.post('/register', 
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('age').isInt({ min: 5, max: 120 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, age } = req.body;
    
    try {
      // Check if email exists
      const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      const plan = age < 18 ? 'FREE_YOUTH' : 'NONE';
      const verification_token = crypto.randomBytes(32).toString('hex');

      // Insert user
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, age, plan, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name',
        [name, email, password_hash, age, plan, verification_token]
      );

      const user = result.rows[0];

      // Create progress record
      await pool.query(
        'INSERT INTO progress (user_id) VALUES ($1)',
        [user.id]
      );

      // Send verification email
      await sendVerificationEmail(email, name, verification_token);

      res.status(201).json({ 
        message: 'Account created! Check your email to verify.',
        email: user.email,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Verify email
router.post('/verify-email', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Verification token required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, age, plan FROM users WHERE verification_token = $1 AND verified_at IS NULL',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const user = result.rows[0];

    // Mark as verified
    await pool.query(
      'UPDATE users SET verified_at = CURRENT_TIMESTAMP, verification_token = NULL WHERE id = $1',
      [user.id]
    );

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Generate token
    const authToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Email verified! Welcome to CodeLingo.',
      token: authToken,
      user: { id: user.id, name: user.name, email: user.email, age: user.age, plan: user.plan }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query(
        'SELECT id, name, email, password_hash, age, plan, verified_at FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];

      if (!user.verified_at) {
        return res.status(403).json({ error: 'Please verify your email first' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, age: user.age, plan: user.plan }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

export default router;
