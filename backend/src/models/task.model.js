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

async function findTasks({ userId, teamId, assignedTo, status, createdBy }) {
  let query = `
    SELECT
      t.*,
      c.name AS created_by_name,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name, 'email', u.email) ORDER BY u.name)
          FROM task_assignees ta
          JOIN users u ON u.id = ta.user_id
          WHERE ta.task_id = t.id
        ),
        '[]'::jsonb
      ) AS assignees,
      (
        SELECT COUNT(*)
        FROM task_subtasks st
        WHERE st.task_id = t.id
      ) AS subtask_total,
      (
        SELECT COUNT(*)
        FROM task_subtasks st
        WHERE st.task_id = t.id AND st.is_done = TRUE
      ) AS subtask_completed,
      EXISTS (
        SELECT 1
        FROM task_assignees ta
        JOIN team_members tm
          ON tm.team_id = t.team_id
         AND tm.user_id = ta.assigned_by
         AND tm.role = 'admin'
        WHERE ta.task_id = t.id AND ta.user_id = $1
      ) AS assigned_by_admin
    FROM tasks t
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
    query += ` AND EXISTS (
      SELECT 1 FROM task_assignees ta
      WHERE ta.task_id = t.id AND ta.user_id = $${paramIndex++}
    )`;
    params.push(assignedTo);
  }
  if (status) {
    query += ` AND t.status = $${paramIndex++}`;
    params.push(status);
  }
  if (createdBy) {
    query += ` AND t.created_by = $${paramIndex++}`;
    params.push(createdBy);
  }

  query += ' ORDER BY t.created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
}

async function findTaskById(taskId) {
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
  return result.rows[0] || null;
}

async function findTaskDetail(taskId) {
  const taskResult = await pool.query(
    `SELECT t.*, c.name AS created_by_name
     FROM tasks t
     LEFT JOIN users c ON c.id = t.created_by
     WHERE t.id = $1`,
    [taskId]
  );

  if (!taskResult.rows.length) return null;
  const task = taskResult.rows[0];

  const assigneesResult = await pool.query(
    `SELECT u.id, u.name, u.email
     FROM task_assignees ta
     JOIN users u ON u.id = ta.user_id
     WHERE ta.task_id = $1
     ORDER BY u.name`,
    [taskId]
  );

  const subtasksResult = await pool.query(
    `SELECT id, title, is_done, sort_order, created_by, created_at
     FROM task_subtasks
     WHERE task_id = $1
     ORDER BY sort_order ASC, created_at ASC`,
    [taskId]
  );

  const commentsResult = await pool.query(
    `SELECT c.id, c.body, c.created_at, c.author_id, u.name AS author_name
     FROM task_comments c
     LEFT JOIN users u ON u.id = c.author_id
     WHERE c.task_id = $1
     ORDER BY c.created_at ASC`,
    [taskId]
  );

  const attachmentsResult = await pool.query(
    `SELECT id, task_id, comment_id, uploader_id, file_name, file_path, mime_type, file_size, created_at
     FROM task_attachments
     WHERE task_id = $1
     ORDER BY created_at ASC`,
    [taskId]
  );

  const activityResult = await pool.query(
    `SELECT a.id, a.action, a.metadata, a.created_at, a.actor_id, u.name AS actor_name
     FROM task_activity a
     LEFT JOIN users u ON u.id = a.actor_id
     WHERE a.task_id = $1
     ORDER BY a.created_at DESC`,
    [taskId]
  );

  return {
    ...task,
    assignees: assigneesResult.rows,
    subtasks: subtasksResult.rows,
    comments: commentsResult.rows,
    attachments: attachmentsResult.rows,
    activity: activityResult.rows,
  };
}

async function updateTask(taskId, fields) {
  const allowedFields = ['title', 'description', 'status', 'priority', 'due_date'];
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

async function setTaskAssignees({ taskId, assigneeIds, assignedBy }) {
  await pool.query('DELETE FROM task_assignees WHERE task_id = $1', [taskId]);

  const uniqueIds = Array.from(new Set((assigneeIds || []).map((id) => parseInt(id, 10)).filter(Boolean)));
  if (!uniqueIds.length) {
    await pool.query('UPDATE tasks SET assigned_to = $1 WHERE id = $2', [null, taskId]);
    return [];
  }

  const values = uniqueIds
    .map((_, index) => `($1, $${index + 2}, $${uniqueIds.length + 2})`)
    .join(', ');
  const params = [taskId, ...uniqueIds, assignedBy || null];
  await pool.query(
    `INSERT INTO task_assignees (task_id, user_id, assigned_by)
     VALUES ${values}
     ON CONFLICT (task_id, user_id) DO NOTHING`,
    params
  );

  await pool.query('UPDATE tasks SET assigned_to = $1 WHERE id = $2', [uniqueIds[0], taskId]);
  return uniqueIds;
}

async function findAssigneeIds(taskId) {
  const result = await pool.query('SELECT user_id FROM task_assignees WHERE task_id = $1', [taskId]);
  return result.rows.map((row) => row.user_id);
}

async function isAssigneeAssignedByAdmin({ taskId, userId, teamId }) {
  const result = await pool.query(
    `SELECT 1
     FROM task_assignees ta
     JOIN team_members tm
       ON tm.team_id = $3
      AND tm.user_id = ta.assigned_by
      AND tm.role = 'admin'
     WHERE ta.task_id = $1 AND ta.user_id = $2
     LIMIT 1`,
    [taskId, userId, teamId]
  );
  return result.rows.length > 0;
}

async function createSubtask({ taskId, title, sortOrder, createdBy }) {
  const result = await pool.query(
    `INSERT INTO task_subtasks (task_id, title, sort_order, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [taskId, title, sortOrder || 0, createdBy || null]
  );
  return result.rows[0];
}

