import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function DangerZoneModal({ type, onConfirm, onClose, confirmationText }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (input === confirmationText) {
      onConfirm();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const config = {
    delete_trips: {
      title: 'Delete All Trips',
      desc: 'This will permanently delete all your trips and itineraries. This action cannot be undone.',
      btn: 'Delete All Trips',
      placeholder: `Type DELETE to confirm`
    },
    delete_account: {
      title: 'Delete Account',
      desc: 'This will permanently delete your account and all associated data. You will lose access to all your trips.',
      btn: 'Permanently Delete Account',
      placeholder: `Type your email to confirm`
    }
  }[type];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl max-w-[440px] w-full p-8 animate-scale-in ${error ? 'animate-shake' : ''}`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6B6B7B] hover:text-[#1A1A2E]"><X size={20} /></button>
        
        <div className="w-16 h-16 rounded-2xl bg-[#E8593C]/10 flex items-center justify-center text-[#E8593C] mb-6">
          <AlertTriangle size={32} />
        </div>

        <h3 className="text-xl font-black text-[#1A1A2E] mb-2">{config.title}</h3>
        <p className="text-sm text-[#6B6B7B] leading-relaxed mb-6">{config.desc}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">Confirmation Required</label>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={config.placeholder}
              className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#E8593C] transition-all"
            />
          </div>

          <button 
            onClick={handleConfirm}
            className="w-full bg-[#E8593C] text-white font-black py-4 rounded-full shadow-lg shadow-[#E8593C]/20 hover:bg-[#c94d34] transition-all"
          >
            {config.btn}
          </button>
        </div>
      </div>
    </div>
  );
}
