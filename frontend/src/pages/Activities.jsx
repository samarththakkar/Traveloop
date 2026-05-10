import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import ActivitySearchCard from '../components/ActivitySearchCard';
import ActivityDetailModal from '../components/ActivityDetailModal';
import AddToItineraryFlow from '../components/AddToItineraryFlow';
import Toast from '../components/Toast';
import { Search, LayoutGrid, List, ChevronDown, Bell, FilterX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { icon: '🏛️', label: 'Sightseeing' },
  { icon: '🍽️', label: 'Food' },
  { icon: '🚗', label: 'Transport' },
  { icon: '🏨', label: 'Hotel' },
  { icon: '🧗', label: 'Adventure' },
  { icon: '🛍️', label: 'Shopping' },
  { icon: '🎭', label: 'Culture' },
  { icon: '🌿', label: 'Nature' },
  { icon: '💆', label: 'Wellness' },
  { icon: '🎉', label: 'Nightlife' }
];

const costRanges = ['Any Cost', 'Free', 'Under ₹500', '₹500–₹2000', '₹2000+'];
const durations = ['Any Duration', 'Under 1hr', '1–3 hrs', 'Half Day', 'Full Day'];
const sortByOptions = ['Most Popular', 'Cost: Low to High', 'Cost: High to Low', 'Duration: Short First'];

