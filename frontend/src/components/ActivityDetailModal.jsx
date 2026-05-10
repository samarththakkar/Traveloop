import { X, MapPin, Star, Clock, Users, CheckCircle, Lightbulb } from 'lucide-react';

const categoryConfig = {
  sightseeing: 'from-[#DBEAFE] to-[#3B82F6]',
  food: 'from-[#FEF3C7] to-[#F59E0B]',
  transport: 'from-[#F3F4F6] to-[#9CA3AF]',
  accommodation: 'from-[#EDE9FE] to-[#8B5CF6]',
  adventure: 'from-[#DCFCE7] to-[#22C55E]',
  shopping: 'from-[#FCE7F3] to-[#EC4899]',
  culture: 'from-[#FFF7ED] to-[#F97316]',
  nature: 'from-[#ECFDF5] to-[#10B981]',
  wellness: 'from-[#F0F9FF] to-[#0EA5E9]',
  nightlife: 'from-[#1A1A2E] to-[#4F46E5]',
};

export default function ActivityDetailModal({ activity, onClose, onAddClick }) {
  if (!activity) return null;
  const grad = categoryConfig[activity.category.toLowerCase()] || categoryConfig.sightseeing;
  const cur = activity.currency === 'USD' ? '$' : activity.currency === 'EUR' ? '€' : '₹';
  const cost = activity.cost_per_person === 0 ? 'Free' : `${cur}${activity.cost_per_person.toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-[560px] w-full overflow-hidden animate-scale-in">
        {/* Banner */}
        <div className={`h-[180px] bg-gradient-to-br ${grad} relative flex items-end p-8`}>
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10" />
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-all"
          >
            <X size={20} />
          </button>
          <h2 className="text-white font-bold text-2xl drop-shadow-md relative z-10">{activity.name}</h2>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-[#F5EFE6] text-[#6B6B7B] px-3 py-1 rounded-full capitalize">{activity.category}</span>
              <span className="flex items-center gap-1 text-sm text-[#6B6B7B] font-medium"><MapPin size={14} />{activity.city_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} className={i <= Math.floor(activity.rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E8E0D5]'} />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1A1A2E] ml-1">{activity.rating} ({activity.review_count} reviews)</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Clock, label: 'Duration', value: `${activity.duration_hours}–${activity.duration_hours + 1} hours` },
              { icon: Users, label: 'Group Size', value: activity.group_size || '1–10 people' },
              { icon: MapPin, label: 'Location', value: `${activity.city_name}, ${activity.neighborhood || 'Central'}` },
              { icon: Star, label: 'Cost', value: `${cost} / person` }
            ].map((item, i) => (
              <div key={i} className="bg-[#FDF8F3] border border-[#F5EFE6] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#1D9E75] shadow-sm">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-bold text-[#1A1A2E] mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1A1A2E] mb-2 uppercase tracking-widest">Description</h4>
            <p className="text-sm text-[#6B6B7B] leading-relaxed italic">{activity.description}</p>
          </div>

          {activity.whats_included && activity.whats_included.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-[#1A1A2E] mb-3 uppercase tracking-widest">What's Included</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activity.whats_included.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#6B6B7B]">
                    <CheckCircle size={16} className="text-[#1D9E75] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activity.tips && activity.tips.length > 0 && (
            <div className="bg-[#FEF3C7]/30 rounded-2xl p-5 border border-[#FEF3C7]">
              <h4 className="text-sm font-bold text-[#D97706] mb-3 flex items-center gap-2">
                <Lightbulb size={18} /> Travel Tips
              </h4>
              <ul className="space-y-2">
                {activity.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-[#92400E] flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[#D97706] flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-[#F5EFE6] flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[#1A1A2E]">{cost}</p>
            <p className="text-xs text-[#6B6B7B] font-medium">per person</p>
          </div>
          <button 
            onClick={() => onAddClick(activity)}
            className="bg-[#1D9E75] hover:bg-[#158562] text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-lg shadow-[#1D9E75]/20 active:scale-[0.98]"
          >
            Add to Itinerary +
          </button>
        </div>
      </div>
    </div>
  );
}
