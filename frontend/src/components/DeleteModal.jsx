import { useState } from 'react';
import { Trash2, Loader2, X } from 'lucide-react';

export default function DeleteModal({ tripName, onCancel, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-[400px] w-full p-8 animate-fade-in">
        <button onClick={onCancel} className="absolute top-4 right-4 text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#E8593C]/10 flex items-center justify-center mb-5">
            <Trash2 size={24} className="text-[#E8593C]" />
          </div>
          <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Delete this trip?</h3>
          <p className="text-sm text-[#6B6B7B] leading-relaxed mb-6">
            This will permanently delete <span className="font-semibold text-[#1A1A2E]">'{tripName}'</span> and all its itinerary data. This cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} disabled={loading} className="flex-1 px-5 py-3 rounded-full border-2 border-[#E8E0D5] text-[#6B6B7B] font-bold text-sm hover:bg-[#F5EFE6] transition-all disabled:opacity-50">Cancel</button>
            <button onClick={handleDelete} disabled={loading} className="flex-1 px-5 py-3 rounded-full bg-[#E8593C] hover:bg-[#c44329] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
