import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Team<span className="text-indigo-400">Sync</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
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

      {/* Content — placeholder until teams/tasks feature */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Dashboard</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400">Teams and tasks will appear here.</p>
        </div>
      </main>
    </div>
  );
}
