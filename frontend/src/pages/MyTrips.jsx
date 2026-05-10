import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import DeleteModal from '../components/DeleteModal';
import Toast from '../components/Toast';
import { Search, LayoutGrid, List, Plus, CalendarDays, MapPin, Wallet, Eye, Pencil, Trash2, Bell } from 'lucide-react';

const themes = [
  { from: '#1D9E75', to: '#0d7a5a' },
  { from: '#E8593C', to: '#c93e24' },
  { from: '#4F46E5', to: '#7C3AED' },
  { from: '#F59E0B', to: '#D97706' },
  { from: '#0EA5E9', to: '#0284C7' },
  { from: '#1A1A2E', to: '#3D3D5C' },
];

const statusStyles = {
  upcoming: 'bg-[#DCFCE7] text-[#16A34A]',
  planning: 'bg-[#FEF9C3] text-[#CA8A04]',
  completed: 'bg-[#F1F5F9] text-[#64748B]',
  ongoing: 'bg-[#DBEAFE] text-[#2563EB]',
};

const filterTabs = ['All', 'Upcoming', 'Completed', 'Planning'];

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTripStatus(trip) {
  if (trip.status) return trip.status;
  if (trip.start_date && new Date(trip.start_date) > new Date()) return 'upcoming';
  return 'planning';
}

function SkeletonGrid() {
  return [1, 2, 3].map(i => (
    <div key={i} className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] overflow-hidden">
      <div className="h-[120px] bg-[#F5EFE6] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-[#F5EFE6] rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-[#F5EFE6] rounded-full w-1/2 animate-pulse" />
        <div className="h-3 bg-[#F5EFE6] rounded-full w-1/3 animate-pulse" />
        <div className="h-3 bg-[#F5EFE6] rounded-full w-2/5 animate-pulse" />
      </div>
      <div className="border-t border-[#F5EFE6] px-5 py-3 flex justify-end gap-2">
        <div className="w-8 h-8 bg-[#F5EFE6] rounded-lg animate-pulse" />
        <div className="w-8 h-8 bg-[#F5EFE6] rounded-lg animate-pulse" />
        <div className="w-8 h-8 bg-[#F5EFE6] rounded-lg animate-pulse" />
      </div>
    </div>
  ));
}

function EmptyState({ hasTrips, activeFilter, searchQuery, onCreateTrip }) {
  let subtitle = 'Start your first adventure!';
  if (hasTrips && searchQuery) subtitle = 'No trips match your search';
  else if (hasTrips && activeFilter !== 'All') subtitle = 'No trips match this filter';
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg className="w-24 h-24 text-[#E8E0D5] mb-6" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 6L28 36" /><path d="M58 6L38 58L28 36L6 26L58 6Z" /><path d="M28 36L38 46" />
        <circle cx="14" cy="50" r="2" fill="currentColor" /><circle cx="20" cy="54" r="1.5" fill="currentColor" /><circle cx="10" cy="56" r="1" fill="currentColor" />
        <path d="M30 52c4-2 8-2 12 0" strokeDasharray="2 3" />
      </svg>
      <h4 className="text-xl font-bold text-[#1A1A2E] mb-1">No trips found</h4>
      <p className="text-sm text-[#6B6B7B] mb-6">{subtitle}</p>
      {!hasTrips && (
        <button onClick={onCreateTrip} className="inline-flex items-center gap-2 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg shadow-[#1D9E75]/20 active:scale-[0.98]">
          <Plus size={18} /> Plan New Trip
        </button>
      )}
    </div>
  );
}

