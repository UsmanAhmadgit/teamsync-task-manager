const { body } = require('express-validator');

const createTeamValidator = [
  body('name').trim().notEmpty().withMessage('Team name is required')
    .isLength({ max: 100 }).withMessage('Team name must be 100 characters or less'),
];

const addMemberValidator = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
];

module.exports = { createTeamValidator, addMemberValidator };
