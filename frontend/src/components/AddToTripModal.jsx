import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddToTripModal({ city, onClose, onAddSuccess }) {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTrips() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('trips')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!error) setTrips(data || []);
      }
      setLoading(false);
    }
    fetchTrips();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId) return setError('Please select a trip');
    if (!arrival || !departure) return setError('Please select dates');
    if (new Date(departure) <= new Date(arrival)) return setError('Departure must be after arrival');

    setSubmitting(true);
    try {
      // Get the current stops to determine order_index
      const { data: currentStops } = await supabase
        .from('stops')
        .select('order_index')
        .eq('trip_id', selectedTripId)
        .order('order_index', { ascending: false })
        .limit(1);
      
      const nextOrder = currentStops && currentStops.length > 0 ? currentStops[0].order_index + 1 : 0;

      const { error: insertError } = await supabase
        .from('stops')
        .insert([{
          trip_id: selectedTripId,
          city_name: city.name,
          country: city.country,
          arrival_date: arrival,
          departure_date: departure,
          order_index: nextOrder
        }]);

      if (insertError) throw insertError;

      const tripName = trips.find(t => t.id === selectedTripId)?.name;
      onAddSuccess(tripName, selectedTripId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const nights = arrival && departure ? Math.max(0, Math.ceil((new Date(departure) - new Date(arrival)) / 864e5)) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-[440px] w-full p-8 animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-[#1A1A2E] mb-6">Add <span className="text-[#1D9E75]">{city?.name}</span> to a Trip</h3>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-[#1D9E75]" /></div>
        ) : trips.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[#6B6B7B] mb-4">You don't have any trips yet.</p>
            <Link to="/create-trip" className="inline-block bg-[#1D9E75] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#158562] transition-all">Create a Trip first →</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">Select Trip</label>
              <select 
                value={selectedTripId} 
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all appearance-none bg-no-repeat bg-[right_1rem_center]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236B6B7B%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")' }}
              >
                <option value="">Choose a trip...</option>
                {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">Arrival</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                  <input 
                    type="date" 
                    value={arrival} 
                    onChange={(e) => setArrival(e.target.value)}
                    className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">Departure</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                  <input 
                    type="date" 
                    value={departure} 
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {nights > 0 && (
              <div className="flex justify-center">
                <span className="text-[11px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] px-3 py-1 rounded-full uppercase tracking-wider">{nights} night{nights !== 1 ? 's' : ''} stay</span>
              </div>
            )}

            {error && <p className="text-xs text-[#E8593C] font-semibold text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-[#1D9E75] hover:bg-[#158562] text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-[#1D9E75]/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {submitting ? 'Adding...' : 'Add Stop'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
