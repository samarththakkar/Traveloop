import { MapPin, Star } from 'lucide-react';

const budgetLabels = { 1: '💰', 2: '💰💰', 3: '💰💰💰' };

export default function CityCard({ city, index, onCardClick, onAddToTrip, viewMode }) {
  const grad = city.gradient || 'from-[#1D9E75] to-[#0d7a5a]';
  const budget = budgetLabels[city.budget_level] || '💰';
  const seasons = city.best_seasons || [];
  const tags = (city.popular_for || []).slice(0, 3);
  const cur = city.currency === 'USD' ? '$' : city.currency === 'EUR' ? '€' : '₹';

  if (viewMode === 'list') {
    return (
      <div onClick={() => onCardClick(city)} className="bg-white rounded-xl shadow-sm border border-[#F5EFE6] px-5 py-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group" style={{ animation: `fadeIn 0.4s ease-out ${index * 0.06}s both` }}>
        {city.image ? (
          <img src={city.image} alt={city.name} className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className={`w-[72px] h-[72px] rounded-xl bg-gradient-to-br ${grad} flex-shrink-0`} />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1A1A2E] truncate group-hover:text-[#1D9E75] transition-colors">{city.name}</h3>
          <p className="text-xs text-[#6B6B7B]">{city.country}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="text-[10px] font-bold bg-[#F5EFE6] text-[#6B6B7B] px-2 py-0.5 rounded-full">{budget}</span>
            {seasons.slice(0, 2).map(s => <span key={s} className="text-[10px] font-bold bg-[#F5EFE6] text-[#6B6B7B] px-2 py-0.5 rounded-full">{s}</span>)}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs"><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><span className="font-bold text-[#1A1A2E]">{city.rating}</span></div>
          <button onClick={(e) => { e.stopPropagation(); onAddToTrip(city); }} className="bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-xs px-3 py-2 rounded-full transition-all whitespace-nowrap">Add +</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => onCardClick(city)} className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group" style={{ animation: `fadeIn 0.4s ease-out ${index * 0.06}s both` }}>
      <div className={`h-[140px] ${!city.image ? `bg-gradient-to-br ${grad}` : ''} relative overflow-hidden p-4 flex flex-col justify-end`}>
        {city.image && (
          <>
            <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        )}
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute right-10 top-4 w-10 h-10 rounded-full bg-white/5" />
        <div className="absolute top-3 right-3"><span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">{budget}</span></div>
        <h3 className="text-white font-bold text-xl leading-tight drop-shadow-sm relative z-10">{city.name}</h3>
        <p className="text-white/80 text-xs font-medium relative z-10">{city.country}</p>
      </div>
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-[#6B6B7B] font-medium"><MapPin size={12} />{city.country}</span>
          <span className="flex items-center gap-1 text-xs"><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><span className="font-bold text-[#1A1A2E]">{city.rating}</span></span>
        </div>
        {seasons.length > 0 && <div className="flex flex-wrap gap-1.5">{seasons.map(s => <span key={s} className="text-[10px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded-full">{s}</span>)}</div>}
        {tags.length > 0 && <div className="flex flex-wrap gap-1.5">{tags.map(t => <span key={t} className="text-[10px] font-bold bg-[#F5EFE6] text-[#6B6B7B] px-2 py-0.5 rounded-full">{t}</span>)}</div>}
      </div>
      <div className="border-t border-[#F5EFE6] px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-[#6B6B7B] font-medium">~{cur}{city.avg_cost_per_day?.toLocaleString('en-IN')}/day</span>
        <button onClick={(e) => { e.stopPropagation(); onAddToTrip(city); }} className="bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-xs px-3 py-2 rounded-full transition-all">Add to Trip +</button>
      </div>
    </div>
  );
}
