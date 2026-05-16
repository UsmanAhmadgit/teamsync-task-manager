import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Sidebar({
  teams,
  activeSection,
  activeTeamId,
  onSelectMyDashboard,
  onSelectNotifications,
  onSelectTeam,
  onSelectAccountSettings,
  hasUnreadNotifications,
  user,
  onLogout,
}) {
  return (
    <aside className="hidden h-fit flex-col gap-6 rounded-3xl border border-border bg-card-glass p-6 shadow-card lg:flex">
      <Link to="/dashboard" reloadDocument className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">TeamSync</p>
          <p className="text-xs text-muted-foreground">Workspace</p>
        </div>
      </Link>

      <div className="space-y-2 text-sm">
        <button
          onClick={onSelectMyDashboard}
          className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
            activeSection === 'my'
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>My Dashboard</span>
        </button>
        <button
          onClick={onSelectNotifications}
          className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition cursor-pointer ${
            activeSection === 'notifications'
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>Notifications</span>
            {hasUnreadNotifications && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
            )}
          </div>
        </button>
      </div>

      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground shrink-0">Teams</p>
        <div className="mt-3 max-h-[260px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team)}
              className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm transition ${
                activeSection === 'team' && activeTeamId === team.id
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <span># {team.name}</span>
              <span className="text-xs">{team.role}</span>
            </button>
          ))}
          {!teams.length && (
            <p className="text-xs text-muted-foreground">No teams yet.</p>
          )}
        </div>
      </div>

      <div className="mt-auto rounded-2xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</p>
        <p className="mt-2 text-sm text-foreground">{user?.name || 'User'}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onSelectAccountSettings}
            className="flex-1 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground cursor-pointer"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground transition hover:text-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
