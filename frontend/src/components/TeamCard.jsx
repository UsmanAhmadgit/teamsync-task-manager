import { Link } from 'react-router-dom';

export default function TeamCard({ team }) {
  const isAdmin = team.role === 'admin';

  return (
    <Link
      to={`/teams/${team.id}`}
      className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
          {team.name}
        </h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${
          isAdmin
            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
        }`}>
          {isAdmin ? 'Admin' : 'Member'}
        </span>
      </div>
      <p className="text-xs text-gray-500">
        Created {new Date(team.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
}
