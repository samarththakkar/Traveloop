import { ChevronDown } from 'lucide-react';

const TYPES = [
  { id: 'trip', label: 'Trip Note', bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]' },
  { id: 'day', label: 'Day Note', bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]' },
  { id: 'reminder', label: 'Reminder', bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' },
  { id: 'idea', label: 'Idea', bg: 'bg-[#EDE9FE]', text: 'text-[#7C3AED]' }
];

export default function NoteTypeSelector({ value, onChange, isOpen, setIsOpen }) {
  const current = TYPES.find(t => t.id === value) || TYPES[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${current.bg} ${current.text}`}
      >
        {current.label} <ChevronDown size={10} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-[#E8E0D5] rounded-xl shadow-xl py-1 min-w-[120px] animate-slide-down">
          {TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => { onChange(t.id); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#6B6B7B] hover:bg-[#FDF8F3] hover:text-[#1D9E75] transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
