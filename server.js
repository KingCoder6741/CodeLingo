import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import userRoutes from './routes/users.js';
import lessonRoutes from './routes/lessons.js';
import progressRoutes from './routes/progress.js';
import codeSandboxRoutes from './routes/code-sandbox.js';
import adminRoutes from './routes/admin.js';
import aiGradingRoutes from './routes/ai-grading.js';
import streaksRoutes from './routes/streaks.js';
import analyticsRoutes from './routes/analytics.js';
import eventsRoutes from './routes/events.js';
import { verifyToken } from './middleware/auth.js';
import { startStreakReminders, startMilestoneChecker } from './services/scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.MOBILE_APP_URL],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Session for OAuth
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/lessons', verifyToken, lessonRoutes);
app.use('/api/progress', verifyToken, progressRoutes);
app.use('/api/sandbox', verifyToken, codeSandboxRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/grade', verifyToken, aiGradingRoutes);
app.use('/api/streaks', verifyToken, streaksRoutes);
app.use('/api/analytics', verifyToken, analyticsRoutes);
app.use('/api/events', verifyToken, eventsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`✅ CodeLingo server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
  console.log(`⚙️  OAuth configured (Discord & GitHub)`);
  console.log(`🤖 AI Grading enabled`);
  console.log(`🔔 Streak reminders enabled`);
});

// Start background jobs
startStreakReminders();
startMilestoneChecker();
