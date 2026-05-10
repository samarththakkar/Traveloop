import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PublicNavbar from '../components/PublicNavbar';
import ShareButtons from '../components/ShareButtons';
import CopyTripBanner from '../components/CopyTripBanner';
import ReadOnlyTimeline from '../components/ReadOnlyTimeline';
import Toast from '../components/Toast';
import { 
  CalendarDays, MapPin, User, Compass, Lock, 
  Search, ShieldCheck, Zap, ArrowRight, Loader2 
} from 'lucide-react';

const THEME_GRADIENTS = [
  'from-[#1D9E75] to-[#1A1A2E]',
  'from-[#E8593C] to-[#1A1A2E]',
  'from-[#3B82F6] to-[#1A1A2E]',
  'from-[#8B5CF6] to-[#1A1A2E]',
  'from-[#F59E0B] to-[#1A1A2E]',
  'from-[#10B981] to-[#1A1A2E]',
];

export default function SharedItinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [creator, setCreator] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      const { data: tripData, error: tripErr } = await supabase.from('trips').select('*').eq('id', tripId).single();
      
      if (tripErr || !tripData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setTrip(tripData);

      // Fetch creator name
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', tripData.user_id).single();
      setCreator(profile);

      // Fetch stops & activities
      const { data: stopsData } = await supabase.from('stops').select('*').eq('trip_id', tripId).order('order_index');
      setStops(stopsData || []);

      if (stopsData?.length > 0) {
        const stopIds = stopsData.map(s => s.id);
        const { data: actsData } = await supabase.from('activities').select('*').in('stop_id', stopIds).order('day_date');
        setActivities(actsData || []);
      }

      // SEO Meta Tags
      document.title = `${tripData.name} — Traveloop`;
      
      setLoading(false);
    }
    fetchData();
  }, [tripId]);

  const stats = useMemo(() => {
    if (!trip) return null;
    const duration = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)) + 1;
    return {
      cities: stops.length,
      duration: `${duration} days`,
      activities: activities.length,
      budget: trip.estimated_budget ? `₹${trip.estimated_budget.toLocaleString('en-IN')}` : null
    };
  }, [trip, stops, activities]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#1D9E75] mb-4" />
        <p className="text-sm font-bold text-[#6B6B7B] animate-pulse">Loading adventure...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-48 h-48 text-[#E8E0D5] mb-8 animate-float">
          <Search size={192} />
        </div>
        <h1 className="text-3xl font-black text-[#1A1A2E] mb-3">Trip not found 🧭</h1>
        <p className="text-[#6B6B7B] mb-8 max-w-md">This trip may have been deleted or the link is invalid. Check the URL and try again.</p>
        <Link to="/" className="bg-[#1D9E75] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#158562] transition-all">Go to Homepage</Link>
      </div>
    );
  }

  const isOwner = user?.id === trip.user_id;
  const isPrivate = trip.visibility === 'private' && !isOwner;

  if (isPrivate) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 text-[#6B6B7B]">
          <Lock size={48} />
        </div>
        <h1 className="text-3xl font-black text-[#1A1A2E] mb-3">This itinerary is private</h1>
        <p className="text-[#6B6B7B] mb-8 max-w-md">The owner hasn't made this trip public yet. Only they can view this link.</p>
        <Link to="/explore" className="bg-[#1D9E75] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#158562] transition-all">Explore public trips</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans">
      <PublicNavbar user={user} onCopyLink={() => {
        navigator.clipboard.writeText(window.location.href);
        setToast({ message: 'Link copied! 🔗', type: 'success' });
      }} />

      {/* Hero Section */}
      <div className="relative h-[280px] sm:h-[400px] mt-[60px] overflow-hidden">
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${THEME_GRADIENTS[trip.theme_color || 0]} scale-105`} 
          style={{ transform: 'translateY(var(--scroll-y, 0))' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 max-w-[860px] mx-auto w-full text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{stats.duration}</span>
            <span className="bg-[#1D9E75] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Public Trip</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 drop-shadow-xl">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><User size={12} /></div>
              <span className="text-sm font-bold">Planned by {creator?.full_name || 'Traveler'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              <span className="text-sm font-bold">
                {new Date(trip.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(trip.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-6 sm:px-8 -mt-10 relative z-20 space-y-8 pb-20">
        {/* Meta Bar */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#F5EFE6] p-6 sm:p-8 flex items-center justify-between overflow-x-auto scrollbar-hide gap-8">
          {[
            { label: 'Stops', value: `${stats.cities} cities`, icon: MapPin },
            { label: 'Duration', value: stats.duration, icon: CalendarDays },
            { label: 'Activities', value: `${stats.activities} planned`, icon: Zap },
            { label: 'Est. Budget', value: stats.budget || 'N/A', icon: Lock }
          ].map((s, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-4 min-w-fit">
              <div className="w-10 h-10 rounded-xl bg-[#FDF8F3] flex items-center justify-center text-[#1D9E75] border border-[#F5EFE6]"><s.icon size={20} /></div>
              <div>
                <p className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider">{s.label}</p>
                <p className="text-sm font-black text-[#1A1A2E]">{s.value}</p>
              </div>
              {i < 3 && <div className="hidden sm:block h-8 w-px bg-[#F5EFE6] ml-4" />}
            </div>
          ))}
        </div>

        {/* Share Bar */}
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#F5EFE6]">
          <p className="text-xs font-bold text-[#6B6B7B] uppercase tracking-widest hidden sm:block">Share this itinerary</p>
          <ShareButtons url={window.location.href} title={trip.name} />
        </div>

        {/* Copy Banner */}
        <CopyTripBanner 
          trip={trip} 
          stops={stops} 
          activities={activities} 
          viewer={user} 
          onCopySuccess={() => {
            setToast({ 
              message: 'Trip copied! View it in My Trips →', 
              type: 'success', 
              action: { label: 'View', onClick: () => navigate('/trips') } 
            });
          }} 
        />

        {/* Itinerary */}
        <div className="py-8">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-2xl font-black text-[#1A1A2E]">Trip Itinerary</h3>
            <div className="flex-1 h-px bg-[#F5EFE6]" />
          </div>
          <ReadOnlyTimeline stops={stops} activities={activities} />
        </div>

        {/* Footer CTA */}
        <div className="py-16 text-center space-y-12">
          <div>
            <h3 className="text-2xl font-black text-[#1A1A2E] mb-2">Plan your own adventure</h3>
            <p className="text-[#6B6B7B]">Join 50,000+ travelers planning with Traveloop</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'Build Itinerary', desc: 'Add cities and activities' },
              { icon: ShieldCheck, title: 'Track Budget', desc: 'Stay on top of costs' },
              { icon: Zap, title: 'AI Packing', desc: 'Smart AI-powered lists' }
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EFE6] flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF8F3] flex items-center justify-center text-[#1D9E75] mb-4"><f.icon size={24} /></div>
                <h4 className="font-bold text-[#1A1A2E] mb-2">{f.title}</h4>
                <p className="text-xs text-[#6B6B7B]">{f.desc}</p>
              </div>
            ))}
          </div>

          <Link to="/" className="inline-flex items-center gap-2 bg-[#1D9E75] text-white font-black px-10 py-4 rounded-full hover:bg-[#158562] shadow-xl shadow-[#1D9E75]/20 hover:scale-105 transition-all">
            Start planning for free <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} action={toast.action} onClose={() => setToast(null)} />}
      
      {/* Scroll Script for Parallax */}
      <style>{`
        @media print {
          nav, .share-bar, .copy-banner, .footer-cta { display: none !important; }
          body { background: white !important; }
          .max-w-[860px] { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .shadow-xl, .shadow-sm { box-shadow: none !important; border: 1px solid #eee !important; }
        }
      `}</style>
    </div>
  );
}
