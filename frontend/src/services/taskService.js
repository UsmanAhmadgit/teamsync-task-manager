import api from './axiosInstance';

export const taskService = {
  getAll: (params = '') => api.get(`/tasks${params ? `?${params}` : ''}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};
