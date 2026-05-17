# TeamSync — Git Workflow

---

## Branch Strategy

```
main          ← production-ready only, protected
  └── develop       ← integration branch
        ├── feature/auth
        ├── feature/teams
        ├── feature/tasks
        ├── feature/polish
        └── bugfix/*
```

---

## Rules

- **Never** commit directly to `main` or `develop`
- All work happens on `feature/*` or `bugfix/*` branches
- PRs merge into `develop` — reviewed before merge
- Final PR: `develop → main` for release

---

## Commit Message Format (Conventional Commits)

| Type | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI/CSS changes only |
| `refactor:` | Code restructure (no behavior change) |
| `docs:` | Documentation only |
| `chore:` | Setup, config, dependencies |

---

## Branch History

| Branch | Status | PR |
|---|---|---|
| feature/auth | ✅ Merged | Auth system (backend + frontend) |
| feature/teams | ✅ Merged | Team CRUD + member management |
| feature/tasks | ✅ Merged | Task CRUD + filtering + UI |
| feature/polish | ✅ Merged | Dockerfile, README, docs |
