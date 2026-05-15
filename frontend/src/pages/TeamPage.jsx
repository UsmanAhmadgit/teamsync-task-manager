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
    <div className="min-h-screen bg-gray-950">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
            Team<span className="text-indigo-400">Sync</span>
          </Link>
          <Link
            to="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{team.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Created {new Date(team.created_at).toLocaleDateString()}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleDeleteTeam}
              className="px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/20 transition-colors cursor-pointer"
            >
              Delete Team
            </button>
          )}
        </div>

        {/* Add member form (admin only) */}
        {isAdmin && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Add Member</h2>
            <form onSubmit={handleAddMember} className="flex gap-3">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter member's email"
                required
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={addingMember}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {addingMember ? 'Adding...' : 'Add'}
              </button>
            </form>
          </div>
        )}

        {/* Members list */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Members ({team.members?.length || 0})
          </h2>

          {!team.members?.length ? (
            <EmptyState icon="👥" title="No members yet" message="Add team members by their email address." />
          ) : (
            <div className="space-y-3">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {member.name}
                        {member.id === user?.id && (
                          <span className="text-gray-500 ml-1">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      member.role === 'admin'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                    }`}>
                      {member.role}
                    </span>
                    {isAdmin && member.id !== team.created_by && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="text-xs text-red-400/70 hover:text-red-400 transition-colors cursor-pointer"
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
