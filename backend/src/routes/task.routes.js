const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { createTaskValidator, updateTaskValidator } = require('../validators/task.validator');
const { validate } = require('../validators/auth.validator');
const { isAuthenticated } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

// All task routes require authentication
router.use(isAuthenticated);

router.post('/', createTaskValidator, validate, asyncHandler(taskController.create));
router.get('/', asyncHandler(taskController.getAll));
router.put('/:id', updateTaskValidator, validate, asyncHandler(taskController.update));
router.delete('/:id', asyncHandler(taskController.remove));

module.exports = router;
