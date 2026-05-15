const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('../db/pool');

const sessionConfig = {
  store: new pgSession({
    pool: pool,
    tableName: 'session',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                                                  // never expose cookie to client JS
    secure: process.env.NODE_ENV === 'production',                   // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' required for cross-domain in prod
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
};

module.exports = sessionConfig;
