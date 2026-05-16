const { pool } = require('../db/pool');

async function createNotification({ userId, type, title, message, relatedId }) {
  const result = await pool.query(
    'INSERT INTO notifications (user_id, type, title, message, related_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, type, title, message, relatedId]
  );
  return result.rows[0];
}

async function getNotificationsForUser(userId) {
  const result = await pool.query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [userId]
  );
  return result.rows;
}

async function markNotificationAsRead(id, userId) {
  const result = await pool.query(
    'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return result.rows[0];
}

async function markAllAsRead(userId) {
  await pool.query(
    'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
    [userId]
  );
}

module.exports = { createNotification, getNotificationsForUser, markNotificationAsRead, markAllAsRead };
