-- ============================================================
-- TeamSync Database Schema — Migration 002
-- Task Enhancements: assignees, subtasks, comments, activity, attachments
-- ============================================================

-- TASK ASSIGNEES (multi-user assignment)
CREATE TABLE IF NOT EXISTS task_assignees (
  id          SERIAL PRIMARY KEY,
  task_id     INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_task_assignees_task_id ON task_assignees(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignees_user_id ON task_assignees(user_id);

-- TASK SUBTASKS (checklist)
CREATE TABLE IF NOT EXISTS task_subtasks (
  id         SERIAL PRIMARY KEY,
  task_id    INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  is_done    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_subtasks_task_id ON task_subtasks(task_id);

-- TASK COMMENTS
CREATE TABLE IF NOT EXISTS task_comments (
  id         SERIAL PRIMARY KEY,
  task_id    INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);

-- TASK ATTACHMENTS
CREATE TABLE IF NOT EXISTS task_attachments (
  id         SERIAL PRIMARY KEY,
  task_id    INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  comment_id INTEGER REFERENCES task_comments(id) ON DELETE SET NULL,
  uploader_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  file_name  VARCHAR(255) NOT NULL,
  file_path  TEXT NOT NULL,
  mime_type  VARCHAR(100),
  file_size  INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_comment_id ON task_attachments(comment_id);

-- TASK ACTIVITY LOG
CREATE TABLE IF NOT EXISTS task_activity (
  id         SERIAL PRIMARY KEY,
  task_id    INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  actor_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action     VARCHAR(50) NOT NULL,
  metadata   JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_activity_task_id ON task_activity(task_id);

-- Backfill existing single assignees into task_assignees
INSERT INTO task_assignees (task_id, user_id, assigned_by)
SELECT id, assigned_to, created_by
FROM tasks
WHERE assigned_to IS NOT NULL
ON CONFLICT (task_id, user_id) DO NOTHING;
