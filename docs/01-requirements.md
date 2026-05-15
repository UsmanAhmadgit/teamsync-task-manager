# TeamSync — Requirements

---

## Project Overview

TeamSync is a multi-user, role-aware, session-based team productivity system that enables teams to collaborate on task management efficiently.

---

## Functional Requirements

### Authentication
- Users can register with name, email, and password
- Users can login with email and password
- Sessions persist across page refreshes (stored in PostgreSQL)
- Users can logout (session destroyed, cookie cleared)

### Teams
- Authenticated users can create teams (auto-assigned as admin)
- Team admins can add members by email
- Team admins can remove members (cannot remove creator)
- Team admins can delete teams
- Users can view all teams they belong to

### Tasks
- Team members can create tasks within their teams
- Tasks have title, description, status, priority, due date, and assignee
- Team members can update task fields
- Task creators and team admins can delete tasks
- Tasks can be filtered by team, assignee, and status

### Authorization
- Role-based access: admin vs member
- Protected routes require active session
- Admin-only operations enforced via middleware

---

## Non-Functional Requirements

- Passwords hashed with bcrypt (12 salt rounds)
- HTTP-only session cookies
- CORS restricted to frontend origin
- SQL injection prevented via parameterized queries
- Input validated and sanitized on all endpoints
- Responsive UI for mobile and desktop
