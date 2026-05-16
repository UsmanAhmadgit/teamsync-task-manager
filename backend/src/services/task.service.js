const createError = require('http-errors');
const { findMembership, findTeamMemberIds } = require('../models/team.model');
const {
  createTask,
  findTasks,
  findTaskById,
  findTaskDetail,
  updateTask,
  deleteTask,
  setTaskAssignees,
  findAssigneeIds,
  isAssigneeAssignedByAdmin,
  createSubtask,
  findSubtaskById,
  updateSubtask,
  deleteSubtask,
  createComment,
  createAttachment,
  attachFilesToComment,
  createActivity,
} = require('../models/task.model');
const { createNotification } = require('../models/notification.model');

function normalizeAssignees(input) {
  if (input === undefined) return null;
  if (input === null) return [];
  if (Array.isArray(input)) return input.map((id) => parseInt(id, 10)).filter(Boolean);
  const parsed = parseInt(input, 10);
  return Number.isNaN(parsed) ? [] : [parsed];
}

async function validateAssignees(teamId, assigneeIds) {
  if (!assigneeIds || !assigneeIds.length) return [];
  const memberIds = await findTeamMemberIds(teamId, assigneeIds);
  if (memberIds.length !== assigneeIds.length) {
    throw createError(400, 'All assignees must be members of this team');
  }
  return memberIds;
}

async function createNewTask({ title, description, status, priority, dueDate, teamId, assignedTo, createdBy }) {
  // Validate that the creator is a member of the team
  const membership = await findMembership({ teamId, userId: createdBy });
  if (!membership) throw createError(403, 'You are not a member of this team');

  const assigneeIds = normalizeAssignees(assignedTo) || [];
  await validateAssignees(teamId, assigneeIds);

  const task = await createTask({
    title,
    description,
    status,
    priority,
    dueDate,
    teamId,
    assignedTo: assigneeIds[0] || null,
    createdBy,
  });

  await setTaskAssignees({ taskId: task.id, assigneeIds, assignedBy: createdBy });
  
  // Notify assignees
  for (const assigneeId of assigneeIds) {
    if (assigneeId !== createdBy) {
      await createNotification({
        userId: assigneeId,
        type: 'assignment',
        title: `New Task Assigned: ${title}`,
        message: `You have been assigned to the task: ${title}`,
        relatedId: task.id
      });
    }
  }

  await createActivity({
    taskId: task.id,
    actorId: createdBy,
    action: 'created',
    metadata: { title, assignees: assigneeIds },
  });

  return findTaskDetail(task.id);
}

async function getAllTasks({ userId, teamId, assignedTo, status, createdBy }) {
  return findTasks({ userId, teamId, assignedTo, status, createdBy });
}

