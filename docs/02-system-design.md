# TeamSync — System Design

---

## Architecture Overview

```
Browser (React + Vite + Tailwind)
        |
        | Axios (withCredentials: true)
        |
Express REST API (Node.js)
        |
        |--- PassportJS + Express Session
        |--- express-validator (input validation)
        |--- Global Error Handler Middleware
        |
pg Pool (PostgreSQL)
        |
        |--- Application tables (users, teams, team_members, tasks)
        |--- Session store (sessions table via connect-pg-simple)
```

---

## Request Lifecycle

```
Client Request
  → CORS middleware (check origin)
  → Session middleware (check cookie)
  → Passport middleware (deserialize user)
  → Route handler
  → Auth middleware (isAuthenticated check)
  → Validator middleware (input check)
  → Controller (handle request/response)
  → Service (business logic)
  → DB query (pg pool)
  → Response
  → Error handler (if anything threw)
```

---

## Backend Layer Responsibilities

| Layer | File Pattern | Responsibility |
|---|---|---|
| Route | `routes/*.js` | URL + method + middleware chain |
| Validator | `validators/*.js` | Input validation + sanitization |
| Middleware | `middleware/*.js` | Auth checks, error handling |
| Controller | `controllers/*.js` | Read req, call service, send res |
| Service | `services/*.js` | Business logic, authorization |
| Model | `models/*.js` | Raw SQL via pg pool |

---

## Frontend Architecture

| Layer | Purpose |
|---|---|
| Pages | Route-level containers |
| Components | Reusable UI elements |
| Services | API communication via axiosInstance |
| Hooks | Reusable data fetching logic |
| Context | Global auth state (AuthContext) |

---

## Auth Re-check on Page Refresh

```
App mounts
  → AuthContext calls GET /auth/me
  → If 200: set user, show dashboard
  → If 401: clear user, show login page
  → Loading state shown during check (prevents flicker)
```
