const { body } = require('express-validator');

const assigneesValidator = body('assigned_to').optional({ nullable: true }).custom((value) => {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) {
    const allInts = value.every((item) => Number.isInteger(parseInt(item, 10)));
    if (!allInts) throw new Error('Assigned to must be a list of user IDs');
    return true;
  }
  if (!Number.isInteger(parseInt(value, 10))) {
    throw new Error('Assigned to must be a valid user ID');
  }
  return true;
});

const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
  body('team_id').isInt({ min: 1 }).withMessage('Valid team ID is required'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Status must be todo, in_progress, or done'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date'),
  assigneesValidator,
  body('description').optional({ nullable: true }).trim(),
];

const updateTaskValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Status must be todo, in_progress, or done'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date'),
  assigneesValidator,
  body('description').optional({ nullable: true }).trim(),
];

const createSubtaskValidator = [
  body('title').trim().notEmpty().withMessage('Subtask title is required')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a number'),
];

const updateSubtaskValidator = [
  body('title').optional().trim().notEmpty().withMessage('Subtask title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
  body('is_done').optional().isBoolean().withMessage('is_done must be true or false'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a number'),
];

const createCommentValidator = [
  body('body').trim().notEmpty().withMessage('Comment body is required'),
  body('attachment_ids').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined) return true;
    if (!Array.isArray(value)) throw new Error('attachment_ids must be an array');
    const allInts = value.every((item) => Number.isInteger(parseInt(item, 10)));
    if (!allInts) throw new Error('attachment_ids must be a list of IDs');
    return true;
  }),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  createSubtaskValidator,
  updateSubtaskValidator,
  createCommentValidator,
};
