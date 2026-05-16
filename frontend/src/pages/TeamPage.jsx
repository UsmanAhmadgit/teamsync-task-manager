import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTeams } from '../hooks/useTeams';
import { useTasks } from '../hooks/useTasks';
import { teamService } from '../services/teamService';
import { taskService } from '../services/taskService';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import KanbanBoard from '../components/KanbanBoard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { LayoutList, Users } from 'lucide-react';

export default function TeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { teams } = useTeams();
  const { tasks, loading: tasksLoading, refetch: refetchTasks } = useTasks({ teamId: id });

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('board');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editMode, setEditMode] = useState('full');
  const [savingTask, setSavingTask] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false });

  const isAdmin = team?.members?.some((m) => m.id === user?.id && m.role === 'admin');

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = () => {
    setLoading(true);
    teamService.getById(id)
      .then((res) => setTeam(res.data.data))
      .catch((err) => {
        setToast({ message: err.response?.data?.message || 'Failed to load team', type: 'error' });
        if (err.response?.status === 403 || err.response?.status === 404) {
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setAddingMember(true);
    try {
      await teamService.addMember(id, memberEmail);
      setMemberEmail('');
      setToast({ message: 'Member added successfully', type: 'success' });
      fetchTeam();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to add member', type: 'error' });
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = (memberId, memberName) => {
    setConfirmDelete({
      isOpen: true,
      type: 'member',
      id: memberId,
      title: 'Remove Member',
      message: `Are you sure you want to remove ${memberName} from the team?`
    });
  };

  const handleDeleteTeam = () => {
    setConfirmDelete({
      isOpen: true,
      type: 'team',
      title: 'Delete Team',
      message: 'Are you sure you want to delete this team? This cannot be undone.'
    });
  };

  const executeConfirmAction = async () => {
    try {
      if (confirmDelete.type === 'member') {
        await teamService.removeMember(id, confirmDelete.id);
        setToast({ message: 'Member removed', type: 'success' });
        fetchTeam();
      } else if (confirmDelete.type === 'team') {
        await teamService.delete(id);
        setToast({ message: 'Team deleted', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Operation failed', type: 'error' });
    }
  };

  const handleOpenTask = (task) => {
    setSelectedTaskId(task.id);
    setShowTaskDetail(true);
  };

  const getTaskPermissions = (task) => {
    const isCreator = task.created_by === user?.id;
    const isAssignee = task.assignees?.some((member) => member.id === user?.id);
    const canEdit = isAdmin || isCreator;
    const canStatusOnly = !canEdit && isAssignee && task.assigned_by_admin;
    return { canEdit, canStatusOnly };
  };

  const canMoveTask = (task) => {
    const { canEdit, canStatusOnly } = getTaskPermissions(task);
    return canEdit || canStatusOnly;
  };

  const handleMoveTask = async (taskId, status) => {
    const taskItem = tasks.find((task) => task.id === taskId);
    if (taskItem && !canMoveTask(taskItem)) {
      setToast({ message: 'You can only update status for admin-assigned tasks.', type: 'error' });
      return;
    }
    try {
      await taskService.update(taskId, { status });
      refetchTasks();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update status', type: 'error' });
    }
  };

  const handleTaskSubmit = async (payload) => {
    setSavingTask(true);
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, payload);
      } else {
        await taskService.create(payload);
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setEditMode('full');
      refetchTasks();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save task', type: 'error' });
    } finally {
      setSavingTask(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!team) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-pattern" />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false })}
        onConfirm={executeConfirmAction}
        title={confirmDelete.title}
        message={confirmDelete.message}
        confirmText={confirmDelete.type === 'team' ? 'Delete Team' : 'Remove'}
        isDestructive={true}
      />

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
          setEditMode('full');
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        teams={teams}
        loading={savingTask}
        defaultTeamId={id}
        editMode={editingTask ? editMode : 'full'}
      />

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={showTaskDetail}
        onClose={() => setShowTaskDetail(false)}
        onEdit={(taskItem) => {
          setShowTaskDetail(false);
          setEditingTask(taskItem);
          setEditMode('full');
          setShowTaskModal(true);
        }}
        onTaskUpdated={() => refetchTasks()}
        currentUser={user}
        teamRole={isAdmin ? 'admin' : 'member'}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <Sidebar
            teams={teams}
            activeSection="team"
            activeTeamId={parseInt(id, 10)}
            onSelectMyDashboard={() => navigate('/dashboard')}
            onSelectNotifications={() => navigate('/dashboard')}
            onSelectTeam={(teamItem) => navigate(`/teams/${teamItem.id}`)}
            user={user}
            onLogout={logout}
          />

          <section className="flex flex-col gap-6">
            <header className="rounded-3xl border border-border bg-card-glass p-6 shadow-card">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">Team</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    <span className="font-display italic text-gradient">{team.name}</span>
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">Created {new Date(team.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setEditMode('full');
                      setShowTaskModal(true);
                    }}
                    className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:shadow-glow"
                  >
                    + New Task
                  </button>
                  {isAdmin && (
                    <button
                      onClick={handleDeleteTeam}
                      className="rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive transition hover:bg-destructive/20"
                    >
                      Delete Team
                    </button>
                  )}
                </div>
              </div>
            </header>

            <div className="flex flex-wrap items-center gap-2 rounded-full border border-border bg-card-glass p-1">
              {['board', 'list', 'members', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'board' && (
              tasksLoading ? (
                <LoadingSpinner />
              ) : (
                <KanbanBoard
                  tasks={tasks}
                  onMoveTask={handleMoveTask}
                  onOpenTask={handleOpenTask}
                  canMoveTask={canMoveTask}
                />
              )
            )}

            {activeTab === 'list' && (
              tasksLoading ? (
                <LoadingSpinner />
              ) : tasks.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card-glass">
                  <EmptyState icon={<LayoutList className="h-8 w-8" />} title="No tasks" message="Create your first task for this team." />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tasks.map((task) => {
                    const { canEdit, canStatusOnly } = getTaskPermissions(task);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(taskItem, mode) => {
                          setEditingTask(taskItem);
                          setEditMode(mode);
                          setShowTaskModal(true);
                        }}
                        onDelete={async (taskId) => { await taskService.delete(taskId); refetchTasks(); }}
                        onOpen={handleOpenTask}
                        canDelete={isAdmin}
                        canEdit={canEdit}
                        statusOnly={canStatusOnly}
                      />
                    );
                  })}
                </div>
              )
            )}

            {activeTab === 'members' && (
              <div className="space-y-6">
                {isAdmin && (
                  <div className="rounded-2xl border border-border bg-card-glass p-6 shadow-card">
                    <h2 className="text-lg font-semibold">Add Member</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Invite someone by email and assign their role.</p>
                    <form onSubmit={handleAddMember} className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Enter member's email"
                        required
                        className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                      />
                      <button
                        type="submit"
                        disabled={addingMember}
                        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:shadow-glow disabled:opacity-60"
                      >
                        {addingMember ? 'Adding...' : 'Add'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="rounded-2xl border border-border bg-card-glass p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Members</h2>
                    <span className="text-xs text-muted-foreground">{team.members?.length || 0} total</span>
                  </div>

                  {!team.members?.length ? (
                    <EmptyState icon={<Users className="h-8 w-8" />} title="No members yet" message="Add team members by their email address." />
                  ) : (
                    <div className="mt-5 space-y-3">
                      {team.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-sm font-semibold text-primary">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {member.name}
                                {member.id === user?.id && (
                                  <span className="text-muted-foreground ml-1">(You)</span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                              member.role === 'admin'
                                ? 'bg-primary/15 text-primary border-primary/30'
                                : 'bg-surface-elevated text-muted-foreground border-border'
                            }`}>
                              {member.role}
                            </span>
                            {isAdmin && member.id !== team.created_by && (
                              <button
                                onClick={() => handleRemoveMember(member.id, member.name)}
                                className="text-xs text-destructive hover:text-destructive-foreground transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="rounded-2xl border border-border bg-card-glass p-6 shadow-card">
                <h2 className="text-lg font-semibold">Team Settings</h2>
                <p className="mt-2 text-sm text-muted-foreground">Additional team settings and integrations will appear here.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
