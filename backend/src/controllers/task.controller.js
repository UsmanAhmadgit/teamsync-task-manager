const taskService = require('../services/task.service');

// POST /tasks
async function create(req, res) {
  const task = await taskService.createNewTask({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.due_date,
    teamId: req.body.team_id,
    assignedTo: req.body.assigned_to,
    createdBy: req.user.id,
  });
  res.status(201).json({ success: true, data: task });
}

// GET /tasks?teamId=1&assignedTo=2&status=todo
async function getAll(req, res) {
  const tasks = await taskService.getAllTasks({
    userId: req.user.id,
    teamId: req.query.teamId,
    assignedTo: req.query.assignedTo,
    status: req.query.status,
  });
  res.status(200).json({ success: true, data: tasks });
}

// PUT /tasks/:id
async function update(req, res) {
  const task = await taskService.editTask({
    taskId: req.params.id,
    updates: req.body,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, data: task });
}

// DELETE /tasks/:id
async function remove(req, res) {
  await taskService.removeTask({
    taskId: req.params.id,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, message: 'Task deleted' });
}

module.exports = { create, getAll, update, remove };
