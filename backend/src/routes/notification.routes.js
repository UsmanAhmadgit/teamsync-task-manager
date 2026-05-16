const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.use(isAuthenticated);

router.get('/', asyncHandler(notificationController.getNotifications));
router.patch('/:id/read', asyncHandler(notificationController.markAsRead));
router.post('/read-all', asyncHandler(notificationController.markAllAsRead));

module.exports = router;
