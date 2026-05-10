import { MapPin, Star, Clock, Landmark, Utensils, Car, Hotel, Mountain, ShoppingBag, Theater, TreePine, Sparkles, MoonStar } from 'lucide-react';

const categoryConfig = {
  sightseeing: { icon: Landmark, gradient: 'from-[#DBEAFE] to-[#3B82F6]', color: 'text-[#2563EB]', bg: 'bg-[#DBEAFE]' },
  food: { icon: Utensils, gradient: 'from-[#FEF3C7] to-[#F59E0B]', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
  transport: { icon: Car, gradient: 'from-[#F3F4F6] to-[#9CA3AF]', color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]' },
  accommodation: { icon: Hotel, gradient: 'from-[#EDE9FE] to-[#8B5CF6]', color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]' },
  adventure: { icon: Mountain, gradient: 'from-[#DCFCE7] to-[#22C55E]', color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]' },
  shopping: { icon: ShoppingBag, gradient: 'from-[#FCE7F3] to-[#EC4899]', color: 'text-[#DB2777]', bg: 'bg-[#FCE7F3]' },
  culture: { icon: Theater, gradient: 'from-[#FFF7ED] to-[#F97316]', color: 'text-[#F97316]', bg: 'bg-[#FFF7ED]' },
  nature: { icon: TreePine, gradient: 'from-[#ECFDF5] to-[#10B981]', color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]' },
  wellness: { icon: Sparkles, gradient: 'from-[#F0F9FF] to-[#0EA5E9]', color: 'text-[#0EA5E9]', bg: 'bg-[#F0F9FF]' },
  nightlife: { icon: MoonStar, gradient: 'from-[#1A1A2E] to-[#4F46E5]', color: 'text-white', bg: 'bg-[#1A1A2E]' },
};

export default function ActivitySearchCard({ activity, index, viewMode, onCardClick, onAddClick }) {
  const config = categoryConfig[activity.category.toLowerCase()] || categoryConfig.sightseeing;
  const Icon = config.icon;
  const cur = activity.currency === 'USD' ? '$' : activity.currency === 'EUR' ? '€' : '₹';
  const cost = activity.cost_per_person === 0 ? 'Free' : `${cur}${activity.cost_per_person.toLocaleString('en-IN')}`;

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onCardClick(activity)}
        className="bg-white rounded-xl shadow-sm border border-[#F5EFE6] px-5 py-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
        style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s both` }}
      >
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${config.gradient} flex-shrink-0 flex items-center justify-center text-white`}>
          <Icon size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#1A1A2E] truncate group-hover:text-[#1D9E75] transition-colors">{activity.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${config.bg} ${config.color.startsWith('text-white') ? 'text-[#1A1A2E]' : config.color}`}>
              {activity.category}
            </span>
          </div>
          <p className="text-xs text-[#6B6B7B] flex items-center gap-1 mt-0.5"><MapPin size={12} /> {activity.city_name}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-[#6B6B7B] font-medium flex items-center gap-1"><Clock size={12} /> {activity.duration_hours}h</span>
            <span className="text-[10px] text-[#6B6B7B] font-medium flex items-center gap-1"><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /> {activity.rating}</span>
            <p className="text-[10px] text-[#6B6B7B] italic truncate hidden sm:block">{activity.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="font-bold text-[#1A1A2E] text-sm">{cost}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddClick(activity); }}
            className="bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-xs px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
          >
            Add +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onCardClick(activity)}
      className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col"
      style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s both` }}
    >
      <div className={`h-[120px] bg-gradient-to-br ${config.gradient} relative flex items-center justify-center text-white overflow-hidden`}>
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
        <Icon size={32} className="relative z-10 drop-shadow-md" />
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${activity.cost_per_person === 0 ? 'bg-[#1D9E75] text-white' : 'bg-white/20 backdrop-blur-sm text-white'}`}>
            {cost}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col space-y-2">
        <div className="min-h-[44px]">
          <h3 className="font-bold text-[15px] text-[#1A1A2E] leading-tight line-clamp-2 group-hover:text-[#1D9E75] transition-colors">{activity.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${config.bg} ${config.color.startsWith('text-white') ? 'text-[#1A1A2E]' : config.color}`}>
            {activity.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#6B6B7B] font-medium"><MapPin size={12} />{activity.city_name}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#6B6B7B] font-medium">
          <span className="flex items-center gap-1"><Clock size={12} />{activity.duration_hours} hrs</span>
          <span className="flex items-center gap-1"><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />{activity.rating}</span>
        </div>
        <p className="text-[11px] text-[#6B6B7B] italic line-clamp-2 leading-relaxed">{activity.description}</p>
      </div>

      <div className="border-t border-[#F5EFE6] px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-bold text-[#1A1A2E]">{cost} <span className="text-[10px] text-[#6B6B7B] font-medium">/ person</span></span>
        <button 
          onClick={(e) => { e.stopPropagation(); onAddClick(activity); }}
          className="bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-xs px-3 py-2 rounded-full transition-all active:scale-[0.98]"
        >
          Add to Trip +
        </button>
      </div>
    </div>
  );
}
