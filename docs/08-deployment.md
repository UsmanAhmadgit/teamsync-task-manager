# TeamSync — Deployment Guide

---

## Architecture

```
Frontend (React SPA)          Backend (Express API)
  Firebase Hosting       →     GCP Compute Engine
  dist/                         Docker / PM2
                                 ↓
                          PostgreSQL (GCP Cloud SQL or local)
```

---

## Backend Deployment (GCP Compute Engine)

### Option A: Docker

```bash
cd backend
docker build -t teamsync-backend .
docker run -d -p 5000:5000 --env-file .env teamsync-backend
```

### Option B: PM2 (Process Manager)

```bash
npm install -g pm2
cd backend
pm2 start src/app.js --name teamsync-api
pm2 save
pm2 startup
```

### Environment Variables (Production)

```env
PORT=5000
DATABASE_URL=postgresql://user:pass@cloud-sql-ip:5432/teamsync_db
SESSION_SECRET=long_random_string_here
NODE_ENV=production
CLIENT_URL=https://your-firebase-domain.web.app
```

---

## Frontend Deployment (Firebase Hosting)

```bash
cd frontend
npm run build

# Install Firebase CLI if not installed
npm install -g firebase-tools
firebase login
firebase init hosting     # select dist/ as public directory
firebase deploy
```

### firebase.json

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production` on server
- [ ] Set `SESSION_SECRET` to a strong random string
- [ ] Enable HTTPS on backend (required for `secure: true` cookies)
- [ ] Set `CLIENT_URL` to actual Firebase Hosting URL
- [ ] Run database migration on production PostgreSQL
- [ ] Set `VITE_API_URL` to production backend URL before `npm run build`
- [ ] Test cross-domain cookies (sameSite: 'none' + secure: true)
