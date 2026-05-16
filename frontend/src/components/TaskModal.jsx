import { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';
import CustomSelect from './CustomSelect';

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

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card-glass shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground transition hover:bg-surface hover:text-foreground text-xl"
        >
          ✕
        </button>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Task' : 'Create Task'}
            </h2>
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
                <CustomSelect
                  value={formData.team_id}
                  onChange={(val) => handleChange({ target: { name: 'team_id', value: val } })}
                  options={[
                    { label: 'Select a team', value: '' },
                    ...(teams?.map(t => ({ label: t.name, value: t.id })) || [])
                  ]}
                  className="mt-2 w-full rounded-xl border border-transparent bg-surface px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-white/5"
                />
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
                          className={`rounded-full border px-3 py-1 text-xs transition ${selected
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
                <CustomSelect
                  value={formData.status}
                  onChange={(val) => handleChange({ target: { name: 'status', value: val } })}
                  options={[
                    { label: 'To Do', value: 'todo' },
                    { label: 'In Progress', value: 'in_progress' },
                    { label: 'Done', value: 'done' }
                  ]}
                  className="mt-2 w-full rounded-xl border border-transparent bg-surface px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-white/5"
                />
              </div>
              <div>
                <label htmlFor="task-priority" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Priority
                </label>
                <CustomSelect
                  value={formData.priority}
                  onChange={(val) => handleChange({ target: { name: 'priority', value: val } })}
                  disabled={isStatusOnly}
                  options={[
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' }
                  ]}
                  className="mt-2 w-full rounded-xl border border-transparent bg-surface px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-white/5"
                />
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
    </div>
  );
}
