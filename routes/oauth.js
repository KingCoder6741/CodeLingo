import express from 'express';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Passport Strategies
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.email || `${profile.id}@discord.local`;
        const name = profile.username;

        // Check if user exists
        let user = await pool.query(
          'SELECT id FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
          ['discord', profile.id]
        );

        if (user.rows.length === 0) {
          // Create new user
          user = await pool.query(
            'INSERT INTO users (name, email, oauth_provider, oauth_id, verified_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, name, email',
            [name, email, 'discord', profile.id]
          );

          // Create progress record
          await pool.query('INSERT INTO progress (user_id) VALUES ($1)', [user.rows[0].id]);
        }

        return done(null, user.rows[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@github.local`;
        const name = profile.displayName || profile.username;

        // Check if user exists
        let user = await pool.query(
          'SELECT id FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
          ['github', profile.id]
        );

        if (user.rows.length === 0) {
          // Create new user
          user = await pool.query(
            'INSERT INTO users (name, email, oauth_provider, oauth_id, verified_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, name, email',
            [name, email, 'github', profile.id]
          );

          // Create progress record
          await pool.query('INSERT INTO progress (user_id) VALUES ($1)', [user.rows[0].id]);
        }

        return done(null, user.rows[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

// Discord OAuth
router.get('/discord', passport.authenticate('discord'));

router.get(
  '/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

export default router;
