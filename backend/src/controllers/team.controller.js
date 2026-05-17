const teamService = require('../services/team.service');

// POST /teams
async function create(req, res) {
  const team = await teamService.createTeamWithAdmin({
    name: req.body.name,
    userId: req.user.id,
  });
  res.status(201).json({ success: true, data: team });
}

// GET /teams
async function getAll(req, res) {
  const teams = await teamService.getTeamsForUser(req.user.id);
  res.status(200).json({ success: true, data: teams });
}

// GET /teams/:id
async function getById(req, res) {
  const team = await teamService.getTeamDetails({
    teamId: req.params.id,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, data: team });
}

// DELETE /teams/:id
async function remove(req, res) {
  await teamService.removeTeam({
    teamId: req.params.id,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, message: 'Team deleted' });
}

// POST /teams/:id/members
async function addMember(req, res) {
  const member = await teamService.addMemberByEmail({
    teamId: req.params.id,
    email: req.body.email,
  });
  res.status(200).json({ success: true, data: member });
}

// DELETE /teams/:id/members/:userId
async function removeMember(req, res) {
  await teamService.removeMember({
    teamId: req.params.id,
    targetUserId: req.params.userId,
  });
  res.status(200).json({ success: true, message: 'Member removed' });
}

// POST /teams/:id/invite (bonus stub)
async function invite(req, res) {
  const result = teamService.generateInviteLink({
    teamId: req.params.id,
    clientUrl: process.env.CLIENT_URL,
  });
  res.status(200).json({ success: true, ...result });
}

module.exports = { create, getAll, getById, remove, addMember, removeMember, invite };
