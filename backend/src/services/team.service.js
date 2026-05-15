const createError = require('http-errors');
const { findUserByEmail } = require('../models/user.model');
const {
  createTeam,
  findTeamsByUserId,
  findTeamById,
  findTeamMembers,
  addTeamMember,
  removeTeamMember,
  findMembership,
  deleteTeam,
} = require('../models/team.model');

// Creates a team and auto-adds creator as admin
async function createTeamWithAdmin({ name, userId }) {
  const team = await createTeam({ name, userId });
  await addTeamMember({ teamId: team.id, userId, role: 'admin' });
  return team;
}

async function getTeamsForUser(userId) {
  return findTeamsByUserId(userId);
}

async function getTeamDetails({ teamId, userId }) {
  const team = await findTeamById(teamId);
  if (!team) throw createError(404, 'Team not found');

  const membership = await findMembership({ teamId, userId });
  if (!membership) throw createError(403, 'You are not a member of this team');

  const members = await findTeamMembers(teamId);
  return { ...team, members };
}

async function removeTeam({ teamId, userId }) {
  const team = await findTeamById(teamId);
  if (!team) throw createError(404, 'Team not found');
  if (team.created_by !== userId) {
    throw createError(403, 'Only the team creator can delete this team');
  }
  await deleteTeam(teamId);
}

async function addMemberByEmail({ teamId, email }) {
  const team = await findTeamById(teamId);
  if (!team) throw createError(404, 'Team not found');

  const user = await findUserByEmail(email);
  if (!user) throw createError(404, 'User with that email not found');

  const existing = await findMembership({ teamId, userId: user.id });
  if (existing) throw createError(409, 'User is already a member of this team');

  return addTeamMember({ teamId, userId: user.id, role: 'member' });
}

async function removeMember({ teamId, targetUserId }) {
  const team = await findTeamById(teamId);
  if (!team) throw createError(404, 'Team not found');

  if (team.created_by === parseInt(targetUserId)) {
    throw createError(403, 'Cannot remove the team creator');
  }

  const membership = await findMembership({ teamId, userId: targetUserId });
  if (!membership) throw createError(404, 'Member not found in this team');

  await removeTeamMember({ teamId, userId: targetUserId });
}

// Bonus: invite stub
function generateInviteLink({ teamId, clientUrl }) {
  const inviteToken = Math.random().toString(36).substring(2, 15);
  return {
    message: 'Invitation link generated',
    link: `${clientUrl}/invite/${inviteToken}`,
  };
}

module.exports = {
  createTeamWithAdmin,
  getTeamsForUser,
  getTeamDetails,
  removeTeam,
  addMemberByEmail,
  removeMember,
  generateInviteLink,
};
