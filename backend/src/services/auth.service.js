const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { findUserByEmail, createUser, updateUser, findUserById } = require('../models/user.model');

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

async function updateProfile(id, { name, email, password }) {
  const existingUser = await findUserById(id);
  if (!existingUser) throw createError(404, 'User not found');

  if (email && email !== existingUser.email) {
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) throw createError(409, 'Email already in use');
  }

  const passwordHash = password ? await bcrypt.hash(password, SALT_ROUNDS) : undefined;
  
  return await updateUser(id, { 
    name: name || existingUser.name, 
    email: email || existingUser.email, 
    passwordHash 
  });
}

module.exports = { register, updateProfile };
