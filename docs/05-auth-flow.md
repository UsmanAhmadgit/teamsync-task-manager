# TeamSync — Authentication Flow

---

## Overview

TeamSync uses **session-based authentication** with PassportJS Local Strategy. Sessions are stored in PostgreSQL via `connect-pg-simple`. Passwords are hashed with `bcrypt` (12 salt rounds).

---

## Endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | No | Create new user account |
| POST | `/auth/login` | No | Authenticate and create session |
| POST | `/auth/logout` | Yes | Destroy session and clear cookie |
| GET | `/auth/me` | Yes | Return current user from session |

---

## Registration Flow

```
POST /auth/register
  → registerValidator (name, email, strong password)
  → validate (return 422 if invalid)
  → authController.register
  → authService.register
      → check if email exists (409 if duplicate)
      → bcrypt.hash(password, 12)
      → INSERT into users table
  → 201 { success: true, message: "Registered successfully" }
```

**Note:** Registration does NOT auto-login. User must login separately.

---

## Login Flow

```
POST /auth/login
  → loginValidator (email, password)
  → validate (return 422 if invalid)
  → authController.login
  → passport.authenticate('local')
      → find user by email
      → bcrypt.compare(password, hash)
      → if fail: 401 { message: "Invalid email or password" }
  → req.login() creates session
  → session saved to PostgreSQL
  → HTTP-only cookie sent to browser
  → 200 { success: true, data: { id, name, email } }
```

---

## Logout Flow

```
POST /auth/logout
  → isAuthenticated middleware
  → req.logout()
  → req.session.destroy()
  → res.clearCookie('connect.sid')
  → 200 { message: "Logged out" }
```

---

## Session Re-check (Page Refresh)

```
GET /auth/me
  → isAuthenticated middleware
  → if session valid: 200 { data: { id, name, email } }
  → if no session: 401 { message: "Not authenticated" }
```

The frontend calls this on every app mount to restore auth state.

---

## Security Rules

- `password_hash` is **never** returned in any API response
- Cookies are `httpOnly: true` — JavaScript cannot access them
- `secure: true` in production (requires HTTPS)
- `sameSite: 'none'` in production (required for cross-domain cookie)
- bcrypt salt rounds: **12** (minimum recommended for production)
- Session secret loaded from environment variable
