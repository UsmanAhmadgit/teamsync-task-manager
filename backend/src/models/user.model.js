const { pool } = require('../db/pool');

// Find user by email — returns full row including password_hash (used only in Passport)
async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

// Find user by ID — NEVER returns password_hash (used in deserialization + responses)
async function findUserById(id) {
  const result = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

// Create a new user — returns safe fields only
async function createUser({ name, email, passwordHash }) {
  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
    [name, email, passwordHash]
  );
  return result.rows[0];
}

async function updateUser(id, { name, email, passwordHash }) {
  if (passwordHash) {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING id, name, email, created_at',
      [name, email, passwordHash, id]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, id]
    );
    return result.rows[0];
  }
}

module.exports = { findUserByEmail, findUserById, createUser, updateUser };
