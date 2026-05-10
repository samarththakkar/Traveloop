import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import TripSummaryCard from '../components/TripSummaryCard';
import TimelineView from '../components/TimelineView';
import CalendarView from '../components/CalendarView';
import ListView from '../components/ListView';
import Toast from '../components/Toast';
import { ChevronLeft, Share2, Download, Pencil, Plus } from 'lucide-react';

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const viewTabs = ['Timeline', 'Calendar', 'List'];

export default function ItineraryView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('Timeline');
  const [toast, setToast] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      const { data: tripData } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (!tripData) { navigate('/trips'); return; }
      if (tripData.visibility === 'private' && (!u || u.id !== tripData.user_id)) {
        setTrip({ private: true });
        setLoading(false);
        return;
      }
      setTrip(tripData);
      setIsOwner(u && u.id === tripData.user_id);

      const { data: stopsData } = await supabase.from('stops').select('*').eq('trip_id', tripId).order('order_index');
      setStops(stopsData || []);

      if (stopsData && stopsData.length > 0) {
        const ids = stopsData.map(s => s.id);
        const { data: actsData } = await supabase.from('activities').select('*').in('stop_id', ids).order('day_date').order('start_time');
        setActivities(actsData || []);
      }
      setLoading(false);
    }
    init();
  }, [tripId, navigate]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast({ message: 'Link copied to clipboard! 🔗', type: 'success' });
    } catch { setToast({ message: 'Failed to copy link', type: 'error' }); }
  };

  const handleExport = () => {
    setToast({ message: 'PDF export coming soon!', type: 'success' });
  };

  // Private trip guard
  if (trip?.private) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center justify-center p-8 font-sans">
        <div className="w-16 h-16 rounded-full bg-[#E8593C]/10 flex items-center justify-center mb-4"><span className="text-2xl">🔒</span></div>
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">This itinerary is private</h2>
        <p className="text-sm text-[#6B6B7B] mb-6">You don't have permission to view this trip.</p>
        <button onClick={() => navigate('/trips')} className="bg-[#1D9E75] text-white font-bold px-6 py-3 rounded-full transition-all hover:bg-[#158562]">Go Back</button>
      </div>
    );
  }

  const totalDays = trip?.start_date && trip?.end_date ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 864e5) : 0;
  const totalCost = activities.reduce((s, a) => s + (Number(a.estimated_cost) || 0), 0);
  const cur = trip?.currency === 'USD' ? '$' : trip?.currency === 'EUR' ? '€' : '₹';
  const initials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T';

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans animate-fade-in">
      <Sidebar user={user} />
      <main className="md:ml-[240px] pb-24 md:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => navigate(`/trips/${tripId}/itinerary`)} className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] hover:border-[#1D9E75] transition-all flex-shrink-0"><ChevronLeft size={20} /></button>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-[#1A1A2E] truncate">{trip?.name || 'Loading...'}</h2>
                {trip && <p className="text-xs text-[#6B6B7B] font-medium">{fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}</p>}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{initials}</div>
          </div>
        </header>

        <div className="max-w-[900px] mx-auto px-6 sm:px-8 py-6 space-y-6">
          {/* Meta pills + action buttons */}
          {trip && !loading && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold bg-[#F5EFE6] text-[#6B6B7B] px-3 py-1.5 rounded-full">📍 {stops.length} cities</span>
                <span className="text-xs font-bold bg-[#F5EFE6] text-[#6B6B7B] px-3 py-1.5 rounded-full">🗓️ {totalDays} days</span>
                <span className="text-xs font-bold bg-[#F5EFE6] text-[#6B6B7B] px-3 py-1.5 rounded-full">💰 {cur}{totalCost.toLocaleString('en-IN')}</span>
                <span className="text-xs font-bold bg-[#F5EFE6] text-[#6B6B7B] px-3 py-1.5 rounded-full">{trip.visibility === 'public' ? '🌍 Public' : '🔒 Private'}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {isOwner && <Link to={`/trips/${tripId}/itinerary`} className="flex items-center gap-1 border-2 border-[#1D9E75] text-[#1D9E75] font-bold text-xs px-3 py-2 rounded-full hover:bg-[#1D9E75] hover:text-white transition-all"><Pencil size={14} /> Edit</Link>}
                <button onClick={handleShare} className="flex items-center gap-1 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-xs px-3 py-2 rounded-full transition-all"><Share2 size={14} /> Share</button>
                <button onClick={handleExport} className="flex items-center gap-1 border-2 border-[#E8E0D5] text-[#6B6B7B] font-bold text-xs px-3 py-2 rounded-full hover:bg-[#F5EFE6] transition-all"><Download size={14} /> PDF</button>
              </div>
            </div>
          )}

          {/* Summary Card */}
          {trip && !loading && <TripSummaryCard stops={stops} activities={activities} trip={trip} />}

          {/* View Toggle */}
          {!loading && (
            <div className="flex gap-2">
              {viewTabs.map(tab => (
                <button key={tab} onClick={() => setActiveView(tab)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeView === tab ? 'bg-[#1D9E75] text-white shadow-sm' : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'}`}>{tab}</button>
              ))}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-[#F5EFE6]" />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && stops.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="w-20 h-20 text-[#E8E0D5] mb-4" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="32" cy="28" r="8" /><path d="M32 4C20 4 12 14 12 28c0 16 20 32 20 32s20-16 20-32C52 14 44 4 32 4z" /></svg>
              <h4 className="text-lg font-bold text-[#1A1A2E] mb-1">No stops added yet</h4>
              <p className="text-sm text-[#6B6B7B] mb-5">Start building your itinerary</p>
              {isOwner && <Link to={`/trips/${tripId}/itinerary`} className="inline-flex items-center gap-2 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg"><Plus size={18} /> Build Itinerary</Link>}
            </div>
          )}

          {/* Views */}
          {!loading && stops.length > 0 && (
            <div>
              {activeView === 'Timeline' && <TimelineView stops={stops} activities={activities} trip={trip} />}
              {activeView === 'Calendar' && <CalendarView stops={stops} activities={activities} trip={trip} />}
              {activeView === 'List' && <ListView stops={stops} activities={activities} trip={trip} />}
            </div>
          )}
        </div>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
