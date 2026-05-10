import { Trash2, Clock } from 'lucide-react';

const catStyles = {
  sightseeing: { bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]' },
  food: { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' },
  transport: { bg: 'bg-[#F3F4F6]', text: 'text-[#6B7280]' },
  hotel: { bg: 'bg-[#EDE9FE]', text: 'text-[#7C3AED]' },
  adventure: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]' },
  shopping: { bg: 'bg-[#FCE7F3]', text: 'text-[#DB2777]' },
};

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  return `${hr % 12 || 12}:${m} ${ampm}`;
}

export default function ActivityCard({ activity, onUpdate, onDelete }) {
  const cat = catStyles[activity.category] || catStyles.sightseeing;

  const handleField = (field, value) => {
    onUpdate({ ...activity, [field]: value });
  };

  return (
    <div className="flex gap-3 group">
      {/* Time column */}
      <div className="w-20 flex-shrink-0 pt-1 text-right">
        <input
          type="time"
          value={activity.start_time || ''}
          onChange={(e) => handleField('start_time', e.target.value)}
          className="w-full text-right bg-transparent text-xs font-bold text-[#1D9E75] focus:outline-none cursor-pointer"
        />
        <p className="text-[10px] text-[#6B6B7B] font-medium mt-0.5">{fmt12(activity.start_time)}</p>
      </div>

      {/* Timeline dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#1D9E75] border-2 border-white shadow-sm mt-2" />
        <div className="w-0.5 flex-1 bg-[#E8E0D5] mt-1" />
      </div>

      {/* Activity card */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#F5EFE6] p-4 mb-4 hover:shadow-md transition-all duration-200 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={activity.name || ''}
              onChange={(e) => handleField('name', e.target.value)}
              className="w-full font-bold text-[15px] text-[#1A1A2E] bg-transparent border-none focus:outline-none truncate"
              placeholder="Activity name"
            />
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize mt-1 ${cat.bg} ${cat.text}`}>{activity.category || 'sightseeing'}</span>
          </div>
          <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:text-[#E8593C] hover:bg-[#E8593C]/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"><Trash2 size={14} /></button>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#6B6B7B]">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <input type="number" value={activity.duration_hours || ''} onChange={(e) => handleField('duration_hours', e.target.value)} className="w-8 bg-transparent text-center font-semibold focus:outline-none" placeholder="0" min="0" step="0.5" />
            <span className="font-medium">hrs</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">₹</span>
            <input type="number" value={activity.estimated_cost || ''} onChange={(e) => handleField('estimated_cost', e.target.value)} className="w-16 bg-transparent font-semibold focus:outline-none" placeholder="0" min="0" />
          </div>
        </div>
        <input
          type="text"
          value={activity.notes || ''}
          onChange={(e) => handleField('notes', e.target.value)}
          className="w-full text-xs text-[#6B6B7B] bg-transparent border-none focus:outline-none mt-2"
          placeholder="Add notes..."
        />
      </div>
    </div>
  );
}
