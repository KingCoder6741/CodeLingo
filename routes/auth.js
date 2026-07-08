import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../db/pool.js';

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

      // Insert user
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, age, plan) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name',
        [name, email, password_hash, age, plan]
      );

      const user = result.rows[0];

      // Create progress record
      await pool.query(
        'INSERT INTO progress (user_id) VALUES ($1)',
        [user.id]
      );

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({ 
        message: age < 18 ? 'Welcome! CodeLingo is FREE for you.' : 'Account created! Choose a plan anytime.',
        token,
        user: { id: user.id, name: user.name, email: user.email, age, plan }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

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
        'SELECT id, name, email, password_hash, age, plan FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];
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
