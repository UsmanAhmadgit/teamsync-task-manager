import { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';

export default function TaskModal({ isOpen, onClose, onSubmit, task, teams, loading, defaultTeamId, editMode = 'full' }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    team_id: '',
    assigned_to: [],
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const isEditing = !!task;
  const isStatusOnly = isEditing && editMode === 'status-only';

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        team_id: task.team_id || '',
        assigned_to: task.assignees?.map((assignee) => assignee.id) || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        team_id: defaultTeamId || teams?.[0]?.id || '',
        assigned_to: [],
      });
    }
  }, [task, teams, defaultTeamId]);

  useEffect(() => {
    if (!formData.team_id) {
      setTeamMembers([]);
      return;
    }

    setMembersLoading(true);
    teamService.getById(formData.team_id)
      .then((res) => setTeamMembers(res.data.data?.members || []))
      .catch(() => setTeamMembers([]))
      .finally(() => setMembersLoading(false));
  }, [formData.team_id]);

  useEffect(() => {
    if (!teamMembers.length) return;
    const allowedIds = new Set(teamMembers.map((member) => member.id));
    setFormData((prev) => ({
      ...prev,
      assigned_to: prev.assigned_to.filter((id) => allowedIds.has(id)),
    }));
  }, [teamMembers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAssignee = (userId) => {
    if (isStatusOnly) return;
    setFormData((prev) => {
      const exists = prev.assigned_to.includes(userId);
      return {
        ...prev,
        assigned_to: exists
          ? prev.assigned_to.filter((id) => id !== userId)
          : [...prev.assigned_to, userId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isStatusOnly) {
      onSubmit({ status: formData.status });
      return;
    }
    // Build payload — only include non-empty fields for updates
    const payload = { ...formData };
    if (!payload.due_date) delete payload.due_date;
    if (!payload.assigned_to) payload.assigned_to = [];
    if (!payload.description) delete payload.description;
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl border border-border bg-card-glass p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isStatusOnly && (
            <div className="rounded-xl border border-border bg-surface px-4 py-2 text-xs text-muted-foreground">
              You can only update the task status.
            </div>
          )}
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Title *
            </label>
            <input
              id="task-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isStatusOnly}
              placeholder="What needs to be done?"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-description" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isStatusOnly}
              rows={3}
              placeholder="Add details (optional)"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none"
            />
          </div>

          {/* Team (only when creating) */}
          {!isEditing && (
            <div>
              <label htmlFor="task-team" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Team *
              </label>
              <select
                id="task-team"
                name="team_id"
                value={formData.team_id}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 cursor-pointer"
              >
                <option value="">Select a team</option>
                {teams?.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Assignees
            </label>
            <div className="mt-2 rounded-xl border border-border bg-surface px-3 py-2.5">
              {membersLoading ? (
                <p className="text-xs text-muted-foreground">Loading team members...</p>
              ) : teamMembers.length === 0 ? (
                <p className="text-xs text-muted-foreground">Select a team to see members.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {teamMembers.map((member) => {
                    const selected = formData.assigned_to.includes(member.id);
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => toggleAssignee(member.id)}
                        disabled={isStatusOnly}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          selected
                            ? 'border-primary/40 bg-primary/15 text-primary'
                            : 'border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {member.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-priority" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isStatusOnly}
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label htmlFor="task-due-date" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Due Date
            </label>
              <input
                id="task-due-date"
                type="date"
                name="due_date"
                value={formData.due_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                disabled={isStatusOnly}
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
              />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
