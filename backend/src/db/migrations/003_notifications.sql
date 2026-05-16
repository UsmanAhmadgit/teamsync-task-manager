-- ============================================================
-- TeamSync Database Schema — Migration 003
-- Notifications: task assignments, mentions, due dates, invites
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL, -- 'assignment', 'mention', 'deadline', 'invite'
  title       VARCHAR(255) NOT NULL,
  message     TEXT,
  related_id  INTEGER, -- can be task_id or team_id depending on type
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
