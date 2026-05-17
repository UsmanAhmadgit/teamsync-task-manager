import { Link } from 'react-router-dom';

export default function TeamCard({ team }) {
  const isAdmin = team.role === 'admin';

  return (
    <Link
      to={`/teams/${team.id}`}
      className="block rounded-2xl border border-border bg-card-glass p-5 shadow-card transition-all duration-200 group hover:border-primary/40"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {team.name}
        </h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${
          isAdmin
            ? 'bg-primary/15 text-primary border border-primary/30'
            : 'bg-surface-elevated text-muted-foreground border border-border'
        }`}>
          {isAdmin ? 'Admin' : 'Member'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Created {new Date(team.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
}
