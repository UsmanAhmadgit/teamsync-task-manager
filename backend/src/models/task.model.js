const { pool } = require('../db/pool');

async function createTask({ title, description, status, priority, dueDate, teamId, assignedTo, createdBy }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, status, priority, due_date, team_id, assigned_to, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [title, description || null, status || 'todo', priority || 'medium', dueDate || null, teamId, assignedTo || null, createdBy]
  );
  return result.rows[0];
}

async function findTasks({ userId, teamId, assignedTo, status }) {
  let query = `
    SELECT t.*, u.name AS assigned_to_name, c.name AS created_by_name
    FROM tasks t
    LEFT JOIN users u ON u.id = t.assigned_to
    LEFT JOIN users c ON c.id = t.created_by
    JOIN team_members tm ON tm.team_id = t.team_id
    WHERE tm.user_id = $1
  `;
  const params = [userId];
  let paramIndex = 2;

  if (teamId) {
    query += ` AND t.team_id = $${paramIndex++}`;
    params.push(teamId);
  }
  if (assignedTo) {
    query += ` AND t.assigned_to = $${paramIndex++}`;
    params.push(assignedTo);
  }
  if (status) {
    query += ` AND t.status = $${paramIndex++}`;
    params.push(status);
  }

  query += ' ORDER BY t.created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
}

async function findTaskById(taskId) {
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
  return result.rows[0] || null;
}

async function updateTask(taskId, fields) {
  const allowedFields = ['title', 'description', 'status', 'priority', 'due_date', 'assigned_to'];
  const setClauses = [];
  const params = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(fields)) {
    // Map camelCase to snake_case
    const col = key === 'dueDate' ? 'due_date' : key === 'assignedTo' ? 'assigned_to' : key;
    if (allowedFields.includes(col)) {
      setClauses.push(`${col} = $${paramIndex++}`);
      params.push(value);
    }
  }

  if (!setClauses.length) return null;

  params.push(taskId);
  const result = await pool.query(
    `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

async function deleteTask(taskId) {
  await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
}

module.exports = { createTask, findTasks, findTaskById, updateTask, deleteTask };
