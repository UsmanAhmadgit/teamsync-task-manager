# TeamSync — Frontend Structure

---

## Pages

| Route | Page | Access |
|---|---|---|
| `/login` | LoginPage.jsx | Public |
| `/register` | RegisterPage.jsx | Public |
| `/dashboard` | DashboardPage.jsx | Protected |
| `/teams/:id` | TeamPage.jsx | Protected |
| `*` | NotFoundPage.jsx | Public |

---

## Components

| Component | Purpose |
|---|---|
| ProtectedRoute.jsx | Blocks unauthenticated access, shows spinner during auth check |
| TaskModal.jsx | Create + edit task in modal overlay |
| TaskCard.jsx | Displays task with priority/status badges and overdue indicator |
| TeamCard.jsx | Displays team with role badge, links to detail page |
| FilterBar.jsx | Team and status filter dropdowns |
| Toast.jsx | Auto-dismiss notification (success/error/warning) |
| LoadingSpinner.jsx | Full-screen centered spinner |
| EmptyState.jsx | Placeholder for empty lists |

---

## Services

| Service | Methods |
|---|---|
| axiosInstance.js | Base axios with withCredentials, 401 interceptor |
| authService.js | register, login, logout, getMe |
| teamService.js | getAll, getById, create, delete, addMember, removeMember |
| taskService.js | getAll (with filters), create, update, delete |

---

## Hooks

| Hook | Purpose |
|---|---|
| useAuth.js | Access AuthContext (user, loading, login, logout) |
| useTeams.js | Fetch teams with refetch capability |
| useTasks.js | Fetch tasks with dynamic filter support |

---

## State Management

- **AuthContext**: Global user state, session re-check on mount
- **Local state (useState)**: Tasks, teams, modals, filters, forms
- **No external state library** — React Context + hooks only