export default function MyTrips() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('tripsView') || 'grid');
  const [deleteTrip, setDeleteTrip] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { navigate('/'); return; }
      setUser(u);
      const { data, error } = await supabase.from('trips').select('*').eq('user_id', u.id).order('created_at', { ascending: false });
      if (!error && data) setTrips(data);
      setLoading(false);
    }
    init();
  }, [navigate]);

  useEffect(() => { localStorage.setItem('tripsView', viewMode); }, [viewMode]);

  const filtered = useMemo(() => {
    let result = trips;
    if (activeFilter !== 'All') {
      result = result.filter(t => getTripStatus(t).toLowerCase() === activeFilter.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => (t.name || '').toLowerCase().includes(q));
    }
    return result;
  }, [trips, activeFilter, searchQuery]);

  const handleDelete = useCallback(async () => {
    if (!deleteTrip) return;
    try {
      const { error } = await supabase.from('trips').delete().eq('id', deleteTrip.id);
      if (error) throw error;
      setTrips(prev => prev.filter(t => t.id !== deleteTrip.id));
      setToast({ message: 'Trip deleted successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setDeleteTrip(null);
    }
  }, [deleteTrip]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler';
  const initials = firstName[0]?.toUpperCase() || 'T';

  const renderGridCard = (trip, i) => {
    const theme = themes[(trip.theme_color || 0) % themes.length];
    const status = getTripStatus(trip);
    const cities = Array.isArray(trip.cities) ? trip.cities.length : (trip.cities || 0);
    const dur = trip.start_date && trip.end_date ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 864e5) : null;
    return (
      <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group" style={{ animation: `fadeIn 0.4s ease-out ${i * 0.06}s both` }}>
        <div className="h-[120px] relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}>
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute right-8 bottom-2 w-10 h-10 rounded-full bg-white/10" />
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {trip.visibility === 'public' ? '🌍 Public' : '🔒 Private'}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-2.5">
          <h3 className="font-bold text-lg text-[#1A1A2E] truncate group-hover:text-[#1D9E75] transition-colors">{trip.name || 'Untitled Trip'}</h3>
          {trip.start_date && (
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B7B] font-medium">
              <CalendarDays size={14} /> {fmtDate(trip.start_date)}{trip.end_date ? ` – ${fmtDate(trip.end_date)}` : ''}
            </div>
          )}
          {dur && <span className="inline-block text-[11px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] px-2.5 py-0.5 rounded-full">{dur} days</span>}
          {cities > 0 && <div className="flex items-center gap-1.5 text-xs text-[#6B6B7B] font-medium"><MapPin size={14} /> {cities} {cities === 1 ? 'city' : 'cities'}</div>}
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B7B] font-medium">
            <Wallet size={14} /> {trip.estimated_budget ? `${trip.currency === 'USD' ? '$' : trip.currency === 'EUR' ? '€' : '₹'}${Number(trip.estimated_budget).toLocaleString('en-IN')}` : 'Not set'}
          </div>
          <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${statusStyles[status] || statusStyles.planning}`}>{status}</span>
        </div>
        <div className="border-t border-[#F5EFE6] px-5 py-3 flex justify-end gap-1.5">
          <button onClick={() => navigate(`/trips/${trip.id}`)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-all" title="View"><Eye size={16} /></button>
          <button onClick={() => navigate(`/trips/${trip.id}/edit`)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-all" title="Edit"><Pencil size={16} /></button>
          <button onClick={() => setDeleteTrip(trip)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:text-[#E8593C] hover:bg-[#E8593C]/10 transition-all" title="Delete"><Trash2 size={16} /></button>
        </div>
      </div>
    );
  };

  const renderListRow = (trip, i) => {
    const theme = themes[(trip.theme_color || 0) % themes.length];
    const status = getTripStatus(trip);
    const cities = Array.isArray(trip.cities) ? trip.cities.length : (trip.cities || 0);
    return (
      <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-[#F5EFE6] px-5 py-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group" style={{ animation: `fadeIn 0.4s ease-out ${i * 0.06}s both` }}>
        <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1A1A2E] truncate group-hover:text-[#1D9E75] transition-colors">{trip.name || 'Untitled'}</h3>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {trip.start_date && <span className="text-xs text-[#6B6B7B] font-medium">{fmtDate(trip.start_date)}{trip.end_date ? ` – ${fmtDate(trip.end_date)}` : ''}</span>}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusStyles[status] || statusStyles.planning}`}>{status}</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-[#6B6B7B] font-medium flex-shrink-0">
          {cities > 0 && <span>{cities} cities</span>}
          <span>{trip.estimated_budget ? `${trip.currency === 'USD' ? '$' : trip.currency === 'EUR' ? '€' : '₹'}${Number(trip.estimated_budget).toLocaleString('en-IN')}` : '—'}</span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => navigate(`/trips/${trip.id}`)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-all"><Eye size={16} /></button>
          <button onClick={() => navigate(`/trips/${trip.id}/edit`)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-all"><Pencil size={16} /></button>
          <button onClick={() => setDeleteTrip(trip)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:text-[#E8593C] hover:bg-[#E8593C]/10 transition-all"><Trash2 size={16} /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans">
      <Sidebar user={user} />
      <main className="md:ml-[240px] pb-24 md:pb-8 animate-fade-in">
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] tracking-tight">{getGreeting()}, {firstName} 👋</h2>
              <p className="text-sm text-[#6B6B7B] font-medium mt-0.5">Here's your travel overview</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] transition-all"><Bell size={20} /><span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8593C] rounded-full border-2 border-[#FDF8F3]" /></button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold">{initials}</div>
            </div>
          </div>
        </header>

        <div className="px-6 sm:px-8 py-6 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] tracking-tight">My Trips 🗺️</h1>
            <p className="text-sm text-[#6B6B7B] font-medium mt-1">All your adventures, in one place</p>
          </div>

          {/* Filter / Search / View Toggle Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filterTabs.map(tab => (
                <button key={tab} onClick={() => setActiveFilter(tab)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeFilter === tab ? 'bg-[#1D9E75] text-white shadow-sm' : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'}`}>{tab}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-52">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search trips..." className="w-full bg-white border border-[#E8E0D5] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1A1A2E] placeholder-[#6B6B7B]/60 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] transition-all" />
              </div>
              <button onClick={() => setViewMode('grid')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-[#1D9E75] text-white' : 'bg-white border border-[#E8E0D5] text-[#6B6B7B] hover:text-[#1A1A2E]'}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-[#1D9E75] text-white' : 'bg-white border border-[#E8E0D5] text-[#6B6B7B] hover:text-[#1A1A2E]'}`}><List size={16} /></button>
              <button onClick={() => navigate('/create-trip')} className="hidden sm:flex items-center gap-1.5 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-sm px-4 py-2.5 rounded-full transition-all shadow-sm active:scale-[0.98]"><Plus size={16} /> New Trip</button>
            </div>
          </div>

          {/* Mobile New Trip button */}
          <button onClick={() => navigate('/create-trip')} className="sm:hidden flex items-center justify-center gap-1.5 w-full bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-sm py-3 rounded-full transition-all shadow-sm active:scale-[0.98]"><Plus size={16} /> New Trip</button>

          {/* Trip Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{SkeletonGrid()}</div>
          ) : filtered.length === 0 ? (
            <EmptyState hasTrips={trips.length > 0} activeFilter={activeFilter} searchQuery={searchQuery} onCreateTrip={() => navigate('/create-trip')} />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t, i) => renderGridCard(t, i))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((t, i) => renderListRow(t, i))}
            </div>
          )}
        </div>
      </main>

      {deleteTrip && <DeleteModal tripName={deleteTrip.name || 'Untitled Trip'} onCancel={() => setDeleteTrip(null)} onConfirm={handleDelete} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
