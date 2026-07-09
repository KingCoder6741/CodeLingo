# CodeLingo Advanced Features Guide

## 🔐 OAuth (Discord & GitHub)

### Setup Discord OAuth

1. Go to https://discord.com/developers/applications
2. Create New Application
3. Copy **Client ID** and **Client Secret**
4. Set OAuth2 redirect URL: `http://localhost:5000/api/auth/discord/callback`
5. Add to `.env`:
   ```
   DISCORD_CLIENT_ID=your_id
   DISCORD_CLIENT_SECRET=your_secret
   ```

### Setup GitHub OAuth

1. Go to https://github.com/settings/developers
2. Create New OAuth App
3. Copy **Client ID** and **Client Secret**
4. Set Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
5. Add to `.env`:
   ```
   GITHUB_CLIENT_ID=your_id
   GITHUB_CLIENT_SECRET=your_secret
   ```

### Frontend Integration

```html
<!-- Login buttons -->
<a href="http://localhost:5000/api/auth/discord">Login with Discord</a>
<a href="http://localhost:5000/api/auth/github">Login with GitHub</a>
```

The backend redirects to your frontend with JWT token:
```javascript
const token = new URLSearchParams(window.location.search).get('token');
if (token) {
  localStorage.setItem('authToken', token);
  // Redirect to dashboard
}
```

---

## 🤖 AI Grading with OpenAI

### Setup

1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key
   ```

### Usage

```bash
# Grade code submission
curl -X POST http://localhost:5000/api/grade/grade \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(\'Hello\');",
    "language": "javascript",
    "lesson_id": 1
  }'
```

### Response
```json
{
  "submission_id": 42,
  "score": 85,
  "passed": true,
  "feedback": "Great code! Consider adding comments.",
  "improvements": [
    "Add JSDoc comments for functions",
    "Use descriptive variable names"
  ],
  "xp_earned": 25
}
```

### Features
- Automatic code review
- Constructive feedback
- Improvement suggestions
- XP bonus for high scores
- Tracks submission history

---

## 🔥 Streak Tracking & Daily Reminders

### How Streaks Work

- **+1 streak**: Complete any lesson per day
- **Reset**: Miss a day
- **Milestones**: 7 days = 50 XP, 30 days = 200 XP, 100 days = 500 XP

### API Endpoints

```bash
# Get current streak
GET /api/streaks/streak

# Update streak (called after lesson completion)
POST /api/streaks/update-streak

# Set reminder time
POST /api/streaks/set-reminder
-d '{"time": "09:00"}'
```

### Daily Reminders

Reminders are sent automatically via email at user's preferred time.

**Response from `/api/streaks/set-reminder`**:
```json
{
  "message": "Reminder set for 09:00",
  "settings": {
    "reminder_time": "09:00:00",
    "enabled": true
  }
}
```

Scheduler checks every hour for:
- Users with reminders enabled
- Who haven't completed a lesson today
- Sends motivational email with streak count

---

## 📱 React Native Mobile App

### Structure

```
mobile/
├── screens/
│   ├── HomeScreen.js      # Profile & quick stats
│   ├── AnalyticsScreen.js # Charts & progress
│   └── CodeSandboxScreen.js # Run code on phone
├── app.json               # Expo config
└── package.json
```

### Run Locally

```bash
cd mobile
npm install
npm start

# Scan QR code with phone
# Or press 'a' for Android, 'i' for iOS
```

### Build for App Store

```bash
eas build --platform ios
eas submit --platform ios
```

### Build for Google Play

```bash
eas build --platform android
eas submit --platform android
```

---

## 📊 Analytics Dashboard

### Frontend (Web)

Add to your HTML:

```html
<div id="analytics-dashboard"></div>

<script>
async function loadAnalytics() {
  const token = localStorage.getItem('authToken');
  const res = await fetch('http://localhost:5000/api/analytics/dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  
  // Display data
  document.getElementById('user-xp').textContent = data.user.total_xp;
  document.getElementById('user-level').textContent = data.user.level;
  // ... render charts
}

loadAnalytics();
</script>
```

### Available Metrics

**User Dashboard** (`GET /api/analytics/dashboard`):
```json
{
  "user": {
    "name": "John",
    "level": 5,
    "total_xp": 450,
    "streak": 12
  },
  "learning": {
    "language_progress": 65,
    "code_progress": 75,
    "lessons_completed": 15,
    "xp_from_lessons": 300
  },
  "coding": {
    "submissions": 25,
    "passed": 18,
    "avg_score": 82
  },
  "leaderboard_rank": 42,
  "weekly_activity": [
    { "date": "2024-01-15", "activity_count": 2 },
    // ... 7 days of data
  ]
}
```

**Platform Stats** (`GET /api/analytics/platform`):
```json
{
  "active_users": 1250,
  "total_lessons": 25,
  "lessons_completed": 5400,
  "code_submissions": 8300,
  "avg_user_xp": 285,
  "avg_user_streak": 7
}
```

### Track Custom Events

```bash
curl -X POST http://localhost:5000/api/events/event \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "event_type": "lesson_started",
    "event_data": {"lesson_id": 5}
  }'
```

---

## 🚀 Deployment Checklist

Before deploying with all features:

- [ ] Set `OPENAI_API_KEY` (for AI grading)
- [ ] Configure `DISCORD_CLIENT_ID/SECRET`
- [ ] Configure `GITHUB_CLIENT_ID/SECRET`
- [ ] Setup email reminders (Gmail app password)
- [ ] Run database migrations:
  ```bash
  psql $DATABASE_URL < db/schema-additions.sql
  ```
- [ ] Test OAuth flows in production
- [ ] Verify streak reminders are sending
- [ ] Monitor analytics data collection

---

## 💰 Cost Estimates

| Feature | Cost |
|---------|------|
| OpenAI API (1000 submissions/mo) | ~$2 |
| Nodemailer (free tier) | Free |
| Discord OAuth | Free |
| GitHub OAuth | Free |
| Expo Build | $99/month (optional) |
| Railway PostgreSQL | $15/month |

**Total: ~$15-30/month for production**

---

## Troubleshooting

**OAuth not working?**
- Check callback URLs match exactly
- Verify secrets in .env are correct
- Clear browser cookies

**AI Grading slow?**
- OpenAI API takes 2-5 seconds
- Show loading indicator to users
- Cache common feedback patterns

**Reminders not sending?**
- Check email credentials
- Verify cron job is running
- Check database for reminder_settings

**Mobile app crashes?**
- Check API_URL is correct
- Verify backend is accessible
- Check AsyncStorage permissions
