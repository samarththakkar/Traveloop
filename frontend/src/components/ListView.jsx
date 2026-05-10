import { Clock } from 'lucide-react';

const catStyles = {
  sightseeing: { bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]', bar: 'bg-[#2563EB]' },
  food: { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', bar: 'bg-[#D97706]' },
  transport: { bg: 'bg-[#F3F4F6]', text: 'text-[#6B7280]', bar: 'bg-[#6B7280]' },
  hotel: { bg: 'bg-[#EDE9FE]', text: 'text-[#7C3AED]', bar: 'bg-[#7C3AED]' },
  adventure: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', bar: 'bg-[#16A34A]' },
  shopping: { bg: 'bg-[#FCE7F3]', text: 'text-[#DB2777]', bar: 'bg-[#DB2777]' },
};

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

function fmtDateShort(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function fmtDayName(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short' });
}

export default function ListView({ stops, activities, trip }) {
  const cur = trip?.currency === 'USD' ? '$' : trip?.currency === 'EUR' ? '€' : '₹';
  const stopMap = {};
  stops.forEach(s => { stopMap[s.id] = s; });

  const sorted = [...activities].sort((a, b) => (a.day_date + (a.start_time || '')).localeCompare(b.day_date + (b.start_time || '')));
  const grouped = {};
  sorted.forEach(a => {
    if (!grouped[a.day_date]) grouped[a.day_date] = [];
    grouped[a.day_date].push(a);
  });
  const dates = Object.keys(grouped).sort();
  const totalDays = trip?.start_date && trip?.end_date ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 864e5) : dates.length;

  return (
    <div className="animate-fade-in">
      <p className="text-sm font-semibold text-[#6B6B7B] mb-4">{activities.length} activities across {totalDays} days</p>
      <div className="space-y-6">
        {dates.map(date => (
          <div key={date}>
            <div className="sticky top-0 z-10 bg-[#FDF8F3] py-1 mb-2">
              <span className="text-sm font-bold text-[#1A1A2E]">{fmtDateShort(date)}</span>
              <span className="text-xs text-[#6B6B7B] font-medium ml-2">{fmtDayName(date)}</span>
            </div>
            <div className="space-y-2">
              {grouped[date].map(act => {
                const cat = catStyles[act.category] || catStyles.sightseeing;
                const stop = stopMap[act.stop_id];
                return (
                  <div key={act.id} className="bg-white rounded-xl shadow-sm border border-[#F5EFE6] px-4 py-3 flex items-center gap-3 hover:shadow-md transition-all duration-200">
                    <div className="text-center flex-shrink-0 w-12">
                      <p className="text-xs font-bold text-[#1A1A2E]">{fmtDateShort(act.day_date)}</p>
                      <p className="text-[10px] text-[#6B6B7B]">{fmtDayName(act.day_date)}</p>
                    </div>
                    <div className={`w-1 self-stretch rounded-full ${cat.bar} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#1A1A2E] truncate">{act.name}</h4>
                      {stop && <p className="text-[11px] text-[#6B6B7B]">{stop.city_name}</p>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6B6B7B] flex-shrink-0 hidden sm:flex">
                      {act.start_time && <span className="font-semibold text-[#1D9E75]">{fmt12(act.start_time)}</span>}
                      {act.duration_hours && <span className="flex items-center gap-0.5"><Clock size={11} />{act.duration_hours}h</span>}
                      {act.estimated_cost && <span className="font-semibold">{cur}{Number(act.estimated_cost).toLocaleString('en-IN')}</span>}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${cat.bg} ${cat.text}`}>{act.category}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
