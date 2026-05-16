export default function FilterBar({
  teams,
  onTeamChange,
  onStatusChange,
  onOwnershipChange,
  ownership,
  assignees = [],
  assigneeFilter,
  onAssigneeFilterChange,
  isTeamAdmin,
  filters,
  onClearFilters,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Team filter */}
      <select
        value={filters.teamId || ''}
        onChange={(e) => onTeamChange(e.target.value)}
        className="rounded-full border border-transparent bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
      >
        <option value="">All Teams</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>

      {/* Ownership filter */}
      <select
        value={ownership}
        onChange={(e) => onOwnershipChange?.(e.target.value)}
        className="rounded-full border border-transparent bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
      >
        <option value="all">All Tasks</option>
        <option value="assigned">Assigned to Me</option>
        <option value="created">Created by Me</option>
      </select>

      {/* Status filter */}
      <select
        value={filters.status || ''}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-full border border-transparent bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
      >
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {isTeamAdmin && filters.teamId && (
        <select
          value={assigneeFilter || ''}
          onChange={(e) => onAssigneeFilterChange?.(e.target.value)}
          className="rounded-full border border-transparent bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          <option value="">All Assignees</option>
          {assignees.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      )}

      {/* Clear filters */}
      {(filters.teamId || filters.status || filters.assignedTo || filters.createdBy || assigneeFilter || ownership !== 'all') && (
        <button
          onClick={onClearFilters || (() => {
            onTeamChange('');
            onStatusChange('');
            onOwnershipChange?.('all');
            onAssigneeFilterChange?.('');
          })}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
