const { pool } = require('../db/pool');

async function createTeam({ name, userId }) {
  const result = await pool.query(
    'INSERT INTO teams (name, created_by) VALUES ($1, $2) RETURNING *',
    [name, userId]
  );
  return result.rows[0];
}

async function findTeamsByUserId(userId) {
  const result = await pool.query(
    `SELECT t.id, t.name, t.created_by, t.created_at, tm.role
     FROM teams t
     JOIN team_members tm ON tm.team_id = t.id
     WHERE tm.user_id = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function findTeamById(teamId) {
  const result = await pool.query('SELECT * FROM teams WHERE id = $1', [teamId]);
  return result.rows[0] || null;
}

async function findTeamMembers(teamId) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, tm.role, tm.joined_at
     FROM team_members tm
     JOIN users u ON u.id = tm.user_id
     WHERE tm.team_id = $1
     ORDER BY tm.joined_at ASC`,
    [teamId]
  );
  return result.rows;
}

async function addTeamMember({ teamId, userId, role = 'member' }) {
  const result = await pool.query(
    'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
    [teamId, userId, role]
  );
  return result.rows[0];
}

async function removeTeamMember({ teamId, userId }) {
  await pool.query(
    'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2',
    [teamId, userId]
  );
}

async function findMembership({ teamId, userId }) {
  const result = await pool.query(
    'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2',
    [teamId, userId]
  );
  return result.rows[0] || null;
}

async function deleteTeam(teamId) {
  await pool.query('DELETE FROM teams WHERE id = $1', [teamId]);
}

module.exports = {
  createTeam,
  findTeamsByUserId,
  findTeamById,
  findTeamMembers,
  addTeamMember,
  removeTeamMember,
  findMembership,
  deleteTeam,
};
