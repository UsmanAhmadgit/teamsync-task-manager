export default function FilterBar({ teams, onTeamChange, onStatusChange, onAssigneeChange, filters }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Team filter */}
      <select
        value={filters.teamId || ''}
        onChange={(e) => onTeamChange(e.target.value)}
        className="rounded-full border border-border bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 cursor-pointer"
      >
        <option value="">All Teams</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={filters.status || ''}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-full border border-border bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 cursor-pointer"
      >
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* Clear filters */}
      {(filters.teamId || filters.status || filters.assignedTo) && (
        <button
          onClick={() => {
            onTeamChange('');
            onStatusChange('');
            if (onAssigneeChange) onAssigneeChange('');
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
