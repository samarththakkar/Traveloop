import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import TripCard from '../components/TripCard';
import { Map, Calendar, Building2, Wallet, Bell, Plus } from 'lucide-react';

const destinations = [
  { city: 'Paris', country: 'France', gradient: 'from-[#E8593C] to-[#ff7e5f]' },
  { city: 'Tokyo', country: 'Japan', gradient: 'from-[#1A1A2E] to-[#4a4a8a]' },
  { city: 'Bali', country: 'Indonesia', gradient: 'from-[#1D9E75] to-[#45b89a]' },
  { city: 'New York', country: 'USA', gradient: 'from-[#4285F4] to-[#6ba3f7]' },
  { city: 'Dubai', country: 'UAE', gradient: 'from-[#c44329] to-[#E8593C]' },
  { city: 'Rome', country: 'Italy', gradient: 'from-[#0d7a5a] to-[#1D9E75]' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function SkeletonCard() {
  return (
    <div className="w-[240px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-[#F5EFE6] overflow-hidden">
      <div className="h-24 bg-[#F5EFE6] animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#F5EFE6] rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-[#F5EFE6] rounded-full w-1/2 animate-pulse" />
        <div className="h-3 bg-[#F5EFE6] rounded-full w-1/3 animate-pulse" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0">
        {loading ? (
          <>
            <div className="h-6 bg-[#F5EFE6] rounded-full w-12 animate-pulse mb-1" />
            <div className="h-3 bg-[#F5EFE6] rounded-full w-20 animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-[#1A1A2E] leading-tight">{value}</p>
            <p className="text-xs text-[#6B6B7B] font-medium">{label}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);

      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('start_date', { ascending: true });

        if (!error && data) {
          setTrips(data);
        }
      } catch (err) {
        console.error('Failed to fetch trips:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [navigate]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler';
  const initials = firstName[0]?.toUpperCase() || 'T';

  const totalTrips = trips.length;
  const upcomingTrips = trips.filter(t => t.start_date && new Date(t.start_date) > new Date());
  const uniqueCities = new Set(trips.flatMap(t => Array.isArray(t.cities) ? t.cities : [])).size;
  const totalBudget = trips.reduce((sum, t) => sum + (Number(t.estimated_budget) || 0), 0);

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans animate-fade-in">
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="md:ml-[240px] pb-24 md:pb-8">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] tracking-tight">
                {getGreeting()}, {firstName} 👋
              </h2>
              <p className="text-sm text-[#6B6B7B] font-medium mt-0.5">Here's your travel overview</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] hover:border-[#1D9E75] transition-all">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8593C] rounded-full border-2 border-[#FDF8F3]" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 sm:px-8 py-6 space-y-8">

          {/* Section 1 — Quick Stats */}
          <section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Map} label="Total Trips" value={totalTrips} color="bg-[#1D9E75]" loading={loading} />
              <StatCard icon={Calendar} label="Upcoming" value={upcomingTrips.length} color="bg-[#4285F4]" loading={loading} />
              <StatCard icon={Building2} label="Cities Planned" value={uniqueCities} color="bg-[#E8593C]" loading={loading} />
              <StatCard icon={Wallet} label="Total Budget" value={`₹${totalBudget.toLocaleString('en-IN')}`} color="bg-[#1A1A2E]" loading={loading} />
            </div>
          </section>

          {/* Section 2 — Upcoming Trips */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1A1A2E]">Upcoming Trips</h3>
              <Link to="/trips" className="text-sm font-semibold text-[#1D9E75] hover:underline underline-offset-4">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : upcomingTrips.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {upcomingTrips.slice(0, 6).map((trip, i) => (
                  <TripCard key={trip.id} trip={trip} index={i} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#F5EFE6] p-10 flex flex-col items-center justify-center text-center">
                {/* SVG Plane Doodle */}
                <svg className="w-20 h-20 text-[#E8E0D5] mb-4" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M58 6L28 36" />
                  <path d="M58 6L38 58L28 36L6 26L58 6Z" />
                  <path d="M28 36L38 46" />
                  <circle cx="14" cy="50" r="2" fill="currentColor" />
                  <circle cx="20" cy="54" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="56" r="1" fill="currentColor" />
                </svg>
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-1">No trips planned yet</h4>
                <p className="text-sm text-[#6B6B7B] mb-5">Start planning your next adventure!</p>
                <button
                  onClick={() => navigate('/create-trip')}
                  className="inline-flex items-center gap-2 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold px-6 py-3 rounded-full transition-all active:scale-[0.98] shadow-lg shadow-[#1D9E75]/20"
                >
                  <Plus size={18} />
                  Plan New Trip
                </button>
              </div>
            )}
          </section>

          {/* Section 3 — Plan New Trip CTA Banner */}
          <section>
            <div className="relative bg-gradient-to-r from-[#1D9E75] to-[#0d7a5a] rounded-2xl p-6 sm:p-8 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute right-20 -bottom-8 w-28 h-28 rounded-full bg-white/5" />
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10 hidden sm:block" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M58 6L28 36" />
                <path d="M58 6L38 58L28 36L6 26L58 6Z" />
              </svg>

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Ready for your next adventure?</h3>
                  <p className="text-white/80 text-sm font-medium">Start planning your trip in minutes</p>
                </div>
                <button
                  onClick={() => navigate('/create-trip')}
                  className="bg-white text-[#1D9E75] font-bold px-6 py-3 rounded-full hover:bg-[#FDF8F3] transition-all active:scale-[0.98] shadow-lg flex-shrink-0"
                >
                  Plan New Trip
                </button>
              </div>
            </div>
          </section>

          {/* Section 4 — Recommended Destinations */}
          <section>
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Explore Popular Destinations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((dest) => (
                <div
                  key={dest.city}
                  className={`relative bg-gradient-to-br ${dest.gradient} rounded-2xl p-6 aspect-[4/3] sm:aspect-[3/2] flex flex-col justify-end overflow-hidden group cursor-pointer hover:scale-[1.03] transition-all duration-200 shadow-sm hover:shadow-xl`}
                >
                  {/* Decorative circles */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />
                  <div className="absolute right-12 top-8 w-12 h-12 rounded-full bg-white/5" />

                  {/* City-specific SVG icon */}
                  <svg className="absolute right-5 top-5 w-10 h-10 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold text-white leading-tight">{dest.city}</h4>
                    <p className="text-white/70 text-sm font-medium mt-0.5">{dest.country}</p>
                    <button className="mt-3 border border-white/40 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-white hover:text-[#1A1A2E] transition-all">
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
