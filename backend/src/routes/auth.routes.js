const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidator, loginValidator, validate } = require('../validators/auth.validator');
const { isAuthenticated } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

// Public routes
router.post('/register', registerValidator, validate, asyncHandler(authController.register));
router.post('/login', loginValidator, validate, authController.login);

// Protected routes
router.post('/logout', isAuthenticated, authController.logout);
router.get('/me', isAuthenticated, authController.getMe);

module.exports = router;