const fallbackActivities = [
  { id: 1, name: 'Eiffel Tower Summit Access', category: 'Sightseeing', city_name: 'Paris', country: 'France', description: 'Experience the best views of Paris from the top of the Iron Lady.', duration_hours: 2, cost_per_person: 2500, currency: 'INR', rating: 4.8, review_count: 1540, whats_included: ['Elevator access to summit', 'Digital guidebook'], tips: ['Book weeks in advance', 'Sunset is the best time'] },
  { id: 2, name: 'Tsukiji Outer Market Food Tour', category: 'Food', city_name: 'Tokyo', country: 'Japan', description: 'Taste the freshest sushi and local street food in Tokyo\'s famous market.', duration_hours: 3, cost_per_person: 6500, currency: 'INR', rating: 4.9, review_count: 850, whats_included: ['10+ food tastings', 'Green tea', 'Local guide'], tips: ['Come with an empty stomach', 'Wear comfortable shoes'] },
  { id: 3, name: 'Surfing Lesson at Kuta Beach', category: 'Adventure', city_name: 'Bali', country: 'Indonesia', description: 'Catch your first wave with expert instructors in the heart of Bali.', duration_hours: 2, cost_per_person: 1800, currency: 'INR', rating: 4.7, review_count: 420, whats_included: ['Surfboard rental', 'Instructor', 'Rash guard'], tips: ['Mornings have smaller waves for beginners'] },
  { id: 4, name: 'Colosseum & Roman Forum Tour', category: 'Sightseeing', city_name: 'Rome', country: 'Italy', description: 'Step back in time and explore the ruins of Ancient Rome with an expert.', duration_hours: 3, cost_per_person: 4500, currency: 'INR', rating: 4.9, review_count: 2100, whats_included: ['Skip-the-line tickets', 'Professional guide'], tips: ['Bring a water bottle', 'Wear a hat for sun protection'] },
  { id: 5, name: 'Louvre Museum Guided Tour', category: 'Culture', city_name: 'Paris', country: 'France', description: 'See the Mona Lisa and thousands of masterpieces in the world\'s largest museum.', duration_hours: 3, cost_per_person: 5500, currency: 'INR', rating: 4.8, review_count: 3200, whats_included: ['Museum entry', 'Art historian guide'], tips: ['Enter through the Carousel entrance'] },
  { id: 6, name: 'Desert Safari with Dinner', category: 'Adventure', city_name: 'Dubai', country: 'UAE', description: 'Dune bashing, camel rides, and a traditional BBQ dinner under the stars.', duration_hours: 6, cost_per_person: 4000, currency: 'INR', rating: 4.7, review_count: 1800, whats_included: ['4x4 Dune bashing', 'Dinner buffet', 'Camel ride'], tips: ['Carry a light jacket for the evening'] },
  { id: 7, name: 'Street Food Walking Tour', category: 'Food', city_name: 'Bangkok', country: 'Thailand', description: 'Explore the hidden gems of Bangkok\'s street food scene at night.', duration_hours: 3, cost_per_person: 1200, currency: 'INR', rating: 4.8, review_count: 950, whats_included: ['Variety of local dishes', 'Guide', 'Transport by Tuk-Tuk'], tips: ['Try the mango sticky rice'] },
  { id: 8, name: 'Authentic Pasta Making Class', category: 'Food', city_name: 'Rome', country: 'Italy', description: 'Learn the secrets of Italian pasta from a local chef in a cozy studio.', duration_hours: 3, cost_per_person: 6000, currency: 'INR', rating: 4.9, review_count: 640, whats_included: ['Ingredients', 'Wine', 'Full dinner'], tips: ['You get the recipes to take home'] },
  { id: 9, name: 'Traditional Kabuki Show', category: 'Culture', city_name: 'Tokyo', country: 'Japan', description: 'Witness the incredible artistry and history of Japanese Kabuki theatre.', duration_hours: 2, cost_per_person: 3500, currency: 'INR', rating: 4.6, review_count: 310, whats_included: ['Performance ticket', 'Audio guide'], tips: ['Photos are usually not allowed'] },
  { id: 10, name: 'Rice Terrace Trekking', category: 'Nature', city_name: 'Bali', country: 'Indonesia', description: 'Walk through the iconic green terraces of Tegallalang.', duration_hours: 2, cost_per_person: 500, currency: 'INR', rating: 4.7, review_count: 780, whats_included: ['Local guide'], tips: ['Wear hiking shoes', 'Bring extra water'] },
  { id: 11, name: 'Bosphorus Sunset Ferry', category: 'Nature', city_name: 'Istanbul', country: 'Turkey', description: 'Cross between Europe and Asia on a scenic sunset boat ride.', duration_hours: 1.5, cost_per_person: 800, currency: 'INR', rating: 4.8, review_count: 1100, whats_included: ['Ferry ticket', 'Audio commentary'], tips: ['Sit on the upper deck for the best views'] },
  { id: 12, name: 'Grand Bazaar Shopping Tour', category: 'Shopping', city_name: 'Istanbul', country: 'Turkey', description: 'Navigate the world\'s oldest covered market with a local expert.', duration_hours: 3, cost_per_person: 1500, currency: 'INR', rating: 4.7, review_count: 520, whats_included: ['Local guide', 'Tea/Coffee'], tips: ['Don\'t be afraid to haggle'] },
  { id: 13, name: 'Flamenco Show in Old Town', category: 'Culture', city_name: 'Barcelona', country: 'Spain', description: 'Feel the passion of Spanish Flamenco in an intimate historic setting.', duration_hours: 1.5, cost_per_person: 3000, currency: 'INR', rating: 4.8, review_count: 670, whats_included: ['Show ticket', 'One drink'], tips: ['Arrive 15 mins early for better seats'] },
  { id: 14, name: 'Borough Market Food Walk', category: 'Food', city_name: 'London', country: 'UK', description: 'Discover the best artisanal produce in London\'s most famous food market.', duration_hours: 2, cost_per_person: 4000, currency: 'INR', rating: 4.7, review_count: 890, whats_included: ['Guided walk', 'Food samples'], tips: ['Try the cheese toastie'] },
  { id: 15, name: 'Harajuku Fashion & Culture Tour', category: 'Shopping', city_name: 'Tokyo', country: 'Japan', description: 'Explore the quirky shops and vibrant street style of Takeshita Street.', duration_hours: 3, cost_per_person: 2500, currency: 'INR', rating: 4.7, review_count: 430, whats_included: ['Guided walk', 'Photo ops'], tips: ['The crepes are a must-try'] },
  { id: 16, name: 'Burj Khalifa Observation Deck', category: 'Sightseeing', city_name: 'Dubai', country: 'UAE', description: 'Stand on top of the world\'s tallest building.', duration_hours: 1.5, cost_per_person: 4500, currency: 'INR', rating: 4.6, review_count: 4500, whats_included: ['Entry ticket', 'Fast elevator'], tips: ['Level 124/125 are the standard tickets'] },
  { id: 17, name: 'Sagano Bamboo Forest Walk', category: 'Nature', city_name: 'Tokyo', country: 'Japan', description: 'Peaceful walk through the towering bamboo groves of Arashiyama.', duration_hours: 2, cost_per_person: 0, currency: 'INR', rating: 4.8, review_count: 2300, whats_included: ['Public access'], tips: ['Go very early to avoid crowds'] },
  { id: 18, name: 'Borough Market Breakfast Tour', category: 'Food', city_name: 'London', country: 'UK', description: 'The best way to start your day in London.', duration_hours: 1.5, cost_per_person: 1500, currency: 'INR', rating: 4.7, review_count: 210, whats_included: ['Samples', 'Coffee'], tips: ['Market is quieter in the mornings'] }
];

