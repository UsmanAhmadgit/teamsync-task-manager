export default function FilterBar({ teams, onTeamChange, onStatusChange, onAssigneeChange, filters }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Team filter */}
      <select
        value={filters.teamId || ''}
        onChange={(e) => onTeamChange(e.target.value)}
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
          className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
