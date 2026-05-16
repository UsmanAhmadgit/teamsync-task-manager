const notificationModel = require('../models/notification.model');
const taskModel = require('../models/task.model');

async function getNotifications(req, res) {
  const userId = req.user.id;
  
  // Dynamically check deadlines
  const allTasks = await taskModel.findTasks({ userId });
  const tasks = allTasks.filter(t => t.created_by === userId || (t.assignees && t.assignees.some(a => a.id === userId)));
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const notifications = await notificationModel.getNotificationsForUser(userId);

  let newNotificationsAdded = false;
  for (const task of tasks) {
    if (task.due_date && task.status !== 'done') {
      const dueDate = new Date(task.due_date);
      if (dueDate > now && dueDate <= next24h) {
        const title = `Approaching Deadline: ${task.title}`;
        const existing = notifications.find(n => n.type === 'deadline' && n.related_id === task.id);
        if (!existing) {
          const newNotif = await notificationModel.createNotification({
            userId,
            type: 'deadline',
            title,
            message: `Task is due in less than 24 hours.`,
            relatedId: task.id
          });
          notifications.unshift(newNotif);
          newNotificationsAdded = true;
        }
      }
    }
  }
  
  if (newNotificationsAdded) {
    notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  res.status(200).json({ success: true, data: notifications });
}

async function markAsRead(req, res) {
  const notificationId = req.params.id;
  const userId = req.user.id;
  
  const updated = await notificationModel.markNotificationAsRead(notificationId, userId);
  res.status(200).json({ success: true, data: updated });
}

async function markAllAsRead(req, res) {
  const userId = req.user.id;
  await notificationModel.markAllAsRead(userId);
  res.status(200).json({ success: true, message: 'All notifications marked as read' });
}

module.exports = { getNotifications, markAsRead, markAllAsRead };
