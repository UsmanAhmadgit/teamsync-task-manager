import { formatDate, isOverdue } from '../utils/formatDate';

const priorityStyles = {
  high: 'bg-destructive/20 text-destructive border border-destructive/30',
  medium: 'bg-violet/15 text-violet border border-violet/30',
  low: 'bg-lime/15 text-lime border border-lime/30',
};

const statusStyles = {
  todo: 'bg-muted/50 text-muted-foreground border border-border',
  in_progress: 'bg-primary/15 text-primary border border-primary/30',
  done: 'bg-glow/15 text-glow border border-glow/30',
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className="rounded-2xl border border-border bg-card-glass p-5 shadow-card transition-all duration-200 group hover:border-primary/40">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-foreground leading-snug truncate">
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        {overdue && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/20 text-destructive border border-destructive/30 animate-pulse">
            Overdue
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {task.assigned_to_name ? `→ ${task.assigned_to_name}` : 'Unassigned'}
        </span>
        {task.due_date && (
          <span className={overdue ? 'text-destructive' : ''}>
            Due {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  );
}
