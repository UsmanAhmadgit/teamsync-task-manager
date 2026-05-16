export default function EmptyState({ icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface shadow-glow mb-4 text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}
