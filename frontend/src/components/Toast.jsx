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
    ? 'bg-red-500/90'
    : type === 'warning'
      ? 'bg-yellow-500/90'
      : 'bg-emerald-500/90';

  return (
    <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-white text-sm font-medium shadow-2xl backdrop-blur-sm ${bgColor} animate-[slideIn_0.3s_ease-out]`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={() => { setVisible(false); if (onClose) onClose(); }}
          className="text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
