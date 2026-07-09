# CodeLingo Deployment Guide

## Deploy to Railway (Recommended)

### Prerequisites
- Railway account (https://railway.app)
- GitHub account connected to Railway

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin backend-refactor
   ```

2. **Create Railway Project**
   - Go to https://railway.app/dashboard
   - Click "New Project" → "Deploy from GitHub"
   - Select your CodeLingo repo
   - Railway auto-detects `Procfile`

3. **Add PostgreSQL Database**
   - In Railway, click "+ Add" → "Database" → "PostgreSQL"
   - Railway creates DB automatically

4. **Set Environment Variables**
   In Railway dashboard, add:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-key-change-this
   ADMIN_PASSWORD=your-admin-key
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@codelingo.dev
   FRONTEND_URL=https://your-frontend-url.com
   ```

5. **Run Database Migrations**
   - In Railway terminal:
   ```bash
   psql $DATABASE_URL < db/init.sql
   psql $DATABASE_URL < data/seed-lessons.sql
   ```

6. **Deploy**
   - Railway auto-deploys on push
   - Your API is now live!

---

## Deploy to Heroku

### Prerequisites
- Heroku CLI installed
- Heroku account

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create App**
   ```bash
   heroku create codelingo-api
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set ADMIN_PASSWORD="your-admin-key"
   heroku config:set EMAIL_USER="your-email@gmail.com"
   heroku config:set EMAIL_PASSWORD="your-app-password"
   heroku config:set FRONTEND_URL="https://your-frontend.com"
   ```

5. **Deploy**
   ```bash
   git push heroku backend-refactor:main
   ```

6. **Run Migrations**
   ```bash
   heroku run "psql $DATABASE_URL < db/init.sql"
   heroku run "psql $DATABASE_URL < data/seed-lessons.sql"
   ```

7. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

## Deploy to Render

### Prerequisites
- Render account (https://render.com)
- GitHub connected

### Steps

1. **Create Web Service**
   - Go to https://dashboard.render.com
   - New → Web Service
   - Connect GitHub repo
   - Build command: `npm install`
   - Start command: `npm start`

2. **Add PostgreSQL**
   - New → PostgreSQL
   - Copy connection URL

3. **Set Environment Variables**
   In Render dashboard:
   ```
   DATABASE_URL=postgres://...
   JWT_SECRET=your-secret
   ADMIN_PASSWORD=your-admin-key
   EMAIL_USER=your-email
   EMAIL_PASSWORD=your-app-password
   FRONTEND_URL=https://your-frontend.com
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Render auto-deploys on push

5. **Run Migrations**
   ```bash
   # Use Render's PostgreSQL shell
   psql $DATABASE_URL < db/init.sql
   psql $DATABASE_URL < data/seed-lessons.sql
   ```

---

## Environment Variables Checklist

Before deploying anywhere:

- [ ] `DB_HOST` / `DATABASE_URL`
- [ ] `DB_PORT`
- [ ] `DB_NAME`
- [ ] `DB_USER`
- [ ] `DB_PASSWORD`
- [ ] `JWT_SECRET` (long random string)
- [ ] `ADMIN_PASSWORD` (strong key)
- [ ] `EMAIL_USER` (Gmail account)
- [ ] `EMAIL_PASSWORD` (Gmail app password)
- [ ] `EMAIL_FROM` (email address)
- [ ] `PORT=5000` (Heroku/Railway set this auto)
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL` (your frontend domain)

---

## Gmail App Password Setup

1. Enable 2-factor auth on Gmail
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Use as `EMAIL_PASSWORD` in env vars

---

## Testing Your Deployment

```bash
# Test health endpoint
curl https://your-api.com/api/health

# Test register
curl -X POST https://your-api.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","age":25}'

# Test code sandbox
curl -X POST https://your-api.com/api/sandbox/run \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(2+2)","language":"javascript"}'
```

---

## Monitoring & Logs

**Railway**: View in dashboard or `railway logs`
**Heroku**: `heroku logs --tail`
**Render**: View in dashboard

---

## Custom Domain Setup

### Railway
```bash
railway domain add your-domain.com
```

### Heroku
```bash
heroku domains:add your-domain.com
heroku domains:add www.your-domain.com
```

Then add CNAME records to your DNS provider.

---

## Scaling & Performance

- **Railway**: Free tier includes 5GB storage, increase as needed
- **Heroku**: Upgrade dynos for more power (Standard/Professional)
- **Render**: Use higher tier instances for production

---

## Database Backups

**Railway**: Automatic backups included
**Heroku**: Use `heroku pg:backups`
**Render**: Manual backups via dashboard
