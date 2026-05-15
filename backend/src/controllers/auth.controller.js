const passport = require('passport');
const authService = require('../services/auth.service');

// POST /auth/register
async function register(req, res) {
  const { name, email, password } = req.body;
  await authService.register({ name, email, password });
  res.status(201).json({ success: true, message: 'Registered successfully' });
}

// POST /auth/login
function login(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info.message || 'Invalid email or password' });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(200).json({
        success: true,
        data: { id: user.id, name: user.name, email: user.email },
      });
    });
  })(req, res, next);
}

// POST /auth/logout
function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.status(200).json({ success: true, message: 'Logged out' });
    });
  });
}

// GET /auth/me
function getMe(req, res) {
  res.status(200).json({
    success: true,
    data: { id: req.user.id, name: req.user.name, email: req.user.email },
  });
}

module.exports = { register, login, logout, getMe };
