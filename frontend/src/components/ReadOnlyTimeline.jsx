import { MapPin, CalendarDays, Clock, Plane } from 'lucide-react';

const categoryStyles = {
  sightseeing: { bg: 'bg-[#DBEAFE]', text: '#2563EB', dot: '#2563EB' },
  food: { bg: 'bg-[#FEF3C7]', text: '#D97706', dot: '#D97706' },
  transport: { bg: 'bg-[#F3F4F6]', text: '#6B7280', dot: '#6B7280' },
  accommodation: { bg: 'bg-[#EDE9FE]', text: '#7C3AED', dot: '#7C3AED' },
  adventure: { bg: 'bg-[#DCFCE7]', text: '#16A34A', dot: '#16A34A' },
  shopping: { bg: 'bg-[#FCE7F3]', text: '#EC4899', dot: '#EC4899' },
  culture: { bg: 'bg-[#FFF7ED]', text: '#F97316', dot: '#F97316' },
  nature: { bg: 'bg-[#ECFDF5]', text: '#10B981', dot: '#10B981' },
  wellness: { bg: 'bg-[#F0F9FF]', text: '#0EA5E9', dot: '#0EA5E9' },
  nightlife: { bg: 'bg-[#1A1A2E]/5', text: '#1A1A2E', dot: '#1A1A2E' },
};

const stopGradients = [
  'from-[#1D9E75] to-[#1A1A2E]',
  'from-[#E8593C] to-[#1A1A2E]',
  'from-[#3B82F6] to-[#1A1A2E]',
  'from-[#8B5CF6] to-[#1A1A2E]',
  'from-[#F59E0B] to-[#1A1A2E]',
  'from-[#10B981] to-[#1A1A2E]',
];

export default function ReadOnlyTimeline({ stops, activities }) {
  return (
    <div className="space-y-12 py-8">
      {stops.map((stop, stopIdx) => {
        const stopActs = activities.filter(a => a.stop_id === stop.id);
        const days = [...new Set(stopActs.map(a => a.day_date))].sort();

        return (
          <section key={stop.id} className="relative">
            {/* Stop Header */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#F5EFE6] p-6 sm:p-8 mb-8 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stopGradients[stopIdx % stopGradients.length]} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                    {stopIdx + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1A1A2E]">{stop.city_name}</h2>
                    <p className="text-sm font-bold text-[#6B6B7B] uppercase tracking-widest">{stop.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[#FDF8F3] border border-[#F5EFE6] px-4 py-2 rounded-xl">
                  <CalendarDays size={16} className="text-[#1D9E75]" />
                  <span className="text-xs font-bold text-[#1A1A2E]">
                    {new Date(stop.arrival_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(stop.departure_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
              <div className="h-px bg-[#F5EFE6] w-full" />
            </div>

            {/* Days & Activities */}
            <div className="space-y-8 ml-4 sm:ml-8">
              {days.map((day, dayIdx) => {
                const dayActs = stopActs.filter(a => a.day_date === day).sort((a, b) => a.start_time.localeCompare(b.start_time));
                return (
                  <div key={day} className="space-y-6">
                    <div className="inline-block bg-[#F5EFE6] text-[#6B6B7B] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
                      Day {dayIdx + 1} — {new Date(day).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    
                    <div className="space-y-4">
                      {dayActs.map((act, actIdx) => {
                        const style = categoryStyles[act.category?.toLowerCase()] || categoryStyles.sightseeing;
                        return (
                          <div key={act.id} className="flex gap-4 sm:gap-6 group">
                            <div className="flex flex-col items-center">
                              <span className="text-[11px] font-black text-[#1D9E75] w-10 text-right">{act.start_time}</span>
                              <div className="flex-1 w-px border-l-2 border-dotted border-[#E8E0D5] my-2 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: style.dot }} />
                              </div>
                            </div>
                            
                            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#F5EFE6] p-5 hover:border-[#1D9E75]/30 transition-all">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${style.bg}`} style={{ color: style.text }}>
                                  {act.category}
                                </span>
                                {act.duration_hours && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#6B6B7B]">
                                    <Clock size={10} /> {act.duration_hours}h
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-[#1A1A2E] mb-1">{act.name}</h4>
                              {act.notes && <p className="text-xs text-[#6B6B7B] italic leading-relaxed">{act.notes}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Travel Connector */}
            {stopIdx < stops.length - 1 && (
              <div className="my-12 flex flex-col items-center gap-3">
                <div className="w-px h-12 border-l-2 border-dashed border-[#E8E0D5]" />
                <div className="bg-[#F5EFE6] border border-[#E8E0D5] border-dashed rounded-2xl px-6 py-4 flex items-center gap-3 text-[#6B6B7B]">
                  <Plane size={18} className="text-[#1D9E75]" />
                  <span className="text-sm font-bold">Travel to {stops[stopIdx + 1].city_name}</span>
                </div>
                <div className="w-px h-12 border-l-2 border-dashed border-[#E8E0D5]" />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
