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
    createdBy: req.query.createdBy,
  });
  res.status(200).json({ success: true, data: tasks });
}

// GET /tasks/:id
async function getById(req, res) {
  const task = await taskService.getTaskDetails({
    taskId: req.params.id,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, data: task });
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

// POST /tasks/:id/subtasks
async function addSubtask(req, res) {
  const subtask = await taskService.addSubtask({
    taskId: req.params.id,
    title: req.body.title,
    sortOrder: req.body.sort_order,
    userId: req.user.id,
  });
  res.status(201).json({ success: true, data: subtask });
}

// PUT /tasks/:id/subtasks/:subtaskId
async function updateSubtask(req, res) {
  const subtask = await taskService.editSubtask({
    subtaskId: req.params.subtaskId,
    updates: req.body,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, data: subtask });
}

// DELETE /tasks/:id/subtasks/:subtaskId
async function removeSubtask(req, res) {
  await taskService.removeSubtask({
    subtaskId: req.params.subtaskId,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, message: 'Subtask deleted' });
}

// POST /tasks/:id/comments
async function addComment(req, res) {
  const comment = await taskService.addComment({
    taskId: req.params.id,
    body: req.body.body,
    attachmentIds: req.body.attachment_ids,
    userId: req.user.id,
  });
  res.status(201).json({ success: true, data: comment });
}



module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  addSubtask,
  updateSubtask,
  removeSubtask,
  addComment,
};
