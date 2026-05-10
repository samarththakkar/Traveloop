import { useState } from 'react';
import { X, Star, Lightbulb } from 'lucide-react';

const budgetLabels = { 1: '💰 Budget', 2: '💰💰 Mid-range', 3: '💰💰💰 Luxury' };

export default function CityDrawer({ city, onClose, onAddToTrip }) {
  const [tab, setTab] = useState('overview');
  if (!city) return null;
  const grad = city.gradient || 'from-[#1D9E75] to-[#0d7a5a]';
  const tabs = ['Overview', 'Activities', 'Tips'];
  const acts = city.popular_activities || [];
  const tips = city.tips || [];
  const cur = city.currency === 'USD' ? '$' : city.currency === 'EUR' ? '€' : '₹';

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[420px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        {/* Banner */}
        <div className={`h-[200px] bg-gradient-to-br ${grad} relative flex flex-col justify-end p-6 flex-shrink-0`}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-all"><X size={18} /></button>
          <h2 className="text-white font-bold text-[28px] leading-tight drop-shadow-sm relative z-10">{city.name}</h2>
          <p className="text-white/80 text-sm font-medium relative z-10">{city.country}</p>
        </div>

        {/* Meta */}
        <div className="px-6 pt-4 pb-2 flex flex-wrap items-center gap-2 border-b border-[#F5EFE6] flex-shrink-0">
          <span className="flex items-center gap-1 text-xs font-bold"><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />{city.rating}</span>
          <span className="text-xs font-bold bg-[#F5EFE6] text-[#6B6B7B] px-2 py-0.5 rounded-full">{budgetLabels[city.budget_level]}</span>
          {(city.best_seasons || []).map(s => <span key={s} className="text-[10px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded-full">{s}</span>)}
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 flex gap-2 flex-shrink-0">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t.toLowerCase())} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${tab === t.toLowerCase() ? 'bg-[#1D9E75] text-white' : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'}`}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {tab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm text-[#6B6B7B] leading-relaxed">{city.description || 'A beautiful destination waiting to be explored.'}</p>
              <div className="grid grid-cols-2 gap-3">
                {[{ l: 'Avg Temp', v: city.avg_temp || '—' }, { l: 'Currency', v: city.currency || '—' }, { l: 'Language', v: city.language || '—' }, { l: 'Timezone', v: city.timezone || '—' }].map(s => (
                  <div key={s.l} className="bg-[#F5EFE6] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider">{s.l}</p>
                    <p className="text-sm font-bold text-[#1A1A2E] mt-0.5">{s.v}</p>
                  </div>
                ))}
              </div>
              {city.neighborhoods && city.neighborhoods.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A2E] mb-2">Popular Neighborhoods</h4>
                  <ul className="space-y-1">{city.neighborhoods.map((n, i) => <li key={i} className="text-sm text-[#6B6B7B]">• {n}</li>)}</ul>
                </div>
              )}
            </div>
          )}
          {tab === 'activities' && (
            <div className="space-y-3 animate-fade-in">
              {acts.length > 0 ? acts.map((a, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#F5EFE6] p-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A2E]">{a.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold bg-[#DBEAFE] text-[#2563EB] px-2 py-0.5 rounded-full">{a.category || 'Sightseeing'}</span>
                      {a.cost && <span className="text-[10px] text-[#6B6B7B] font-medium">~{cur}{a.cost}</span>}
                    </div>
                  </div>
                </div>
              )) : <p className="text-sm text-[#6B6B7B]">No activities listed yet.</p>}
            </div>
          )}
          {tab === 'tips' && (
            <div className="space-y-3 animate-fade-in">
              {tips.length > 0 ? tips.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Lightbulb size={16} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#6B6B7B]">{t}</p>
                </div>
              )) : <p className="text-sm text-[#6B6B7B]">No tips available yet.</p>}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="px-6 py-4 border-t border-[#F5EFE6] flex-shrink-0">
          <button onClick={() => onAddToTrip(city)} className="w-full bg-[#1D9E75] hover:bg-[#158562] text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-[#1D9E75]/20 active:scale-[0.98]">Add {city.name} to Trip +</button>
        </div>
      </div>
    </div>
  );
}
