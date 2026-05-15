import api from './axiosInstance';

export const teamService = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  delete: (id) => api.delete(`/teams/${id}`),
  addMember: (teamId, email) => api.post(`/teams/${teamId}/members`, { email }),
  removeMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
};
