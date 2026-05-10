import { CalendarDays, Clock, Plane } from 'lucide-react';

const catStyles = {
  sightseeing: { bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]', dot: 'bg-[#2563EB]' },
  food: { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', dot: 'bg-[#D97706]' },
  transport: { bg: 'bg-[#F3F4F6]', text: 'text-[#6B7280]', dot: 'bg-[#6B7280]' },
  hotel: { bg: 'bg-[#EDE9FE]', text: 'text-[#7C3AED]', dot: 'bg-[#7C3AED]' },
  adventure: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', dot: 'bg-[#16A34A]' },
  shopping: { bg: 'bg-[#FCE7F3]', text: 'text-[#DB2777]', dot: 'bg-[#DB2777]' },
};

const themes = [
  { from: '#1D9E75', to: '#0d7a5a' }, { from: '#E8593C', to: '#c93e24' },
  { from: '#4F46E5', to: '#7C3AED' }, { from: '#F59E0B', to: '#D97706' },
  { from: '#0EA5E9', to: '#0284C7' }, { from: '#1A1A2E', to: '#3D3D5C' },
];

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

function fmtShort(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function fmtDay(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
}

function getNights(a, b) {
  if (!a || !b) return 0;
  return Math.max(0, Math.ceil((new Date(b) - new Date(a)) / 864e5));
}

function getDays(a, b) {
  const days = [];
  const s = new Date(a), e = new Date(b);
  for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) days.push(new Date(d).toISOString().split('T')[0]);
  if (days.length === 0) days.push(a);
  return days;
}

export default function TimelineView({ stops, activities, trip }) {
  const themeIdx = trip?.theme_color || 0;
  const theme = themes[themeIdx % themes.length];
  const cur = trip?.currency === 'USD' ? '$' : trip?.currency === 'EUR' ? '€' : '₹';
  let globalDay = 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {stops.map((stop, si) => {
        const stopActs = activities.filter(a => a.stop_id === stop.id);
        const days = getDays(stop.arrival_date, stop.departure_date);
        const nights = getNights(stop.arrival_date, stop.departure_date);
        const stopCost = stopActs.reduce((s, a) => s + (Number(a.estimated_cost) || 0), 0);
        const stopHours = stopActs.reduce((s, a) => s + (Number(a.duration_hours) || 0), 0);

        return (
          <div key={stop.id}>
            {/* Stop Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}>
                {si + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-[#1A1A2E]">{stop.city_name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#6B6B7B] font-medium">{stop.country}</span>
                  <span className="text-xs text-[#6B6B7B]">·</span>
                  <span className="text-xs text-[#6B6B7B] font-medium flex items-center gap-1"><CalendarDays size={12} />{fmtShort(stop.arrival_date)} – {fmtShort(stop.departure_date)}</span>
                  {nights > 0 && <span className="text-[10px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded-full">{nights} night{nights !== 1 ? 's' : ''}</span>}
                </div>
              </div>
            </div>
            <div className="border-t border-[#E8E0D5] mb-4" />

            {/* Days */}
            {days.map((day, di) => {
              globalDay++;
              const dayActs = stopActs.filter(a => a.day_date === day);
              return (
                <div key={day} className="mb-6">
                  <div className="bg-[#F5EFE6] rounded-lg px-4 py-2 mb-4">
                    <span className="text-sm font-bold text-[#1A1A2E]">Day {globalDay}</span>
                    <span className="text-xs text-[#6B6B7B] font-medium ml-2">— {fmtDay(day)}</span>
                  </div>
                  {dayActs.length > 0 ? dayActs.map(act => {
                    const cat = catStyles[act.category] || catStyles.sightseeing;
                    return (
                      <div key={act.id} className="flex gap-3 ml-2 mb-1">
                        <div className="w-20 flex-shrink-0 text-right pt-1">
                          <span className="text-xs font-bold text-[#1D9E75]">{fmt12(act.start_time)}</span>
                        </div>
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${cat.dot} border-2 border-white shadow-sm mt-2`} />
                          <div className="w-0.5 flex-1 bg-[#E8E0D5] mt-1" />
                        </div>
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#F5EFE6] p-4 mb-3 min-w-0">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${cat.bg} ${cat.text}`}>{act.category}</span>
                          <h4 className="font-bold text-[15px] text-[#1A1A2E] mt-1">{act.name}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#6B6B7B]">
                            {act.duration_hours && <span className="flex items-center gap-1"><Clock size={12} />{act.duration_hours} hrs</span>}
                            {act.estimated_cost && <span>{cur}{Number(act.estimated_cost).toLocaleString('en-IN')}</span>}
                          </div>
                          {act.notes && <p className="text-xs text-[#6B6B7B] italic mt-1.5">{act.notes}</p>}
                        </div>
                      </div>
                    );
                  }) : (
                    <p className="text-sm text-[#6B6B7B] ml-10 mb-4">No activities planned for this day</p>
                  )}
                </div>
              );
            })}

            {/* Stop Summary */}
            <div className="text-right text-xs text-[#6B6B7B] font-semibold mb-4">
              Stop Total: {stopActs.length} activities · {stopHours} hrs · {cur}{stopCost.toLocaleString('en-IN')}
            </div>

            {/* Travel connector */}
            {si < stops.length - 1 && (
              <div className="flex items-center justify-center my-4">
                <div className="border-2 border-dashed border-[#E8E0D5] rounded-xl bg-[#F5EFE6] px-6 py-3 flex items-center gap-2 text-sm text-[#6B6B7B] font-medium">
                  <Plane size={16} className="text-[#1D9E75]" />
                  Travel to {stops[si + 1].city_name}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
