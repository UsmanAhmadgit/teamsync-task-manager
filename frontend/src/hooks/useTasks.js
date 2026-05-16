import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.teamId) params.set('teamId', filters.teamId);
    if (filters.assignedTo) params.set('assignedTo', filters.assignedTo);
    if (filters.createdBy) params.set('createdBy', filters.createdBy);
    if (filters.status) params.set('status', filters.status);

    taskService.getAll(params.toString())
      .then((res) => setTasks(res.data.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [filters.teamId, filters.assignedTo, filters.createdBy, filters.status]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, setTasks, refetch: fetchTasks };
}
