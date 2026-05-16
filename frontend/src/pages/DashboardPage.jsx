import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTeams } from '../hooks/useTeams';
import { useTasks } from '../hooks/useTasks';
import { teamService } from '../services/teamService';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import TeamCard from '../components/TeamCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { teams, loading: teamsLoading, refetch: refetchTeams } = useTeams();

  // Filters
  const [filters, setFilters] = useState({ teamId: '', assignedTo: '', status: '' });
  const { tasks, loading: tasksLoading, refetch: refetchTasks } = useTasks(filters);

  // Team creation
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [creatingTeam, setCreatingTeam] = useState(false);

  // Task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [savingTask, setSavingTask] = useState(false);

  // View toggle
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'teams'

  const [toast, setToast] = useState(null);

  const teamCount = teams?.length ?? 0;
  const taskCount = tasks?.length ?? 0;

  if (!user) return <LoadingSpinner />;

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setCreatingTeam(true);
    try {
      await teamService.create({ name: teamName });
      setTeamName('');
      setShowCreateTeam(false);
      setToast({ message: 'Team created successfully', type: 'success' });
      refetchTeams();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create team', type: 'error' });
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleTaskSubmit = async (payload) => {
    setSavingTask(true);
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, payload);
        setToast({ message: 'Task updated', type: 'success' });
      } else {
        await taskService.create(payload);
        setToast({ message: 'Task created', type: 'success' });
      }
      setShowTaskModal(false);
      setEditingTask(null);
      refetchTasks();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to save task';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSavingTask(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskService.delete(taskId);
      setToast({ message: 'Task deleted', type: 'success' });
      refetchTasks();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete task', type: 'error' });
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-pattern" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        teams={teams}
        loading={savingTask}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden h-fit flex-col gap-6 rounded-3xl border border-border bg-card-glass p-6 shadow-card lg:flex">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
                <span className="font-display text-lg">T</span>
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">TeamSync</p>
                <p className="text-xs text-muted-foreground">Workspace</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
                  activeTab === 'tasks'
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Tasks</span>
                <span className="text-xs">{taskCount}</span>
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
                  activeTab === 'teams'
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Teams</span>
                <span className="text-xs">{teamCount}</span>
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Today</p>
              <p className="mt-3 text-sm text-foreground">Review priorities and ship the next milestone.</p>
              <p className="mt-4 text-xs text-muted-foreground">Stay aligned with real-time updates.</p>
            </div>
          </aside>

          <section className="flex flex-col gap-6">
            <header className="rounded-3xl border border-border bg-card-glass p-6 shadow-card">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">Workspace</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Welcome back,{' '}
                    <span className="font-display italic text-gradient">{user.name}</span>
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Focus on the work that moves your team forward today.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeTab === 'tasks' && (
                    <button
                      onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:shadow-glow"
                    >
                      + New Task
                    </button>
                  )}
                  {activeTab === 'teams' && (
                    <button
                      onClick={() => setShowCreateTeam(!showCreateTeam)}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:shadow-glow"
                    >
                      {showCreateTeam ? 'Cancel' : '+ New Team'}
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="rounded-full border border-border bg-surface px-5 py-2 text-sm text-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card-glass p-1">
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'tasks'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab('teams')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'teams'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Teams
                </button>
              </div>

              {activeTab === 'tasks' && (
                <div className="rounded-full border border-border bg-card-glass px-4 py-2 text-xs text-muted-foreground">
                  Keep tasks aligned with realtime context.
                </div>
              )}
            </div>

            {activeTab === 'tasks' && (
              <>
                <div>
                  <FilterBar
                    teams={teams}
                    filters={filters}
                    onTeamChange={(id) => setFilters((f) => ({ ...f, teamId: id }))}
                    onStatusChange={(s) => setFilters((f) => ({ ...f, status: s }))}
                    onAssigneeChange={(id) => setFilters((f) => ({ ...f, assignedTo: id }))}
                  />
                </div>

                {tasksLoading ? (
                  <LoadingSpinner />
                ) : tasks.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card-glass">
                    <EmptyState
                      icon="✅"
                      title="No tasks found"
                      message={filters.teamId || filters.status ? 'Try adjusting your filters.' : 'Create your first task to get started.'}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'teams' && (
              <>
                {showCreateTeam && (
                  <div className="rounded-2xl border border-border bg-card-glass p-6 shadow-card">
                    <form onSubmit={handleCreateTeam} className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter team name"
                        required
                        autoFocus
                        className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                      />
                      <button
                        type="submit"
                        disabled={creatingTeam}
                        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:shadow-glow disabled:opacity-60"
                      >
                        {creatingTeam ? 'Creating...' : 'Create'}
                      </button>
                    </form>
                  </div>
                )}

                {teamsLoading ? (
                  <LoadingSpinner />
                ) : teams.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card-glass">
                    <EmptyState
                      icon="🏢"
                      title="No teams yet"
                      message="Create your first team to start collaborating."
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {teams.map((team) => (
                      <TeamCard key={team.id} team={team} />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
