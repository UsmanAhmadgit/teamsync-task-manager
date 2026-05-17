import { AlertCircle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative mx-4 w-full max-w-sm rounded-3xl border border-border bg-card-glass p-6 shadow-card text-center animate-fade-up">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-elevated">
          <AlertCircle className={`h-6 w-6 ${isDestructive ? 'text-destructive' : 'text-primary'}`} />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition hover:border-primary/50"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition hover:shadow-glow ${
              isDestructive
                ? 'bg-destructive text-destructive-foreground border border-destructive/20'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
