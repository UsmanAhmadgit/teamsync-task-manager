import api from './axiosInstance';

export const taskService = {
  getAll: (params = '') => api.get(`/tasks${params ? `?${params}` : ''}`),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  addSubtask: (taskId, data) => api.post(`/tasks/${taskId}/subtasks`, data),
  updateSubtask: (taskId, subtaskId, data) => api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, data),
  deleteSubtask: (taskId, subtaskId) => api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`),
  addComment: (taskId, data) => api.post(`/tasks/${taskId}/comments`, data),
  uploadAttachment: (taskId, file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/tasks/${taskId}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
