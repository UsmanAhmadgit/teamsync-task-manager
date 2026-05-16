import { useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    setVisible(false);
    if (onClose) onClose();
  }, 3000);

  const bgColor = type === 'error'
    ? 'bg-destructive/80 text-destructive-foreground'
    : type === 'warning'
      ? 'bg-violet/70 text-foreground'
      : 'bg-primary/80 text-primary-foreground';

  return (
    <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-full text-sm font-medium shadow-card backdrop-blur-sm border border-border ${bgColor} animate-[slideIn_0.3s_ease-out]`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={() => { setVisible(false); if (onClose) onClose(); }}
          className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
