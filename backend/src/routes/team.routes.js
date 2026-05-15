const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { createTeamValidator, addMemberValidator } = require('../validators/team.validator');
const { validate } = require('../validators/auth.validator');
const { isAuthenticated, isTeamAdmin } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

// All team routes require authentication
router.use(isAuthenticated);

// Team CRUD
router.post('/', createTeamValidator, validate, asyncHandler(teamController.create));
router.get('/', asyncHandler(teamController.getAll));
router.get('/:id', asyncHandler(teamController.getById));
router.delete('/:id', isTeamAdmin, asyncHandler(teamController.remove));

// Member management (admin only)
router.post('/:id/members', isTeamAdmin, addMemberValidator, validate, asyncHandler(teamController.addMember));
router.delete('/:id/members/:userId', isTeamAdmin, asyncHandler(teamController.removeMember));

// Bonus: invite stub (admin only)
router.post('/:id/invite', isTeamAdmin, asyncHandler(teamController.invite));

module.exports = router;
