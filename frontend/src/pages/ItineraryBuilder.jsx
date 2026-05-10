import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import StopCard from '../components/StopCard';
import AddStopForm from '../components/AddStopForm';
import ActivityCard from '../components/ActivityCard';
import AddActivityForm from '../components/AddActivityForm';
import Toast from '../components/Toast';
import { ChevronLeft, Plus, Eye } from 'lucide-react';

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtShort(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getDays(arrival, departure) {
  if (!arrival || !departure) return [];
  const days = [];
  const start = new Date(arrival);
  const end = new Date(departure);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d).toISOString().split('T')[0]);
  }
  if (days.length === 0) days.push(arrival);
  return days;
}

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [loadingStop, setLoadingStop] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [toast, setToast] = useState(null);
  const saveTimer = useRef(null);

  // Init
  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { navigate('/'); return; }
      setUser(u);

      const { data: tripData } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (tripData) setTrip(tripData);

      const { data: stopsData } = await supabase.from('stops').select('*').eq('trip_id', tripId).order('order_index');
      if (stopsData && stopsData.length > 0) {
        setStops(stopsData);
        setSelectedStopId(stopsData[0].id);
      }
    }
    init();
  }, [tripId, navigate]);

  // Fetch activities when stop changes
  useEffect(() => {
    if (!selectedStopId) { setActivities([]); return; }
    async function fetch() {
      const { data } = await supabase.from('activities').select('*').eq('stop_id', selectedStopId).order('start_time');
      setActivities(data || []);
    }
    fetch();
  }, [selectedStopId]);

  // Set default day when stop changes
  const selectedStop = stops.find(s => s.id === selectedStopId);
  const days = selectedStop ? getDays(selectedStop.arrival_date, selectedStop.departure_date) : [];
  useEffect(() => {
    if (days.length > 0 && (!selectedDay || !days.includes(selectedDay))) {
      setSelectedDay(days[0]);
    }
  }, [selectedStopId, days.length]);

  const dayActivities = activities.filter(a => a.day_date === selectedDay);
  const dayTotalCost = dayActivities.reduce((s, a) => s + (Number(a.estimated_cost) || 0), 0);
  const dayTotalHours = dayActivities.reduce((s, a) => s + (Number(a.duration_hours) || 0), 0);

  // Add stop
  const handleAddStop = async (stopData) => {
    setLoadingStop(true);
    try {
      const { data, error } = await supabase.from('stops').insert([{
        trip_id: tripId, ...stopData, order_index: stops.length,
      }]).select();
      if (error) throw error;
      const newStop = data[0];
      setStops(prev => [...prev, newStop]);
      setSelectedStopId(newStop.id);
      setShowAddStop(false);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally { setLoadingStop(false); }
  };

  // Delete stop
  const handleDeleteStop = async (stopId) => {
    try {
      await supabase.from('activities').delete().eq('stop_id', stopId);
      await supabase.from('stops').delete().eq('id', stopId);
      setStops(prev => prev.filter(s => s.id !== stopId));
      if (selectedStopId === stopId) {
        const remaining = stops.filter(s => s.id !== stopId);
        setSelectedStopId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) { setToast({ message: err.message, type: 'error' }); }
  };

  // Reorder stops
  const handleMoveStop = async (index, direction) => {
    const newStops = [...stops];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= newStops.length) return;
    [newStops[index], newStops[swapIdx]] = [newStops[swapIdx], newStops[index]];
    newStops.forEach((s, i) => { s.order_index = i; });
    setStops(newStops);
    for (const s of newStops) {
      await supabase.from('stops').update({ order_index: s.order_index }).eq('id', s.id);
    }
  };

  // Add activity
  const handleAddActivity = async (actData) => {
    setLoadingActivity(true);
    try {
      const { data, error } = await supabase.from('activities').insert([{ stop_id: selectedStopId, ...actData }]).select();
      if (error) throw error;
      setActivities(prev => [...prev, data[0]].sort((a, b) => (a.start_time || '').localeCompare(b.start_time || '')));
      setShowAddActivity(false);
    } catch (err) { setToast({ message: err.message, type: 'error' }); }
    finally { setLoadingActivity(false); }
  };

  // Auto-save activity
  const handleUpdateActivity = useCallback((updated) => {
    setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSaveStatus('Saving...');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const { id, ...fields } = updated;
      await supabase.from('activities').update(fields).eq('id', id);
      setSaveStatus('Saved ✓');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 600);
  }, []);

  // Delete activity
  const handleDeleteActivity = async (actId) => {
    await supabase.from('activities').delete().eq('id', actId);
    setActivities(prev => prev.filter(a => a.id !== actId));
  };

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Traveler';

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans animate-fade-in">
      <Sidebar user={user} />
      <main className="md:ml-[240px] pb-24 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => navigate('/trips')} className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] hover:border-[#1D9E75] transition-all flex-shrink-0"><ChevronLeft size={20} /></button>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-[#1A1A2E] truncate">{trip?.name || 'Loading...'}</h2>
                {trip && <p className="text-xs text-[#6B6B7B] font-medium">{fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {saveStatus && <span className="text-xs font-semibold text-[#1D9E75] hidden sm:block">{saveStatus}</span>}
              <Link to={`/trips/${tripId}/view`} className="hidden sm:flex items-center gap-1.5 border-2 border-[#1D9E75] text-[#1D9E75] font-bold text-sm px-4 py-2 rounded-full hover:bg-[#1D9E75] hover:text-white transition-all">
                <Eye size={16} /> View Itinerary
              </Link>
            </div>
          </div>
        </header>

        {/* Two-panel layout */}
        <div className="flex flex-col md:flex-row">
          {/* LEFT PANEL — Stops */}
          <div className="w-full md:w-[360px] md:min-h-[calc(100vh-73px)] md:border-r border-[#E8E0D5] bg-white/50 flex-shrink-0">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#1A1A2E]">Trip Stops</h3>
                  <span className="text-[10px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded-full">{stops.length} stops</span>
                </div>
                <button onClick={() => setShowAddStop(!showAddStop)} className="flex items-center gap-1 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-xs px-3 py-2 rounded-full transition-all">
                  <Plus size={14} /> Add Stop
                </button>
              </div>

              {showAddStop && <AddStopForm onAdd={handleAddStop} onCancel={() => setShowAddStop(false)} loading={loadingStop} />}

              <div className="space-y-3">
                {stops.map((stop, i) => (
                  <StopCard
                    key={stop.id}
                    stop={stop}
                    index={i}
                    isSelected={stop.id === selectedStopId}
                    activityCount={activities.filter(a => a.stop_id === stop.id).length}
                    onSelect={() => setSelectedStopId(stop.id)}
                    onDelete={() => handleDeleteStop(stop.id)}
                    onMoveUp={() => handleMoveStop(i, -1)}
                    onMoveDown={() => handleMoveStop(i, 1)}
                    isFirst={i === 0}
                    isLast={i === stops.length - 1}
                  />
                ))}
              </div>

              {stops.length === 0 && !showAddStop && (
                <div className="text-center py-10">
                  <p className="text-sm text-[#6B6B7B] font-medium">No stops yet. Add your first destination!</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL — Activities */}
          <div className="flex-1 flex flex-col min-h-[calc(100vh-73px)]">
            {selectedStop ? (
              <>
                {/* Stop header + day tabs */}
                <div className="px-6 pt-5 pb-3 border-b border-[#F5EFE6]">
                  <h3 className="text-xl font-bold text-[#1A1A2E]">{selectedStop.city_name}</h3>
                  <p className="text-xs text-[#6B6B7B] font-medium">{fmtShort(selectedStop.arrival_date)} – {fmtShort(selectedStop.departure_date)}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {days.map((day, i) => (
                      <button
                        key={day}
                        onClick={() => { setSelectedDay(day); setShowAddActivity(false); }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                          selectedDay === day
                            ? 'bg-[#1D9E75] text-white shadow-sm'
                            : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'
                        }`}
                      >
                        Day {i + 1}
                        <span className="block text-[10px] font-medium opacity-80">{fmtShort(day)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activities list */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {dayActivities.length > 0 ? (
                    dayActivities.map(act => (
                      <ActivityCard key={act.id} activity={act} onUpdate={handleUpdateActivity} onDelete={() => handleDeleteActivity(act.id)} />
                    ))
                  ) : !showAddActivity ? (
                    <div className="text-center py-16">
                      <p className="text-sm text-[#6B6B7B] font-medium">No activities yet for this day. Add your first one!</p>
                    </div>
                  ) : null}

                  {showAddActivity ? (
                    <AddActivityForm dayDate={selectedDay} onAdd={handleAddActivity} onCancel={() => setShowAddActivity(false)} loading={loadingActivity} />
                  ) : (
                    <button onClick={() => setShowAddActivity(true)} className="w-full border-2 border-dashed border-[#E8E0D5] rounded-xl py-4 text-sm font-bold text-[#6B6B7B] hover:border-[#1D9E75] hover:text-[#1D9E75] hover:bg-[#1D9E75]/5 transition-all flex items-center justify-center gap-2 mt-2">
                      <Plus size={16} /> Add Activity
                    </button>
                  )}
                </div>

                {/* Day Summary Bar */}
                <div className="sticky bottom-0 bg-white border-t border-[#E8E0D5] px-6 py-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1A1A2E]">
                    {dayActivities.length} activit{dayActivities.length === 1 ? 'y' : 'ies'} · {dayTotalHours} hrs · ₹{dayTotalCost.toLocaleString('en-IN')} est.
                  </p>
                  {saveStatus && <span className="text-xs font-semibold text-[#1D9E75] sm:hidden">{saveStatus}</span>}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <svg className="w-20 h-20 text-[#E8E0D5] mb-4" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="32" cy="28" r="8" /><path d="M32 4C20 4 12 14 12 28c0 16 20 32 20 32s20-16 20-32C52 14 44 4 32 4z" />
                </svg>
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-1">Select a stop</h4>
                <p className="text-sm text-[#6B6B7B]">Choose a stop from the left to start planning activities</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
