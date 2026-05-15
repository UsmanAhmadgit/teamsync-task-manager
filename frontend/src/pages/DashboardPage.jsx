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
    <div className="min-h-screen bg-gray-950">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        teams={teams}
        loading={savingTask}
      />

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Team<span className="text-indigo-400">Sync</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">
              Welcome, <span className="text-white font-medium">{user.name}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab switcher + action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'teams'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Teams
            </button>
          </div>

          <div className="flex gap-3">
            {activeTab === 'tasks' && (
              <button
                onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                + New Task
              </button>
            )}
            {activeTab === 'teams' && (
              <button
                onClick={() => setShowCreateTeam(!showCreateTeam)}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                {showCreateTeam ? 'Cancel' : '+ New Team'}
              </button>
            )}
          </div>
        </div>

        {/* ===== TASKS TAB ===== */}
        {activeTab === 'tasks' && (
          <>
            {/* Filter bar */}
            <div className="mb-6">
              <FilterBar
                teams={teams}
                filters={filters}
                onTeamChange={(id) => setFilters((f) => ({ ...f, teamId: id }))}
                onStatusChange={(s) => setFilters((f) => ({ ...f, status: s }))}
                onAssigneeChange={(id) => setFilters((f) => ({ ...f, assignedTo: id }))}
              />
            </div>

            {/* Task grid */}
            {tasksLoading ? (
              <LoadingSpinner />
            ) : tasks.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl">
                <EmptyState
                  icon="✅"
                  title="No tasks found"
                  message={filters.teamId || filters.status ? 'Try adjusting your filters.' : 'Create your first task to get started.'}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* ===== TEAMS TAB ===== */}
        {activeTab === 'teams' && (
          <>
            {/* Create team form */}
            {showCreateTeam && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <form onSubmit={handleCreateTeam} className="flex gap-3">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    required
                    autoFocus
                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={creatingTeam}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    {creatingTeam ? 'Creating...' : 'Create'}
                  </button>
                </form>
              </div>
            )}

            {/* Teams grid */}
            {teamsLoading ? (
              <LoadingSpinner />
            ) : teams.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl">
                <EmptyState
                  icon="🏢"
                  title="No teams yet"
                  message="Create your first team to start collaborating."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
