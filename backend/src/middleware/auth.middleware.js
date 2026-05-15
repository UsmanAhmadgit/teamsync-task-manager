const { pool } = require('../db/pool');

// Checks if user has an active session
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ success: false, message: 'Not authenticated' });
}

// Checks if user is an admin of the specified team
// Reads team_id from req.params.id OR req.body.team_id
async function isTeamAdmin(req, res, next) {
  try {
    const teamId = req.params.id || req.body.team_id;
    const userId = req.user.id;

    if (!teamId) {
      return res.status(400).json({ success: false, message: 'Team ID is required' });
    }

    const result = await pool.query(
      'SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );

    if (!result.rows.length || result.rows[0].role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { isAuthenticated, isTeamAdmin };