async function editTask({ taskId, updates, userId }) {
  const task = await findTaskById(taskId);
  if (!task) throw createError(404, 'Task not found');

  // Ensure user is a member of the task's team
  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  const isAdmin = membership.role === 'admin';
  const isCreator = task.created_by === userId;
  const requestedKeys = Object.keys(updates).filter((key) => updates[key] !== undefined);
  const hasAssigneeUpdate = updates.assigned_to !== undefined || updates.assignedTo !== undefined;

  if (!isAdmin && !isCreator) {
    const statusOnly = requestedKeys.length === 1 && requestedKeys[0] === 'status';
    if (!statusOnly || hasAssigneeUpdate) {
      throw createError(403, 'Only task creators can edit this task');
    }

    const canUpdateStatus = await isAssigneeAssignedByAdmin({
      taskId,
      userId,
      teamId: task.team_id,
    });

    if (!canUpdateStatus) {
      throw createError(403, 'Only admin-assigned assignees can update task status');
    }
  }

  const assigneeInput = hasAssigneeUpdate
    ? normalizeAssignees(updates.assigned_to ?? updates.assignedTo)
    : null;
  if (assigneeInput !== null) {
    await validateAssignees(task.team_id, assigneeInput);
  }

  const updateFields = { ...updates };
  delete updateFields.assigned_to;
  delete updateFields.assignedTo;

  let updatedTask = task;
  if (Object.keys(updateFields).length) {
    if (updateFields.status && updateFields.status !== task.status) {
      await createActivity({
        taskId,
        actorId: userId,
        action: 'status_changed',
        metadata: { from: task.status, to: updateFields.status },
      });
    }
    updatedTask = await updateTask(taskId, updateFields);
  }

  if (assigneeInput !== null) {
    const previousAssignees = await findAssigneeIds(taskId);
    await setTaskAssignees({ taskId, assigneeIds: assigneeInput, assignedBy: userId });
    
    // Notify new assignees
    const newAssignees = assigneeInput.filter(id => !previousAssignees.includes(id));
    for (const assigneeId of newAssignees) {
      if (assigneeId !== userId) {
        await createNotification({
          userId: assigneeId,
          type: 'assignment',
          title: `New Task Assigned: ${task.title}`,
          message: `You have been assigned to the task: ${task.title}`,
          relatedId: task.id
        });
      }
    }

    await createActivity({
      taskId,
      actorId: userId,
      action: 'assignees_updated',
      metadata: { previous: previousAssignees, next: assigneeInput },
    });
  }

  return findTaskDetail(updatedTask.id);
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

async function getTaskDetails({ taskId, userId }) {
  const task = await findTaskById(taskId);
  if (!task) throw createError(404, 'Task not found');

  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  return findTaskDetail(taskId);
}

async function addSubtask({ taskId, title, sortOrder, userId }) {
  const task = await findTaskById(taskId);
  if (!task) throw createError(404, 'Task not found');

  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  const subtask = await createSubtask({ taskId, title, sortOrder, createdBy: userId });
  await createActivity({
    taskId,
    actorId: userId,
    action: 'subtask_added',
    metadata: { subtaskId: subtask.id, title },
  });
  return subtask;
}

async function editSubtask({ subtaskId, updates, userId }) {
  const subtask = await findSubtaskById(subtaskId);
  if (!subtask) throw createError(404, 'Subtask not found');

  const task = await findTaskById(subtask.task_id);
  if (!task) throw createError(404, 'Task not found');

  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  const updated = await updateSubtask({ subtaskId, updates });
  if (updates.is_done !== undefined) {
    await createActivity({
      taskId: task.id,
      actorId: userId,
      action: 'subtask_toggled',
      metadata: { subtaskId, isDone: updates.is_done },
    });
  }
  return updated;
}

async function removeSubtask({ subtaskId, userId }) {
  const subtask = await findSubtaskById(subtaskId);
  if (!subtask) throw createError(404, 'Subtask not found');

  const task = await findTaskById(subtask.task_id);
  if (!task) throw createError(404, 'Task not found');

  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  await deleteSubtask(subtaskId);
  await createActivity({
    taskId: task.id,
    actorId: userId,
    action: 'subtask_removed',
    metadata: { subtaskId },
  });
}

async function addComment({ taskId, body, attachmentIds, userId }) {
  const task = await findTaskById(taskId);
  if (!task) throw createError(404, 'Task not found');

  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  const comment = await createComment({ taskId, authorId: userId, body });
  if (attachmentIds && attachmentIds.length) {
    await attachFilesToComment({ commentId: comment.id, attachmentIds, taskId });
  }

  await createActivity({
    taskId,
    actorId: userId,
    action: 'comment_added',
    metadata: { commentId: comment.id },
  });

  // Notify task creator and other assignees
  const assignees = await findAssigneeIds(taskId);
  const usersToNotify = new Set([...assignees, task.created_by]);
  usersToNotify.delete(userId); // Don't notify self
  
  for (const uid of usersToNotify) {
    await createNotification({
      userId: uid,
      type: 'mention',
      title: `New Comment on: ${task.title}`,
      message: `Someone commented on a task you are involved in.`,
      relatedId: taskId
    });
  }

  return comment;
}

async function addAttachment({ taskId, file, userId }) {
  const task = await findTaskById(taskId);
  if (!task) throw createError(404, 'Task not found');

  const membership = await findMembership({ teamId: task.team_id, userId });
  if (!membership) throw createError(403, 'You do not have access to this task');

  const attachment = await createAttachment({
    taskId,
    commentId: null,
    uploaderId: userId,
    fileName: file.originalname,
    filePath: `/uploads/${file.filename}`,
    mimeType: file.mimetype,
    fileSize: file.size,
  });

  await createActivity({
    taskId,
    actorId: userId,
    action: 'attachment_added',
    metadata: { attachmentId: attachment.id, fileName: file.originalname },
  });

  return attachment;
}

module.exports = {
  createNewTask,
  getAllTasks,
  editTask,
  removeTask,
  getTaskDetails,
  addSubtask,
  editSubtask,
  removeSubtask,
  addComment,
  addAttachment,
};
