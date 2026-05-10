import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const categories = ['sightseeing', 'food', 'transport', 'hotel', 'adventure', 'shopping'];

export default function AddActivityForm({ dayDate, onAdd, onCancel, loading }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('sightseeing');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setError('Activity name is required'); return; }
    onAdd({
      day_date: dayDate,
      name: name.trim(),
      category,
      start_time: startTime,
      duration_hours: duration ? Number(duration) : null,
      estimated_cost: cost ? Number(cost) : null,
      notes: notes.trim(),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#1D9E75]/30 p-4 space-y-3 animate-fade-in">
      <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] placeholder-[#6B6B7B]/60 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all" placeholder="Activity name" />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all capitalize">
        {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
      </select>
      <div className="flex gap-2">
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="flex-1 bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all" />
        <div className="flex-1 flex items-center gap-1 bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-3 py-2.5">
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-transparent text-sm text-[#1A1A2E] focus:outline-none" placeholder="Duration" min="0" step="0.5" />
          <span className="text-xs text-[#6B6B7B] font-medium flex-shrink-0">hrs</span>
        </div>
      </div>
      <div className="flex items-center gap-1 bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-3 py-2.5">
        <span className="text-sm text-[#6B6B7B] font-medium">₹</span>
        <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full bg-transparent text-sm text-[#1A1A2E] focus:outline-none" placeholder="Estimated cost" min="0" />
      </div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] placeholder-[#6B6B7B]/60 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all resize-none" rows="2" placeholder="Notes (optional)" />
      {error && <p className="text-xs text-[#E8593C] font-semibold">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 disabled:opacity-70">
          {loading ? <Loader2 size={14} className="animate-spin" /> : null} Save Activity
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-semibold text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors">Cancel</button>
      </div>
    </div>
  );
}
