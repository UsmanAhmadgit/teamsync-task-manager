import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTeams } from '../hooks/useTeams';
import { useTasks } from '../hooks/useTasks';
import { teamService } from '../services/teamService';
import { taskService } from '../services/taskService';
import { notificationService } from '../services/notificationService';
import AccountSettingsModal from '../components/AccountSettingsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import TeamCard from '../components/TeamCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import { LayoutList, FolderOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { teams, loading: teamsLoading, refetch: refetchTeams } = useTeams();
  const navigate = useNavigate();
  const location = useLocation();

  // Filters
  const [filters, setFilters] = useState({ teamId: '', assignedTo: '', createdBy: '', status: '' });
  const [ownership, setOwnership] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(location.state?.section || 'my');
  const { tasks, loading: tasksLoading, refetch: refetchTasks } = useTasks(filters);

  // Team creation
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [creatingTeam, setCreatingTeam] = useState(false);

  // Task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editMode, setEditMode] = useState('full');
  const [savingTask, setSavingTask] = useState(false);
  const [modalError, setModalError] = useState('');
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // View toggle
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'tasks');

  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const teamRoles = teams.reduce((acc, team) => {
    acc[team.id] = team.role;
    return acc;
  }, {});

  const selectedTeamRole = filters.teamId ? teamRoles[filters.teamId] : null;
  const isTeamAdmin = selectedTeamRole === 'admin';

  const applyOwnership = (next) => {
    setOwnership(next);
    setAssigneeFilter('');
    if (!user) return;
    if (next === 'assigned') {
      setFilters((prev) => ({ ...prev, assignedTo: user.id, createdBy: '' }));
      return;
    }
    if (next === 'created') {
      setFilters((prev) => ({ ...prev, createdBy: user.id, assignedTo: '' }));
      return;
    }
    setFilters((prev) => ({ ...prev, assignedTo: '', createdBy: '' }));
  };

  const handleAssigneeFilterChange = (value) => {
    if (!value) {
      setAssigneeFilter('');
      applyOwnership(ownership);
      return;
    }
    setAssigneeFilter(value);
    setOwnership('all');
    setFilters((prev) => ({ ...prev, assignedTo: value, createdBy: '' }));
  };

  const handleClearFilters = () => {
    setFilters({ teamId: '', assignedTo: '', createdBy: '', status: '' });
    setOwnership('all');
    setAssigneeFilter('');
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeSection]);

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data.data);
    } catch (err) {
      setToast({ message: 'Failed to load notifications', type: 'error' });
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      setToast({ message: 'Failed to mark as read', type: 'error' });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      setToast({ message: 'Failed to mark all as read', type: 'error' });
    }
  };

  useEffect(() => {
    if (!filters.teamId || !isTeamAdmin) {
      setTeamMembers([]);
      setAssigneeFilter('');
      return;
    }

    setMembersLoading(true);
    teamService.getById(filters.teamId)
      .then((res) => setTeamMembers(res.data.data?.members || []))
      .catch(() => setTeamMembers([]))
      .finally(() => setMembersLoading(false));
  }, [filters.teamId, isTeamAdmin]);

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
      setEditMode('full');
      refetchTasks();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to save task';
      setModalError(msg);
    } finally {
      setSavingTask(false);
    }
  };

  const handleEditTask = (task, mode = 'full') => {
    setEditingTask(task);
    setEditMode(mode);
    setModalError('');
    setShowTaskModal(true);
  };

  const handleOpenTask = (task) => {
    setSelectedTaskId(task.id);
    setShowTaskDetail(true);
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
  };

  const executeDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.delete(taskToDelete);
      setToast({ message: 'Task deleted', type: 'success' });
      refetchTasks();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete task', type: 'error' });
    } finally {
      setTaskToDelete(null);
    }
  };

  const getTaskPermissions = (task) => {
    const isAdmin = teamRoles[task.team_id] === 'admin';
    const isCreator = task.created_by === user.id;
    const isAssignee = task.assignees?.some((member) => member.id === user.id);
    const canEdit = isAdmin || isCreator;
    const canStatusOnly = !canEdit && isAssignee && task.assigned_by_admin;
    return { canEdit, canStatusOnly, canDelete: isAdmin || isCreator };
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-pattern" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={executeDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
          setEditMode('full');
          setModalError('');
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        teams={teams}
        loading={savingTask}
        editMode={editingTask ? editMode : 'full'}
        error={modalError}
      />

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={showTaskDetail}
        onClose={() => setShowTaskDetail(false)}
        onEdit={(task, mode) => {
          setShowTaskDetail(false);
          handleEditTask(task, mode);
        }}
        onTaskUpdated={() => refetchTasks()}
        currentUser={user}
        teamRoles={teamRoles}
      />

      <AccountSettingsModal
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
        user={user}
        onUpdate={(updatedUser) => {
          // Update user in context or just let it be (if it doesn't auto-update, we might need a context method)
          // For now, at least it saves in DB.
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <Sidebar
            teams={teams}
            activeSection={activeSection}
            activeTeamId={null}
            hasUnreadNotifications={notifications.some(n => !n.is_read)}
            onSelectMyDashboard={() => {
              setActiveSection('my');
              setActiveTab('tasks');
              applyOwnership('all');
            }}
            onSelectNotifications={() => {
              setActiveSection('notifications');
              setAssigneeFilter('');
              setOwnership('all');
              setFilters((prev) => ({ ...prev, assignedTo: '', createdBy: '' }));
            }}
            onSelectAccountSettings={() => setShowAccountSettings(true)}
            onSelectTeam={(team) => navigate(`/teams/${team.id}`)}
            user={user}
            onLogout={logout}
          />

          <section className="flex flex-col gap-6">
            <header className="rounded-3xl border border-border bg-card-glass p-6 shadow-card">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">Workspace</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Welcome back,{' '}
                    <span className="font-display italic text-gradient">{user.name}</span>
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">Focus on the work that moves your team forward today.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeSection !== 'notifications' && activeTab === 'tasks' && (
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setEditMode('full');
                        setModalError('');
                        setShowTaskModal(true);
                      }}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:shadow-glow cursor-pointer"
                    >
                      + New Task
                    </button>
                  )}
                  {activeSection !== 'notifications' && activeTab === 'teams' && (
                    <button
                      onClick={() => setShowCreateTeam(!showCreateTeam)}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:shadow-glow cursor-pointer"
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

            {activeSection !== 'notifications' && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card-glass p-1">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      activeTab === 'tasks'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('teams')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
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
            )}

            {activeSection === 'notifications' ? (
              <div className="rounded-2xl border border-border bg-card-glass p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary hover:text-primary/80 transition cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
                {notificationsLoading ? (
                  <LoadingSpinner />
                ) : notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No notifications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-center justify-between rounded-xl border p-4 transition ${
                          n.is_read
                            ? 'border-border bg-surface/50 opacity-75'
                            : 'border-primary/30 bg-surface shadow-glow'
                        }`}
                      >
                        <div>
                          <p className={`text-sm ${n.is_read ? 'text-foreground' : 'font-semibold text-foreground'}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                          <p className="text-xs text-muted-foreground/50 mt-1">
                            {new Date(n.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!n.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(n.id)}
                            className="text-xs text-primary hover:text-primary/80 transition cursor-pointer"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'tasks' && (
              <>
                <div>
                  <FilterBar
                    teams={teams}
                    filters={filters}
                    onTeamChange={(id) => {
                      setFilters((f) => ({ ...f, teamId: id }));
                      setAssigneeFilter('');
                    }}
                    onStatusChange={(s) => setFilters((f) => ({ ...f, status: s }))}
                    onOwnershipChange={applyOwnership}
                    ownership={ownership}
                    assignees={membersLoading ? [] : teamMembers}
                    assigneeFilter={assigneeFilter}
                    onAssigneeFilterChange={handleAssigneeFilterChange}
                    isTeamAdmin={isTeamAdmin}
                    onClearFilters={handleClearFilters}
                  />
                </div>

                {tasksLoading ? (
                  <LoadingSpinner />
                ) : tasks.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card-glass">
                    <EmptyState
                      icon={<LayoutList className="h-8 w-8" />}
                      title="No tasks found"
                      message={filters.teamId || filters.status ? 'Try adjusting your filters.' : 'Create your first task to get started.'}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...tasks].sort((a, b) => {
                      if (!a.due_date && !b.due_date) return 0;
                      if (!a.due_date) return 1;
                      if (!b.due_date) return -1;
                      return new Date(a.due_date) - new Date(b.due_date);
                    }).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(taskItem, mode) => handleEditTask(taskItem, mode)}
                        onDelete={handleDeleteTask}
                        onOpen={handleOpenTask}
                        canEdit={getTaskPermissions(task).canEdit}
                        statusOnly={getTaskPermissions(task).canStatusOnly}
                        canDelete={getTaskPermissions(task).canDelete}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection !== 'notifications' && activeTab === 'teams' && (
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
                      icon={<FolderOpen className="h-8 w-8" />}
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
