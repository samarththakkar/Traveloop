import { useState } from 'react';
import { Copy, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function CopyTripBanner({ trip, stops, activities, viewer, onCopySuccess }) {
  const [copying, setCopying] = useState(false);
  const navigate = useNavigate();

  const handleCopy = async () => {
    if (!viewer) {
      navigate('/', { state: { redirectAfter: `/share/${trip.id}` } });
      return;
    }

    setCopying(true);
    try {
      // 1. Insert new trip
      const { data: newTrip, error: tripErr } = await supabase.from('trips').insert([{
        user_id: viewer.id,
        name: `${trip.name} (Copy)`,
        start_date: trip.start_date,
        end_date: trip.end_date,
        status: 'planning',
        theme_color: trip.theme_color,
        visibility: 'private',
        estimated_budget: trip.estimated_budget
      }]).select().single();

      if (tripErr) throw tripErr;

      // 2. Insert stops and map IDs
      for (const stop of stops) {
        const { data: newStop, error: stopErr } = await supabase.from('stops').insert([{
          trip_id: newTrip.id,
          city_name: stop.city_name,
          country: stop.country,
          arrival_date: stop.arrival_date,
          departure_date: stop.departure_date,
          order_index: stop.order_index
        }]).select().single();

        if (stopErr) throw stopErr;

        // 3. Insert activities for this stop
        const stopActivities = activities.filter(a => a.stop_id === stop.id);
        if (stopActivities.length > 0) {
          const { error: actErr } = await supabase.from('activities').insert(
            stopActivities.map(a => ({
              stop_id: newStop.id,
              day_date: a.day_date,
              name: a.name,
              category: a.category,
              start_time: a.start_time,
              duration_hours: a.duration_hours,
              estimated_cost: a.estimated_cost,
              notes: a.notes
            }))
          );
          if (actErr) throw actErr;
        }
      }

      onCopySuccess();
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Failed to copy trip.', type: 'error' } }));
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#1D9E75] to-[#0d7a5a] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
      <div className="text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Love this itinerary?</h3>
        <p className="text-white/80 text-sm sm:text-base">Copy it to your trips and make it your own.</p>
      </div>
      <button 
        onClick={handleCopy}
        disabled={copying}
        className="bg-white text-[#1D9E75] font-black px-8 py-3.5 rounded-full shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-70"
      >
        {copying ? <Loader2 size={20} className="animate-spin" /> : <Copy size={20} />}
        {viewer ? (copying ? 'Copying...' : 'Copy This Trip') : 'Sign up to copy trip'}
      </button>
    </div>
  );
}
