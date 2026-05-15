# TeamSync — Environment Setup Guide

> Read this before running the project locally.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 20.x (required) |
| npm | >= 10.x |
| PostgreSQL | >= 14.x |
| Git | any recent version |

---

## 1. Clone the Repository

```bash
git clone https://github.com/UsmanAhmadgit/teamsync-task-manager.git
cd teamsync-task-manager
```

---

## 2. Backend Setup

### Install dependencies

```bash
cd backend
npm install
```

### Create your local `.env`

```bash
cp .env.example .env
```

Then open `.env` and fill in your local values:

```env
PORT=5000
DATABASE_URL=postgresql://teamsync_user:yourpassword@localhost:5432/teamsync_db
SESSION_SECRET=replace_with_a_long_random_string
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 3. PostgreSQL Database Setup

Open a terminal and run:

```bash
psql -U postgres
```

Inside psql:

```sql
CREATE USER teamsync_user WITH PASSWORD 'yourpassword';
CREATE DATABASE teamsync_db OWNER teamsync_user;
GRANT ALL PRIVILEGES ON DATABASE teamsync_db TO teamsync_user;
\q
```

### Run the migration file

```bash
psql -U teamsync_user -d teamsync_db -f backend/src/db/migrations/001_init.sql
```

This creates all tables: `session`, `users`, `teams`, `team_members`, `tasks`.

---

## 4. Frontend Setup

```bash
cd frontend
npm install
```

Create your local `.env`:

```bash
cp .env.example .env
```

Contents:

```env
VITE_API_URL=http://localhost:5000
```

---

## 5. Running the Project

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 6. Known Issues / Gotchas

- **Session cookie not sent:** Make sure `withCredentials: true` is set in axiosInstance.js and CORS credentials are enabled on the backend.
- **PostgreSQL connection refused:** Confirm PostgreSQL service is running locally and DATABASE_URL is correct.
- **sameSite cookie issue in production:** `sameSite: 'none'` requires HTTPS. Do not test cross-domain locally without a proxy.
- **Node version:** This project requires Node 20+. Use `nvm` to manage versions if needed.
