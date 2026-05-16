export default function EmptyState({ icon = '📋', title, message }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}