async function findSubtaskById(subtaskId) {
  const result = await pool.query('SELECT * FROM task_subtasks WHERE id = $1', [subtaskId]);
  return result.rows[0] || null;
}

async function updateSubtask({ subtaskId, updates }) {
  const allowedFields = ['title', 'is_done', 'sort_order'];
  const setClauses = [];
  const params = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      setClauses.push(`${key} = $${paramIndex++}`);
      params.push(value);
    }
  }

  if (!setClauses.length) return null;

  params.push(subtaskId);
  const result = await pool.query(
    `UPDATE task_subtasks SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

async function deleteSubtask(subtaskId) {
  await pool.query('DELETE FROM task_subtasks WHERE id = $1', [subtaskId]);
}

async function createComment({ taskId, authorId, body }) {
  const result = await pool.query(
    `INSERT INTO task_comments (task_id, author_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [taskId, authorId || null, body]
  );
  return result.rows[0];
}

async function createAttachment({ taskId, commentId, uploaderId, fileName, filePath, mimeType, fileSize }) {
  const result = await pool.query(
    `INSERT INTO task_attachments (task_id, comment_id, uploader_id, file_name, file_path, mime_type, file_size)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [taskId, commentId || null, uploaderId || null, fileName, filePath, mimeType || null, fileSize || null]
  );
  return result.rows[0];
}

async function attachFilesToComment({ commentId, attachmentIds, taskId }) {
  if (!attachmentIds || !attachmentIds.length) return;
  await pool.query(
    `UPDATE task_attachments SET comment_id = $1
     WHERE id = ANY($2::int[]) AND task_id = $3`,
    [commentId, attachmentIds, taskId]
  );
}

async function createActivity({ taskId, actorId, action, metadata }) {
  await pool.query(
    `INSERT INTO task_activity (task_id, actor_id, action, metadata)
     VALUES ($1, $2, $3, $4)`,
    [taskId, actorId || null, action, metadata || {}]
  );
}

async function deleteTask(taskId) {
  await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
}

module.exports = {
  createTask,
  findTasks,
  findTaskById,
  findTaskDetail,
  updateTask,
  setTaskAssignees,
  findAssigneeIds,
  isAssigneeAssignedByAdmin,
  createSubtask,
  findSubtaskById,
  updateSubtask,
  deleteSubtask,
  createComment,
  createAttachment,
  attachFilesToComment,
  createActivity,
  deleteTask,
};
