# TeamSync — Database Schema

> Migration file: `backend/src/db/migrations/001_init.sql`

---

## Tables Overview

| Table | Purpose |
|---|---|
| `session` | Session store for connect-pg-simple (PassportJS sessions) |
| `users` | Registered user accounts |
| `teams` | Teams created by users |
| `team_members` | Many-to-many join table — users ↔ teams with roles |
| `tasks` | Tasks belonging to teams, assigned to users |

---

## Entity Relationship Diagram

```
users (1) ──────── (many) teams           [created_by]
users (many) ──── (many) teams            [via team_members]
teams (1) ──────── (many) tasks
users (1) ──────── (many) tasks           [assigned_to]
users (1) ──────── (many) tasks           [created_by]
```

---

## Table Specifications

### session
| Column | Type | Constraints |
|---|---|---|
| sid | VARCHAR | PRIMARY KEY |
| sess | JSON | NOT NULL |
| expire | TIMESTAMP(6) | NOT NULL, indexed |

### users
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password_hash | TEXT | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### teams
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| created_by | INTEGER | FK → users(id), ON DELETE CASCADE |
| created_at | TIMESTAMP | DEFAULT NOW() |

### team_members
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| team_id | INTEGER | FK → teams(id), ON DELETE CASCADE |
| user_id | INTEGER | FK → users(id), ON DELETE CASCADE |
| role | VARCHAR(20) | CHECK ('admin', 'member'), DEFAULT 'member' |
| joined_at | TIMESTAMP | DEFAULT NOW() |
| | | UNIQUE(team_id, user_id) |

### tasks
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | nullable |
| status | VARCHAR(20) | CHECK ('todo', 'in_progress', 'done'), DEFAULT 'todo' |
| priority | VARCHAR(20) | CHECK ('low', 'medium', 'high'), DEFAULT 'medium' |
| due_date | DATE | nullable |
| team_id | INTEGER | FK → teams(id), ON DELETE CASCADE |
| assigned_to | INTEGER | FK → users(id), ON DELETE SET NULL |
| created_by | INTEGER | FK → users(id) |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

## Indexes

| Table | Index | Column |
|---|---|---|
| session | IDX_session_expire | expire |
| users | idx_users_email | email (unique) |
| tasks | idx_tasks_team_id | team_id |
| tasks | idx_tasks_assigned_to | assigned_to |
| tasks | idx_tasks_status | status |
