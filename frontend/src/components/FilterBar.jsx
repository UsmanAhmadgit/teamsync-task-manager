import CustomSelect from './CustomSelect';

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
      <CustomSelect
        value={filters.teamId || ''}
        onChange={(val) => onTeamChange(val)}
        options={[
          { label: 'All Teams', value: '' },
          ...teams.map((team) => ({ label: team.name, value: team.id }))
        ]}
        className="rounded-full border border-transparent bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-white/5"
      />

      {/* Ownership filter */}
      <CustomSelect
        value={ownership}
        onChange={(val) => onOwnershipChange?.(val)}
        options={[
          { label: 'All Tasks', value: 'all' },
          { label: 'Assigned to Me', value: 'assigned' },
          { label: 'Created by Me', value: 'created' }
        ]}
        className="rounded-full border border-transparent bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-white/5"
      />

      {/* Status filter */}
      <CustomSelect
        value={filters.status || ''}
        onChange={(val) => onStatusChange(val)}
        options={[
          { label: 'All Statuses', value: '' },
          { label: 'To Do', value: 'todo' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Done', value: 'done' }
        ]}
        className="rounded-full border border-transparent bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-white/5"
      />

      {isTeamAdmin && filters.teamId && (
        <CustomSelect
          value={assigneeFilter || ''}
          onChange={(val) => onAssigneeFilterChange?.(val)}
          options={[
            { label: 'All Assignees', value: '' },
            ...assignees.map((member) => ({ label: member.name, value: member.id }))
          ]}
          className="rounded-full border border-transparent bg-card-glass px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-white/5"
        />
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