export default function Activities() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [costFilter, setCostFilter] = useState('Any Cost');
  const [durationFilter, setDurationFilter] = useState('Any Duration');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('activitiesView') || 'grid');
  
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityToAdd, setActivityToAdd] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [userCities, setUserCities] = useState(['All Cities']);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      
      // Fetch user's trip cities for the city filter
      if (u) {
        const { data: stops } = await supabase.from('stops').select('city_name').eq('trip_id', u.id); // This is just a proxy, real logic would fetch all user trips' stops
        // Actually fetch all stops for user's trips
        const { data: userTrips } = await supabase.from('trips').select('id').eq('user_id', u.id);
        if (userTrips && userTrips.length > 0) {
          const tripIds = userTrips.map(t => t.id);
          const { data: userStops } = await supabase.from('stops').select('city_name').in('trip_id', tripIds);
          if (userStops) {
            const uniqueCities = [...new Set(userStops.map(s => s.city_name))];
            setUserCities(['All Cities', ...uniqueCities]);
          }
        }
      }

      const { data, error } = await supabase.from('activities_master').select('*');
      if (!error && data && data.length > 0) {
        setActivities(data);
      } else {
        setActivities(fallbackActivities);
      }
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => { localStorage.setItem('activitiesView', viewMode); }, [viewMode]);

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.city_name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(a => a.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (cityFilter !== 'All Cities') {
      result = result.filter(a => a.city_name === cityFilter);
    }

    if (costFilter !== 'Any Cost') {
      if (costFilter === 'Free') result = result.filter(a => a.cost_per_person === 0);
      else if (costFilter === 'Under ₹500') result = result.filter(a => a.cost_per_person < 500);
      else if (costFilter === '₹500–₹2000') result = result.filter(a => a.cost_per_person >= 500 && a.cost_per_person <= 2000);
      else if (costFilter === '₹2000+') result = result.filter(a => a.cost_per_person > 2000);
    }

    if (durationFilter !== 'Any Duration') {
      if (durationFilter === 'Under 1hr') result = result.filter(a => a.duration_hours < 1);
      else if (durationFilter === '1–3 hrs') result = result.filter(a => a.duration_hours >= 1 && a.duration_hours <= 3);
      else if (durationFilter === 'Half Day') result = result.filter(a => a.duration_hours > 3 && a.duration_hours <= 6);
      else if (durationFilter === 'Full Day') result = result.filter(a => a.duration_hours > 6);
    }

    // Sort
    if (sortBy === 'Most Popular') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'Cost: Low to High') result.sort((a, b) => a.cost_per_person - b.cost_per_person);
    else if (sortBy === 'Cost: High to Low') result.sort((a, b) => b.cost_per_person - a.cost_per_person);
    else if (sortBy === 'Duration: Short First') result.sort((a, b) => a.duration_hours - b.duration_hours);

    return result;
  }, [activities, searchQuery, categoryFilter, cityFilter, costFilter, durationFilter, sortBy]);

  const clearFilters = () => {
    setCategoryFilter('All');
    setCityFilter('All Cities');
    setCostFilter('Any Cost');
    setDurationFilter('Any Duration');
    setSortBy('Most Popular');
    setSearchQuery('');
  };

  const handleAddSuccess = (activityName, cityName, dayNum, tripId) => {
    setActivityToAdd(null);
    setToast({ 
      message: `✅ ${activityName} added to Day ${dayNum} in ${cityName}!`, 
      type: 'success',
      action: { label: 'View Itinerary', onClick: () => navigate(`/trips/${tripId}/itinerary`) }
    });
  };

  const isFilterActive = categoryFilter !== 'All' || cityFilter !== 'All Cities' || costFilter !== 'Any Cost' || durationFilter !== 'Any Duration' || sortBy !== 'Most Popular' || searchQuery !== '';

  const initials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T';

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans">
      <Sidebar user={user} />
      <main className="md:ml-[240px] pb-24 md:pb-8 animate-fade-in">
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] tracking-tight">Browse Activities 🎯</h2>
              <p className="text-sm text-[#6B6B7B] font-medium mt-0.5">Find things to do at every stop</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] transition-all"><Bell size={20} /><span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8593C] rounded-full border-2 border-[#FDF8F3]" /></button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold">{initials}</div>
            </div>
          </div>
        </header>

        <div className="px-6 sm:px-8 py-6 space-y-8">
          {/* Hero Search */}
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative w-full max-w-[640px] group">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1D9E75]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities, experiences..." 
                className="w-full bg-white border border-[#E8E0D5] rounded-full pl-14 pr-32 py-4 text-base text-[#1A1A2E] shadow-md placeholder-[#6B6B7B]/50 focus:outline-none focus:ring-4 focus:ring-[#1D9E75]/10 focus:border-[#1D9E75] transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1D9E75] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#158562] transition-all">Search</button>
            </div>
            
            {/* Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto w-full max-w-4xl pb-2 scrollbar-hide px-4 justify-start sm:justify-center">
              <button 
                onClick={() => setCategoryFilter('All')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${categoryFilter === 'All' ? 'bg-[#1A1A2E] text-white shadow-lg' : 'bg-white border border-[#E8E0D5] text-[#6B6B7B] hover:bg-[#F5EFE6]'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.label} 
                  onClick={() => setCategoryFilter(cat.label)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${categoryFilter === cat.label ? 'bg-[#1D9E75] text-white shadow-lg' : 'bg-white border border-[#E8E0D5] text-[#6B6B7B] hover:bg-[#F5EFE6]'}`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="relative min-w-[140px]">
                <select 
                  value={cityFilter} 
                  onChange={(e) => setCityFilter(e.target.value)}
                  className={`w-full appearance-none bg-white border rounded-full px-5 py-2.5 text-sm font-bold pr-10 focus:outline-none transition-all cursor-pointer ${cityFilter !== 'All Cities' ? 'border-[#1D9E75] text-[#1D9E75] bg-[#1D9E75]/5' : 'border-[#E8E0D5] text-[#6B6B7B]'}`}
                >
                  {userCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              <div className="relative min-w-[140px]">
                <select 
                  value={costFilter} 
                  onChange={(e) => setCostFilter(e.target.value)}
                  className={`w-full appearance-none bg-white border rounded-full px-5 py-2.5 text-sm font-bold pr-10 focus:outline-none transition-all cursor-pointer ${costFilter !== 'Any Cost' ? 'border-[#1D9E75] text-[#1D9E75] bg-[#1D9E75]/5' : 'border-[#E8E0D5] text-[#6B6B7B]'}`}
                >
                  {costRanges.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              <div className="relative min-w-[140px]">
                <select 
                  value={durationFilter} 
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className={`w-full appearance-none bg-white border rounded-full px-5 py-2.5 text-sm font-bold pr-10 focus:outline-none transition-all cursor-pointer ${durationFilter !== 'Any Duration' ? 'border-[#1D9E75] text-[#1D9E75] bg-[#1D9E75]/5' : 'border-[#E8E0D5] text-[#6B6B7B]'}`}
                >
                  {durations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              <div className="relative min-w-[140px]">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E8E0D5] rounded-full px-5 py-2.5 text-sm font-bold text-[#6B6B7B] pr-10 focus:outline-none focus:border-[#1D9E75] transition-all cursor-pointer"
                >
                  {sortByOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              {isFilterActive && (
                <button onClick={clearFilters} className="text-xs font-bold text-[#E8593C] flex items-center gap-1 px-2 hover:underline"><FilterX size={14} /> Clear</button>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#F5EFE6] pt-4">
              <p className="text-sm font-semibold text-[#6B6B7B]">Showing {filteredActivities.length} activities</p>
              <div className="flex gap-1.5">
                <button onClick={() => setViewMode('grid')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-[#1D9E75] text-white' : 'bg-white border border-[#E8E0D5] text-[#6B6B7B] hover:text-[#1A1A2E]'}`}><LayoutGrid size={16} /></button>
                <button onClick={() => setViewMode('list')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-[#1D9E75] text-white' : 'bg-white border border-[#E8E0D5] text-[#6B6B7B] hover:text-[#1A1A2E]'}`}><List size={16} /></button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-[280px] animate-pulse border border-[#F5EFE6]" />
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h4 className="text-xl font-bold text-[#1A1A2E] mb-2">No activities found 🎯</h4>
              <p className="text-sm text-[#6B6B7B] mb-6">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="bg-[#1D9E75] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#158562] transition-all">Clear All Filters</button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((act, i) => (
                <ActivitySearchCard key={act.id} activity={act} index={i} viewMode="grid" onCardClick={setSelectedActivity} onAddClick={setActivityToAdd} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((act, i) => (
                <ActivitySearchCard key={act.id} activity={act} index={i} viewMode="list" onCardClick={setSelectedActivity} onAddClick={setActivityToAdd} />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedActivity && <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} onAddClick={(act) => { setSelectedActivity(null); setActivityToAdd(act); }} />}
      {activityToAdd && <AddToItineraryFlow activity={activityToAdd} onClose={() => setActivityToAdd(null)} onAddSuccess={handleAddSuccess} />}
      {toast && <Toast message={toast.message} type={toast.type} action={toast.action} onClose={() => setToast(null)} />}
    </div>
  );
}
