import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Loader2, Calendar, MapPin, Clock } from 'lucide-react';

export default function AddToItineraryFlow({ activity, onClose, onAddSuccess }) {
  const [trips, setTrips] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedStopId, setSelectedStopId] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingStops, setLoadingStops] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTrips() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('trips')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setTrips(data || []);
      }
      setLoadingTrips(false);
    }
    fetchTrips();
  }, []);

  useEffect(() => {
    if (!selectedTripId) {
      setStops([]);
      setSelectedStopId('');
      return;
    }

    async function fetchStops() {
      setLoadingStops(true);
      const { data } = await supabase
        .from('stops')
        .select('*')
        .eq('trip_id', selectedTripId)
        .order('order_index');
      setStops(data || []);
      setLoadingStops(false);
    }
    fetchStops();
  }, [selectedTripId]);

  const days = useMemo(() => {
    const stop = stops.find(s => s.id === selectedStopId);
    if (!stop) return [];
    
    const start = new Date(stop.arrival_date);
    const end = new Date(stop.departure_date);
    const dayList = [];
    
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dayList.push(new Date(d).toISOString().split('T')[0]);
    }
    if (dayList.length === 0) dayList.push(stop.arrival_date);
    return dayList;
  }, [stops, selectedStopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId) return setError('Select a trip');
    if (!selectedStopId) return setError('Select a stop');
    if (!selectedDay) return setError('Select a day');

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from('activities')
        .insert([{
          stop_id: selectedStopId,
          day_date: selectedDay,
          name: activity.name,
          category: activity.category,
          start_time: startTime,
          duration_hours: activity.duration_hours,
          estimated_cost: activity.cost_per_person,
          notes: activity.description
        }]);

      if (insertError) throw insertError;

      const cityName = stops.find(s => s.id === selectedStopId)?.city_name;
      const dayNum = days.indexOf(selectedDay) + 1;
      onAddSuccess(activity.name, cityName, dayNum, selectedTripId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-[440px] w-full p-8 animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-[#1A1A2E] mb-6">Add to Itinerary</h3>

        <div className="bg-[#FDF8F3] border border-[#F5EFE6] rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#1D9E75] shadow-sm">
            <Star size={18} className="fill-[#1D9E75]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider">Adding Activity</p>
            <p className="text-sm font-bold text-[#1A1A2E] truncate">{activity.name}</p>
          </div>
        </div>

        {loadingTrips ? (
          <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-[#1D9E75]" /></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">Which Trip?</label>
              <select 
                value={selectedTripId} 
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all appearance-none"
              >
                <option value="">Select a trip...</option>
                {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            {selectedTripId && (
              <div>
                <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">Which Stop?</label>
                {loadingStops ? (
                  <div className="flex justify-center py-2"><Loader2 size={16} className="animate-spin text-[#1D9E75]" /></div>
                ) : stops.length === 0 ? (
                  <p className="text-xs text-[#E8593C] font-semibold">No stops in this trip yet.</p>
                ) : (
                  <select 
                    value={selectedStopId} 
                    onChange={(e) => setSelectedStopId(e.target.value)}
                    className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all appearance-none"
                  >
                    <option value="">Select a city...</option>
                    {stops.map(s => <option key={s.id} value={s.id}>{s.city_name}, {s.country}</option>)}
                  </select>
                )}
              </div>
            )}

            {selectedStopId && days.length > 0 && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">Which Day?</label>
                  <select 
                    value={selectedDay} 
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all appearance-none"
                  >
                    <option value="">Select day...</option>
                    {days.map((d, i) => (
                      <option key={d} value={d}>
                        Day {i + 1} ({new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-wider mb-2">Start Time</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                    <input 
                      type="time" 
                      value={startTime} 
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-xs text-[#E8593C] font-semibold text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={submitting || !selectedDay}
              className="w-full bg-[#1D9E75] hover:bg-[#158562] text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-[#1D9E75]/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] mt-4"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {submitting ? 'Adding...' : 'Add to Itinerary'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
