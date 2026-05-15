import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTeams } from '../hooks/useTeams';
import { teamService } from '../services/teamService';
import LoadingSpinner from '../components/LoadingSpinner';
import TeamCard from '../components/TeamCard';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { teams, loading, refetch } = useTeams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);

  if (!user) return <LoadingSpinner />;

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setCreating(true);
    try {
      await teamService.create({ name: teamName });
      setTeamName('');
      setShowCreateForm(false);
      setToast({ message: 'Team created successfully', type: 'success' });
      refetch();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create team', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
        {/* Header with create button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Your Teams</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            {showCreateForm ? 'Cancel' : '+ New Team'}
          </button>
        </div>

        {/* Create team form */}
        {showCreateForm && (
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
                disabled={creating}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        )}

        {/* Teams grid */}
        {loading ? (
          <LoadingSpinner />
        ) : teams.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl">
            <EmptyState
              icon="🏢"
              title="No teams yet"
              message="Create your first team to start collaborating with your colleagues."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
