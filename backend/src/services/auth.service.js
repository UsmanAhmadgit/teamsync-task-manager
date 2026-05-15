const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { findUserByEmail, createUser } = require('../models/user.model');

const SALT_ROUNDS = 12;

async function register({ name, email, password }) {
  // Check for duplicate email
  const existing = await findUserByEmail(email);
  if (existing) {
    throw createError(409, 'Email already in use');
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await createUser({ name, email, passwordHash });
}

module.exports = { register };
