# TeamSync — Deployment Guide

---

## Architecture

```text
Frontend (React SPA)          Backend (Express API)
  Vercel                 →     Render Web Service
  dist/                                ↓
                          PostgreSQL (Supabase or Render DB)
```

---

## Backend Deployment (Render)

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables:
   ```env
   PORT=10000
   DATABASE_URL=postgresql://user:pass@supabase-host:6543/postgres
   SESSION_SECRET=long_random_string_here
   NODE_ENV=production
   ```
5. Deploy.

---

## Frontend Deployment (Vercel)

1. Create a new project on Vercel.
2. Connect your GitHub repository.
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. Set Environment Variables:
   ```env
   VITE_API_URL=https://your-render-backend.onrender.com
   ```
5. Deploy.

### vercel.json

We use `vercel.json` (located in the frontend root) to handle React Router (SPA) paths, preventing 404 errors on reload:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production` on server
- [ ] Ensure `app.set('trust proxy', 1)` is in `app.js` for Render cookies
- [ ] Set `SESSION_SECRET` to a strong random string
- [ ] Set `VITE_API_URL` on Vercel
- [ ] Add your Vercel URL to CORS `allowedOrigins` in backend
- [ ] Run database migration on production PostgreSQL (via Supabase SQL editor or CLI)
- [ ] Test cross-domain cookies (sameSite: 'none' + secure: true)
