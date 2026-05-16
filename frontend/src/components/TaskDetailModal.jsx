import { useEffect, useMemo, useState } from 'react';
import { taskService } from '../services/taskService';

export default function TaskDetailModal({
  taskId,
  isOpen,
  onClose,
  onEdit,
  onTaskUpdated,
  currentUser,
  teamRoles,
  teamRole,
}) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [commentBody, setCommentBody] = useState('');

  const fetchTask = () => {
    if (!taskId) return;
    setLoading(true);
    taskService.getById(taskId)
      .then((res) => setTask(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchTask();
  }, [isOpen, taskId]);

  const attachmentsByComment = useMemo(() => {
    const map = new Map();
    if (!task?.attachments) return map;
    task.attachments.forEach((attachment) => {
      if (!attachment.comment_id) return;
      if (!map.has(attachment.comment_id)) map.set(attachment.comment_id, []);
      map.get(attachment.comment_id).push(attachment);
    });
    return map;
  }, [task]);

  const apiBase = import.meta.env.VITE_API_URL || '';

  const roleForTask = teamRoles && task ? teamRoles[task.team_id] : teamRole;
  const canEdit = currentUser && task && (roleForTask === 'admin' || task.created_by === currentUser.id);
  const canStatusOnly = !canEdit;

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    await taskService.addSubtask(taskId, { title: newSubtask.trim() });
    setNewSubtask('');
    fetchTask();
    onTaskUpdated?.();
  };

  const handleToggleSubtask = async (subtask) => {
    await taskService.updateSubtask(taskId, subtask.id, { is_done: !subtask.is_done });
    fetchTask();
    onTaskUpdated?.();
  };

  const handleDeleteSubtask = async (subtaskId) => {
    await taskService.deleteSubtask(taskId, subtaskId);
    fetchTask();
    onTaskUpdated?.();
  };

  const handleAddComment = async () => {
    if (!commentBody.trim()) return;
    await taskService.addComment(taskId, { body: commentBody.trim(), attachment_ids: [] });
    setCommentBody('');
    fetchTask();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-card-glass shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground transition hover:bg-surface hover:text-foreground"
        >
          ✕
        </button>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {loading || !task ? (
          <div className="text-sm text-muted-foreground">Loading task...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">Task</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">{task.title}</h2>
                  {task.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
                  )}
                </div>
                {(canEdit || canStatusOnly) && (
                  <button
                    onClick={() => { onClose(); onEdit?.(task, canStatusOnly ? 'status-only' : 'full'); }}
                    className="rounded-full border border-border bg-surface px-4 py-2 text-xs text-foreground transition hover:border-primary/50"
                  >
                    {canStatusOnly ? 'Update Status' : 'Edit Task'}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-muted-foreground">
                  Status: {task.status}
                </span>
                <span className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-muted-foreground">
                  Priority: {task.priority}
                </span>
                <span className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-muted-foreground">
                  Team #{task.team_id}
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Subtasks</h3>
                  <span className="text-xs text-muted-foreground">
                    {task.subtasks?.filter((s) => s.is_done).length || 0}/{task.subtasks?.length || 0}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {task.subtasks?.length ? task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center justify-between rounded-xl border border-border bg-card-glass px-3 py-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={subtask.is_done}
                          onChange={() => handleToggleSubtask(subtask)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span className={subtask.is_done ? 'line-through text-muted-foreground' : ''}>{subtask.title}</span>
                      </label>
                      <button
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground">No subtasks yet.</p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    value={newSubtask}
                    onChange={(event) => setNewSubtask(event.target.value)}
                    placeholder="Add a subtask"
                    className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={handleAddSubtask}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold">Comments</h3>
                <div className="mt-4 space-y-4">
                  {task.comments?.length ? task.comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-border bg-card-glass p-4">
                      <div className="text-xs text-muted-foreground">
                        {comment.author_name || 'Unknown'} · {new Date(comment.created_at).toLocaleString()}
                      </div>
                      <p className="mt-2 text-sm">{comment.body}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground">No comments yet.</p>
                  )}
                </div>

                <div className="mt-5 rounded-xl border border-border bg-card-glass p-4">
                  <textarea
                    value={commentBody}
                    onChange={(event) => setCommentBody(event.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleAddComment}
                        className="ml-auto rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        Post
                      </button>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 lg:pt-12">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold">Assignees</h3>
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {task.assignees?.length ? task.assignees.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-xl border border-border bg-card-glass px-3 py-2">
                      <span className="text-sm">{member.name}</span>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground">No assignees yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold">Activity</h3>
                <div className="mt-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {task.activity?.length ? task.activity.map((item) => (
                    <div key={item.id} className="text-xs text-muted-foreground">
                      <span className="text-foreground">{item.actor_name || 'Someone'}</span> {item.action.replace(/_/g, ' ')} · {new Date(item.created_at).toLocaleString()}
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground">No activity yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
