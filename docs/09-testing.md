# TeamSync — Testing Plan

---

## Tools
- Postman / Thunder Client for API testing
- Browser DevTools for session/cookie verification

---

## Auth Tests

| Endpoint | Input | Expected | Status |
|---|---|---|---|
| POST /auth/register | valid data | 201 | |
| POST /auth/register | duplicate email | 409 | |
| POST /auth/register | missing fields | 422 | |
| POST /auth/login | correct credentials | 200 | |
| POST /auth/login | wrong password | 401 | |
| POST /auth/login | non-existent email | 401 | |
| GET /auth/me | valid session | 200 | |
| GET /auth/me | no session | 401 | |
| POST /auth/logout | logged in | 200 | |

## Team Tests

| Endpoint | Input | Expected | Status |
|---|---|---|---|
| POST /teams | logged in | 201 | |
| POST /teams | not logged in | 401 | |
| DELETE /teams/:id | as creator | 200 | |
| DELETE /teams/:id | as member | 403 | |
| POST /teams/:id/members | valid email | 200 | |
| POST /teams/:id/members | non-existent email | 404 | |

## Task Tests

| Endpoint | Input | Expected | Status |
|---|---|---|---|
| POST /tasks | valid data, member | 201 | |
| POST /tasks | not logged in | 401 | |
| POST /tasks | not a member | 403 | |
| GET /tasks?teamId=1 | filter by team | 200 | |
| PUT /tasks/:id | valid update | 200 | |
| DELETE /tasks/:id | as creator | 200 | |

## Edge Cases

- Login → refresh page → session persists
- Logout → visit /dashboard → redirects to login
- Access team you're not a member of → 403
- Task with past due_date → overdue badge shows
- Delete team → all tasks cascade-deleted
