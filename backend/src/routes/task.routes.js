const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const {
	createTaskValidator,
	updateTaskValidator,
	createSubtaskValidator,
	updateSubtaskValidator,
	createCommentValidator,
} = require('../validators/task.validator');
const { validate } = require('../validators/auth.validator');
const { isAuthenticated } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const { upload } = require('../config/upload.config');

// All task routes require authentication
router.use(isAuthenticated);

router.post('/', createTaskValidator, validate, asyncHandler(taskController.create));
router.get('/', asyncHandler(taskController.getAll));
router.get('/:id', asyncHandler(taskController.getById));
router.put('/:id', updateTaskValidator, validate, asyncHandler(taskController.update));
router.delete('/:id', asyncHandler(taskController.remove));

// Subtasks
router.post('/:id/subtasks', createSubtaskValidator, validate, asyncHandler(taskController.addSubtask));
router.put('/:id/subtasks/:subtaskId', updateSubtaskValidator, validate, asyncHandler(taskController.updateSubtask));
router.delete('/:id/subtasks/:subtaskId', asyncHandler(taskController.removeSubtask));

// Comments
router.post('/:id/comments', createCommentValidator, validate, asyncHandler(taskController.addComment));

// Attachments
router.post('/:id/attachments', upload.single('file'), asyncHandler(taskController.addAttachment));

module.exports = router;
