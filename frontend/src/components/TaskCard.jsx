import { formatDate, isOverdue } from '../utils/formatDate';

const priorityStyles = {
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const statusStyles = {
  todo: 'bg-gray-600/30 text-gray-300',
  in_progress: 'bg-blue-500/20 text-blue-300',
  done: 'bg-emerald-500/20 text-emerald-300',
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-200 group">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-white leading-snug truncate">
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-gray-500 hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        {overdue && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 border border-red-400/40 animate-pulse">
            Overdue
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {task.assigned_to_name ? `→ ${task.assigned_to_name}` : 'Unassigned'}
        </span>
        {task.due_date && (
          <span className={overdue ? 'text-red-400' : ''}>
            Due {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  );
}
