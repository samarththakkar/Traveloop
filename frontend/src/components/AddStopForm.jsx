import { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

const popularCities = [
  { city: 'Paris', country: 'France' }, { city: 'Tokyo', country: 'Japan' },
  { city: 'New York', country: 'USA' }, { city: 'London', country: 'UK' },
  { city: 'Dubai', country: 'UAE' }, { city: 'Rome', country: 'Italy' },
  { city: 'Bali', country: 'Indonesia' }, { city: 'Bangkok', country: 'Thailand' },
  { city: 'Barcelona', country: 'Spain' }, { city: 'Sydney', country: 'Australia' },
  { city: 'Singapore', country: 'Singapore' }, { city: 'Istanbul', country: 'Turkey' },
  { city: 'Mumbai', country: 'India' }, { city: 'Delhi', country: 'India' },
  { city: 'Jaipur', country: 'India' }, { city: 'Goa', country: 'India' },
  { city: 'Kyoto', country: 'Japan' }, { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Zurich', country: 'Switzerland' }, { city: 'Seoul', country: 'South Korea' },
];

export default function AddStopForm({ onAdd, onCancel, loading }) {
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = cityQuery.trim()
    ? popularCities.filter(c => c.city.toLowerCase().includes(cityQuery.toLowerCase()))
    : popularCities.slice(0, 8);

  const handleSubmit = () => {
    if (!selectedCity) { setError('Please select a city'); return; }
    if (!arrival) { setError('Arrival date is required'); return; }
    if (!departure) { setError('Departure date is required'); return; }
    if (new Date(departure) <= new Date(arrival)) { setError('Departure must be after arrival'); return; }
    onAdd({ city_name: selectedCity.city, country: selectedCity.country, arrival_date: arrival, departure_date: departure });
  };

  return (
    <div className="bg-white rounded-xl border border-[#1D9E75]/30 p-4 space-y-3 animate-fade-in">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
        <input
          type="text"
          value={selectedCity ? selectedCity.city : cityQuery}
          onChange={(e) => { setCityQuery(e.target.value); setSelectedCity(null); setShowDropdown(true); setError(''); }}
          onFocus={() => setShowDropdown(true)}
          className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl pl-9 pr-8 py-2.5 text-sm text-[#1A1A2E] placeholder-[#6B6B7B]/60 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all"
          placeholder="Search city..."
        />
        {selectedCity && (
          <button onClick={() => { setSelectedCity(null); setCityQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B7B] hover:text-[#1A1A2E]"><X size={14} /></button>
        )}
        {showDropdown && !selectedCity && filtered.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#E8E0D5] rounded-xl shadow-lg max-h-40 overflow-y-auto">
            {filtered.map((c, i) => (
              <button key={i} onClick={() => { setSelectedCity(c); setShowDropdown(false); setCityQuery(''); setError(''); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5EFE6] transition-colors flex justify-between">
                <span className="font-semibold text-[#1A1A2E]">{c.city}</span>
                <span className="text-[#6B6B7B] text-xs">{c.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input type="date" value={arrival} onChange={(e) => { setArrival(e.target.value); setError(''); }} className="flex-1 bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all" />
        <input type="date" value={departure} onChange={(e) => { setDeparture(e.target.value); setError(''); }} className="flex-1 bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all" />
      </div>
      {error && <p className="text-xs text-[#E8593C] font-semibold">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 disabled:opacity-70">
          {loading ? <Loader2 size={14} className="animate-spin" /> : null} Add
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-semibold text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors">Cancel</button>
      </div>
    </div>
  );
}
