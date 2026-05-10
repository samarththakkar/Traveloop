import { CalendarDays, Moon, Zap, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getNights(arrival, departure) {
  if (!arrival || !departure) return 0;
  return Math.max(0, Math.ceil((new Date(departure) - new Date(arrival)) / 864e5));
}

export default function StopCard({ stop, index, isSelected, activityCount, onSelect, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const nights = getNights(stop.arrival_date, stop.departure_date);
  return (
    <div className="relative">
      {/* Dashed connector line */}
      {!isFirst && <div className="absolute -top-4 left-[22px] w-0 h-4 border-l-2 border-dashed border-[#E8E0D5]" />}

      <div
        onClick={onSelect}
        className={`relative bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md group ${
          isSelected ? 'border-l-[3px] border-l-[#1D9E75] border-[#1D9E75]/30 bg-[#F5EFE6]' : 'border-[#E8E0D5] hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1D9E75] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#1A1A2E] text-[15px] truncate">{stop.city_name}</h4>
            <p className="text-xs text-[#6B6B7B] font-medium">{stop.country || ''}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-[#6B6B7B] font-medium">
              {stop.arrival_date && (
                <span className="flex items-center gap-1"><CalendarDays size={12} />{fmtDate(stop.arrival_date)} – {fmtDate(stop.departure_date)}</span>
              )}
              {nights > 0 && <span className="flex items-center gap-1"><Moon size={12} />{nights} night{nights !== 1 ? 's' : ''}</span>}
              <span className="flex items-center gap-1"><Zap size={12} />{activityCount} activit{activityCount === 1 ? 'y' : 'ies'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            {!isFirst && <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="w-6 h-6 rounded flex items-center justify-center text-[#6B6B7B] hover:text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-all"><ChevronUp size={14} /></button>}
            {!isLast && <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="w-6 h-6 rounded flex items-center justify-center text-[#6B6B7B] hover:text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-all"><ChevronDown size={14} /></button>}
          </div>
        </div>
        <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-[#F5EFE6]">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:text-[#E8593C] hover:bg-[#E8593C]/10 transition-all"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}
