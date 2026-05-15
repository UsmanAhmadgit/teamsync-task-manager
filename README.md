# TeamSync

A full-stack team task management and collaboration platform built with session-based authentication, role-based access control, and dynamic task filtering.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express, PassportJS |
| Database | PostgreSQL |
| Session Store | connect-pg-simple |
| Deployment | GCP Compute Engine (backend) + Firebase Hosting (frontend) |

---

## Features

- **Authentication** — Register, login, logout with session-based auth (PassportJS + bcrypt)
- **Team Management** — Create teams, add/remove members, role-based access (admin/member)
- **Task Management** — Create, edit, delete tasks with priority, status, and due dates
- **Dynamic Filtering** — Filter tasks by team, assignee, and status
- **Overdue Detection** — Visual overdue badges on tasks past their due date
- **Protected Routes** — Session re-check on page refresh with loading state
- **Responsive UI** — Dark-themed, mobile-friendly interface

---

## Project Structure

```
teamsync-task-manager/
├── backend/                 # Express REST API
│   ├── src/
│   │   ├── config/          # CORS, session, passport configs
│   │   ├── controllers/     # Request/response handling
│   │   ├── db/              # Pool + migrations
│   │   ├── middleware/       # Auth + error handlers
│   │   ├── models/          # Raw SQL queries
│   │   ├── routes/          # Endpoint definitions
│   │   ├── services/        # Business logic
│   │   ├── utils/           # asyncHandler
│   │   ├── validators/      # express-validator rules
│   │   └── app.js           # Express app entry
│   └── package.json
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # useAuth, useTeams, useTasks
│   │   ├── pages/           # Route-level pages
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Date utilities
│   │   ├── App.jsx          # Router setup
│   │   └── main.jsx         # Entry point
│   └── package.json
└── docs/                    # Project documentation
```

---

## Quick Start

### Prerequisites
- Node.js >= 20
- PostgreSQL >= 14

### Backend
```bash
cd backend
npm install
cp .env.example .env     # fill in your values
npm run dev              # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env     # fill in your values
npm run dev              # http://localhost:5173
```

### Database
```sql
CREATE USER teamsync_user WITH PASSWORD 'yourpassword';
CREATE DATABASE teamsync_db OWNER teamsync_user;
```
```bash
psql -U teamsync_user -d teamsync_db -f backend/src/db/migrations/001_init.sql
```

See [docs/10-environment-setup.md](docs/10-environment-setup.md) for the full setup guide.

---

## API Endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | /auth/register | No | Register |
| POST | /auth/login | No | Login |
| POST | /auth/logout | Yes | Logout |
| GET | /auth/me | Yes | Session check |
| POST | /teams | Yes | Create team |
| GET | /teams | Yes | List user's teams |
| GET | /teams/:id | Yes | Team details |
| DELETE | /teams/:id | Admin | Delete team |
| POST | /teams/:id/members | Admin | Add member |
| DELETE | /teams/:id/members/:userId | Admin | Remove member |
| POST | /tasks | Yes | Create task |
| GET | /tasks | Yes | List/filter tasks |
| PUT | /tasks/:id | Yes | Update task |
| DELETE | /tasks/:id | Yes | Delete task |

See [docs/04-api-spec.md](docs/04-api-spec.md) for full request/response examples.

---

## Documentation

| Doc | Contents |
|---|---|
| [01-requirements.md](docs/01-requirements.md) | Project requirements |
| [02-system-design.md](docs/02-system-design.md) | System architecture |
| [03-database-schema.md](docs/03-database-schema.md) | ERD + table specs |
| [04-api-spec.md](docs/04-api-spec.md) | Full API specification |
| [05-auth-flow.md](docs/05-auth-flow.md) | Authentication flows |
| [10-environment-setup.md](docs/10-environment-setup.md) | Local dev setup |

---

## Git Workflow

- `main` — protected, production-ready
- `develop` — integration branch
- `feature/*` — feature branches off develop
- Conventional Commits enforced

---

## License

ISC