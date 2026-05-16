import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { teamService } from '../services/teamService';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function TeamPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [toast, setToast] = useState(null);

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

  const handleRemoveMember = async (memberId, memberName) => {
    if (!confirm(`Remove ${memberName} from the team?`)) return;
    try {
      await teamService.removeMember(id, memberId);
      setToast({ message: 'Member removed', type: 'success' });
      fetchTeam();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to remove member', type: 'error' });
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? This cannot be undone.')) return;
    try {
      await teamService.delete(id);
      setToast({ message: 'Team deleted', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete team', type: 'error' });
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!team) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-pattern" />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <nav className="sticky top-0 z-40 border-b border-border bg-card-glass backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
              <span className="font-display text-lg">T</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">TeamSync</p>
              <p className="text-xs text-muted-foreground">Team workspace</p>
            </div>
          </Link>
          <Link
            to="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Team</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="font-display italic text-gradient">{team.name}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Created {new Date(team.created_at).toLocaleDateString()}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleDeleteTeam}
              className="rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive transition hover:bg-destructive/20"
            >
              Delete Team
            </button>
          )}
        </header>

        {isAdmin && (
          <div className="mt-8 rounded-2xl border border-border bg-card-glass p-6 shadow-card">
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

        <div className="mt-8 rounded-2xl border border-border bg-card-glass p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Members</h2>
            <span className="text-xs text-muted-foreground">{team.members?.length || 0} total</span>
          </div>

          {!team.members?.length ? (
            <EmptyState icon="👥" title="No members yet" message="Add team members by their email address." />
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
      </main>
    </div>
  );
}
