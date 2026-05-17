export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <p className="text-sm tracking-[0.3em] text-muted-foreground">Loading</p>
      </div>
    </div>
  );
}
