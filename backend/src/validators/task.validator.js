const { body } = require('express-validator');

const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
  body('team_id').isInt({ min: 1 }).withMessage('Valid team ID is required'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Status must be todo, in_progress, or done'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date'),
  body('assigned_to').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Assigned to must be a valid user ID'),
  body('description').optional({ nullable: true }).trim(),
];

const updateTaskValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Status must be todo, in_progress, or done'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date'),
  body('assigned_to').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Assigned to must be a valid user ID'),
  body('description').optional({ nullable: true }).trim(),
];

module.exports = { createTaskValidator, updateTaskValidator };
