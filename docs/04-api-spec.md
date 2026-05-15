# TeamSync — API Specification

> Base URL: `http://localhost:5000` (development)

---

## Standard Response Format

```json
// Success
{ "success": true, "data": { } }

// Error
{ "success": false, "message": "string", "errors": [] }
```

---

## AUTH ENDPOINTS

### POST /auth/register
- **Auth:** No
- **Body:** `{ "name": "Ali Khan", "email": "ali@example.com", "password": "Pass123!" }`
- **201:** `{ "success": true, "message": "Registered successfully" }`
- **409:** Email already in use
- **422:** Validation errors

### POST /auth/login
- **Auth:** No
- **Body:** `{ "email": "ali@example.com", "password": "Pass123!" }`
- **200:** `{ "success": true, "data": { "id": 1, "name": "Ali Khan", "email": "ali@example.com" } }`
- **401:** Invalid email or password

### POST /auth/logout
- **Auth:** Yes
- **200:** `{ "success": true, "message": "Logged out" }`

### GET /auth/me
- **Auth:** Yes
- **200:** `{ "success": true, "data": { "id": 1, "name": "Ali Khan", "email": "ali@example.com" } }`
- **401:** Not authenticated

---

## TEAM ENDPOINTS

### POST /teams
- **Auth:** Yes
- **Body:** `{ "name": "Dev Team" }`
- **201:** `{ "success": true, "data": { "id": 1, "name": "Dev Team", "created_by": 1 } }`
- **Note:** Creator auto-added to team_members with role `admin`

### GET /teams
- **Auth:** Yes
- **200:** Returns all teams the current user belongs to
```json
{ "success": true, "data": [{ "id": 1, "name": "Dev Team", "role": "admin" }] }
```

### GET /teams/:id
- **Auth:** Yes (must be member)
- **200:** Team details + members list
- **403:** Not a member
- **404:** Team not found

### DELETE /teams/:id
- **Auth:** Yes (admin only)
- **200:** `{ "success": true, "message": "Team deleted" }`
- **403:** Not the creator

### POST /teams/:id/members
- **Auth:** Yes (admin only)
- **Body:** `{ "email": "member@example.com" }`
- **200:** Returns new membership record
- **404:** User not found
- **409:** Already a member

### DELETE /teams/:id/members/:userId
- **Auth:** Yes (admin only)
- **200:** `{ "success": true, "message": "Member removed" }`
- **403:** Cannot remove the team creator
- **404:** Member not found

### POST /teams/:id/invite (Bonus Stub)
- **Auth:** Yes (admin only)
- **200:** `{ "success": true, "message": "Invitation link generated", "link": "..." }`

---

## TASK ENDPOINTS

### POST /tasks
- **Auth:** Yes (must be team member)
- **Body:**
```json
{
  "title": "Fix login bug",
  "description": "optional",
  "status": "todo",
  "priority": "high",
  "due_date": "2025-12-31",
  "team_id": 1,
  "assigned_to": 2
}
```
- **201:** Returns created task object
- **403:** Not a member of the team
- **422:** Validation errors

### GET /tasks
- **Auth:** Yes
- **Query params:** `?teamId=1&assignedTo=2&status=todo` (all optional)
- **200:** Returns tasks in teams the user belongs to, filtered dynamically
```json
{ "success": true, "data": [{ "id": 1, "title": "Fix login bug", "status": "todo", "priority": "high", "assigned_to_name": "Ali Khan", ... }] }
```

### PUT /tasks/:id
- **Auth:** Yes (must be team member)
- **Body:** Any subset of task fields
- **200:** Returns updated task object
- **403:** Not a member of the task's team
- **404:** Task not found

### DELETE /tasks/:id
- **Auth:** Yes (must be task creator or team admin)
- **200:** `{ "success": true, "message": "Task deleted" }`
- **403:** Not creator or admin
- **404:** Task not found
