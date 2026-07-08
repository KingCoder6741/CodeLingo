# CodeLingo Backend Setup

## Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- npm

## Installation

1. **Clone the repo** (you're already here)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL database**
   ```bash
   # Create a new database
   createdb codelingo

   # Run migrations
   psql codelingo < db/init.sql

   # Seed with lessons
   psql codelingo < data/seed-lessons.sql
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

## API Routes

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in

### Users (requires token)
- `GET /api/users/me` - Get profile
- `GET /api/users/leaderboard` - Top 50 users

### Lessons (requires token)
- `GET /api/lessons` - All lessons
- `GET /api/lessons/:id` - Lesson details + steps
- `GET /api/lessons/:id/quizzes` - Lesson quizzes

### Progress (requires token)
- `GET /api/progress` - User progress
- `POST /api/progress/xp` - Add XP
- `POST /api/progress/lesson/:lessonId/complete` - Mark lesson done

## Frontend Files (Refactored)

- `public/index.html` - Page structure
- `public/css/style.css` - All styling
- `public/js/api.js` - API calls
- `public/js/auth.js` - Authentication
- `public/js/progress.js` - XP & progress
- `public/js/lessons.js` - Lesson loading
- `public/js/ui.js` - UI utilities

## Key Improvements Made

✅ **Backend with Node.js + Express**
✅ **PostgreSQL database** with proper schema
✅ **JWT authentication** (secure, no passwords in localStorage)
✅ **Removed eval()** for safety
✅ **Split HTML/CSS/JS** into separate files
✅ **API endpoints** for all features
✅ **Password hashing** with bcryptjs
✅ **Input validation** with express-validator
✅ **More lessons & quizzes** pre-seeded
✅ **CORS configured** for security

## Next Steps

1. Add email verification
2. Implement code sandbox (Judge0 API)
3. Add speech-to-text for language learning
4. Deploy to Heroku/Railway/Render
5. Add more lessons
6. Implement achievements system
7. Add analytics

## Troubleshooting

**Can't connect to database?**
- Check PostgreSQL is running
- Verify credentials in .env
- Make sure database exists

**CORS errors?**
- Update FRONTEND_URL in .env
- Clear browser cache

**Lessons not loading?**
- Run seed script: `psql codelingo < data/seed-lessons.sql`
- Check database connection
