import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-[#1D9E75]' : 'bg-[#E8593C]';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <div
        className={`${bgColor} text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm transition-all duration-300 ${
          visible && !exiting
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        }`}
      >
        <Icon size={20} className="flex-shrink-0" />
        <p className="text-sm font-semibold flex-1">{message}</p>
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(() => onClose?.(), 300);
          }}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
