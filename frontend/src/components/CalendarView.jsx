import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const catStyles = {
  sightseeing: 'bg-[#2563EB]', food: 'bg-[#D97706]', transport: 'bg-[#6B7280]',
  hotel: 'bg-[#7C3AED]', adventure: 'bg-[#16A34A]', shopping: 'bg-[#DB2777]',
};

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

export default function CalendarView({ stops, activities, trip }) {
  const tripStart = trip?.start_date ? new Date(trip.start_date) : new Date();
  const [viewMonth, setViewMonth] = useState(new Date(tripStart.getFullYear(), tripStart.getMonth(), 1));
  const [popover, setPopover] = useState(null);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const tripStartStr = trip?.start_date;
  const tripEndStr = trip?.end_date;
  const today = new Date().toISOString().split('T')[0];

  const stopMap = {};
  stops.forEach(s => {
    const sd = new Date(s.arrival_date);
    const ed = new Date(s.departure_date);
    for (let d = new Date(sd); d < ed; d.setDate(d.getDate() + 1)) {
      stopMap[d.toISOString().split('T')[0]] = s;
    }
  });

  const actMap = {};
  activities.forEach(a => {
    if (!actMap[a.day_date]) actMap[a.day_date] = [];
    actMap[a.day_date].push(a);
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleCellClick = (dateStr, acts) => {
    if (acts && acts.length > 0) setPopover({ date: dateStr, acts });
    else setPopover(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} className="w-9 h-9 rounded-lg bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] transition-all"><ChevronLeft size={18} /></button>
        <h4 className="font-bold text-[#1A1A2E]">{monthName}</h4>
        <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} className="w-9 h-9 rounded-lg bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] transition-all"><ChevronRight size={18} /></button>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-px bg-[#E8E0D5] rounded-xl overflow-hidden border border-[#E8E0D5] relative">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} className="bg-[#F5EFE6] min-h-[70px] sm:min-h-[80px]" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === today;
          const inTrip = tripStartStr && tripEndStr && dateStr >= tripStartStr && dateStr <= tripEndStr;
          const stop = stopMap[dateStr];
          const acts = actMap[dateStr] || [];
          const thIdx = (stop?.order_index || 0) % 6;

          return (
            <div key={dateStr} onClick={() => handleCellClick(dateStr, acts)} className={`min-h-[70px] sm:min-h-[80px] p-1.5 cursor-pointer transition-all hover:bg-[#F5EFE6] relative ${inTrip ? 'bg-white' : 'bg-[#FAFAF5]'} ${isToday ? 'bg-[#1D9E75]/10 ring-1 ring-inset ring-[#1D9E75]' : ''}`}>
              {stop && <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${['#1D9E75','#E8593C','#4F46E5','#F59E0B','#0EA5E9','#1A1A2E'][thIdx]}, ${['#0d7a5a','#c93e24','#7C3AED','#D97706','#0284C7','#3D3D5C'][thIdx]})` }} />}
              <span className={`text-xs font-bold ${isToday ? 'text-[#1D9E75]' : inTrip ? 'text-[#1A1A2E]' : 'text-[#6B6B7B]/50'}`}>{day}</span>
              {stop && <p className="text-[8px] font-semibold text-[#1D9E75] truncate mt-0.5">{stop.city_name}</p>}
              <div className="flex gap-0.5 mt-1 flex-wrap">
                {acts.slice(0, 3).map((a, j) => <div key={j} className={`w-1.5 h-1.5 rounded-full ${catStyles[a.category] || catStyles.sightseeing}`} />)}
                {acts.length > 3 && <span className="text-[8px] text-[#6B6B7B] font-bold">+{acts.length - 3}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popover */}
      {popover && (
        <div className="fixed inset-0 z-50" onClick={() => setPopover(null)}>
          <div className="absolute inset-0" />
          <div className="flex items-center justify-center h-full p-4" onClick={e => e.stopPropagation()}>
            <div className="bg-white rounded-xl shadow-2xl border border-[#E8E0D5] p-5 max-w-sm w-full animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-[#1A1A2E]">{new Date(popover.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</h4>
                <button onClick={() => setPopover(null)} className="text-[#6B6B7B] hover:text-[#1A1A2E]"><X size={18} /></button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {popover.acts.map((a, j) => {
                  const cs = catStyles[a.category] || catStyles.sightseeing;
                  return (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <span className="text-xs font-bold text-[#1D9E75] w-16">{fmt12(a.start_time)}</span>
                      <div className={`w-2 h-2 rounded-full ${cs}`} />
                      <span className="font-medium text-[#1A1A2E]">{a.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
