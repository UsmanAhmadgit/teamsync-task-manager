const createError = require('http-errors');
const { findMembership } = require('../models/team.model');
const { createTask, findTasks, findTaskById, updateTask, deleteTask } = require('../models/task.model');

async function createNewTask({ title, description, status, priority, dueDate, teamId, assignedTo, createdBy }) {
  // Validate that the creator is a member of the team
  const membership = await findMembership({ teamId, userId: createdBy });
  if (!membership) throw createError(403, 'You are not a member of this team');

  return createTask({ title, description, status, priority, dueDate, teamId, assignedTo, createdBy });
}

async function getAllTasks({ userId, teamId, assignedTo, status }) {
  return findTasks({ userId, teamId, assignedTo, status });
}

async function editTask({ taskId, updates, userId }) {
  const task = await findTaskById(taskId);
  if (!task) throw createError(404, 'Task not found');

  // Ensure user is a member of the task's team
  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  return updateTask(taskId, updates);
}

async function removeTask({ taskId, userId }) {
  const task = await findTaskById(taskId);
  if (!task) throw createError(404, 'Task not found');

  // Must be task creator OR team admin
  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  const isCreator = task.created_by === userId;
  const isAdmin = membership.role === 'admin';

  if (!isCreator && !isAdmin) {
    throw createError(403, 'Only the task creator or a team admin can delete this task');
  }

  await deleteTask(taskId);
}

module.exports = { createNewTask, getAllTasks, editTask, removeTask };
