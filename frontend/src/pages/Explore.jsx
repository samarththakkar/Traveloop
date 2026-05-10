import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import CityCard from '../components/CityCard';
import CityDrawer from '../components/CityDrawer';
import AddToTripModal from '../components/AddToTripModal';
import Toast from '../components/Toast';
import { Search, LayoutGrid, List, ChevronDown, Bell, FilterX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const regions = ['All Regions', 'Asia', 'Europe', 'Americas', 'Middle East', 'Africa', 'Oceania'];
const budgets = ['Any Budget', 'Budget (💰)', 'Mid-range (💰💰)', 'Luxury (💰💰💰)'];
const seasons = ['Any Season', 'Spring', 'Summer', 'Autumn', 'Winter'];
const sortByOptions = ['Popularity', 'Cost: Low to High', 'Cost: High to Low', 'A–Z'];

const popularTags = [
  { icon: '🏖️', label: 'Beach' },
  { icon: '🏔️', label: 'Mountains' },
  { icon: '🏛️', label: 'History' },
  { icon: '🍜', label: 'Food' },
  { icon: '🎭', label: 'Culture' },
  { icon: '🛍️', label: 'Shopping' }
];

const fallbackCities = [
  { id: 1, name: 'Paris', country: 'France', region: 'Europe', budget_level: 3, avg_cost_per_day: 15000, rating: 4.9, best_seasons: ['☀️ Summer', '🍂 Autumn'], popular_for: ['🏛️ History', '🥐 Food', '🎭 Culture'], description: 'The City of Light, famous for the Eiffel Tower, world-class museums, and romantic atmosphere.', gradient: 'from-[#FF9A8B] to-[#FF6A88]', neighborhoods: ['Le Marais', 'Montmartre', 'Saint-Germain-des-Prés'], popular_activities: [{ name: 'Louvre Museum', category: 'sightseeing', cost: 1800 }, { name: 'Eiffel Tower Summit', category: 'sightseeing', cost: 2500 }], tips: ['Book museum tickets in advance', 'Use the Metro to get around'] },
  { id: 2, name: 'Tokyo', country: 'Japan', region: 'Asia', budget_level: 3, avg_cost_per_day: 12000, rating: 4.8, best_seasons: ['🌸 Spring', '🍂 Autumn'], popular_for: ['🍜 Food', '🎭 Culture', '🛍️ Shopping'], description: 'A futuristic metropolis where neon skyscrapers meet ancient temples and world-class cuisine.', gradient: 'from-[#8E2DE2] to-[#4A00E0]', neighborhoods: ['Shibuya', 'Shinjuku', 'Asakusa'], popular_activities: [{ name: 'Shibuya Crossing', category: 'sightseeing', cost: 0 }, { name: 'Sushi Omakase', category: 'food', cost: 10000 }], tips: ['Get a Suica card for transport', 'Learn basic Japanese phrases'] },
  { id: 3, name: 'Bali', country: 'Indonesia', region: 'Asia', budget_level: 1, avg_cost_per_day: 3500, rating: 4.7, best_seasons: ['☀️ Summer', '🌸 Spring'], popular_for: ['🏖️ Beach', '🧘 Culture', '🏔️ Mountains'], description: 'Tropical paradise known for its volcanic mountains, iconic rice paddies, beaches, and coral reefs.', gradient: 'from-[#1D9E75] to-[#0d7a5a]', neighborhoods: ['Ubud', 'Seminyak', 'Canggu'], popular_activities: [{ name: 'Tegalalang Rice Terrace', category: 'sightseeing', cost: 500 }, { name: 'Surf Lesson', category: 'adventure', cost: 2000 }], tips: ['Rent a scooter for flexibility', 'Respect local temple dress codes'] },
  { id: 4, name: 'New York', country: 'USA', region: 'Americas', budget_level: 3, avg_cost_per_day: 20000, rating: 4.8, best_seasons: ['🍂 Autumn', '❄️ Winter'], popular_for: ['🏛️ History', '🎭 Culture', '🛍️ Shopping'], description: 'The city that never sleeps, offering world-famous landmarks, Broadway shows, and diverse food scenes.', gradient: 'from-[#2c3e50] to-[#bdc3c7]', neighborhoods: ['Manhattan', 'Brooklyn', 'Queens'], popular_activities: [{ name: 'Central Park', category: 'sightseeing', cost: 0 }, { name: 'Broadway Show', category: 'entertainment', cost: 12000 }], tips: ['Wear comfortable walking shoes', 'Try a local bagel'] },
  { id: 5, name: 'Dubai', country: 'UAE', region: 'Middle East', budget_level: 3, avg_cost_per_day: 18000, rating: 4.6, best_seasons: ['❄️ Winter', '🍂 Autumn'], popular_for: ['🏙️ Modernity', '🛍️ Shopping', '🏖️ Beach'], description: 'A city of luxury, known for ultramodern architecture, lively nightlife, and incredible shopping malls.', gradient: 'from-[#f12711] to-[#f5af19]', neighborhoods: ['Downtown Dubai', 'Palm Jumeirah', 'Dubai Marina'], popular_activities: [{ name: 'Burj Khalifa View', category: 'sightseeing', cost: 4500 }, { name: 'Desert Safari', category: 'adventure', cost: 3500 }], tips: ['Dress modestly in public areas', 'Use the Metro during rush hours'] },
  { id: 6, name: 'Rome', country: 'Italy', region: 'Europe', budget_level: 2, avg_cost_per_day: 10000, rating: 4.9, best_seasons: ['🌸 Spring', '🍂 Autumn'], popular_for: ['🏛️ History', '🍕 Food', '🎭 Culture'], description: 'The Eternal City, home to almost 3,000 years of globally influential art, architecture, and culture.', gradient: 'from-[#603813] to-[#b29f94]', neighborhoods: ['Trastevere', 'Monti', 'Prati'], popular_activities: [{ name: 'Colosseum Tour', category: 'sightseeing', cost: 3500 }, { name: 'Authentic Pasta', category: 'food', cost: 2000 }], tips: ['Drink from the public fountains', 'Watch out for pickpockets'] },
  { id: 7, name: 'Bangkok', country: 'Thailand', region: 'Asia', budget_level: 1, avg_cost_per_day: 4500, rating: 4.7, best_seasons: ['❄️ Winter', '🍂 Autumn'], popular_for: ['🍜 Food', '🎭 Culture', '🛍️ Shopping'], description: 'A bustling capital known for ornate shrines, vibrant street life, and famous floating markets.', gradient: 'from-[#FF5F6D] to-[#FFC371]', neighborhoods: ['Sukhumvit', 'Old City', 'Silom'], popular_activities: [{ name: 'Grand Palace', category: 'sightseeing', cost: 1200 }, { name: 'Street Food Tour', category: 'food', cost: 800 }], tips: ['Take a Tuk-Tuk for short distances', 'Always carry a bottle of water'] },
  { id: 8, name: 'London', country: 'UK', region: 'Europe', budget_level: 3, avg_cost_per_day: 16000, rating: 4.7, best_seasons: ['🌸 Spring', '☀️ Summer'], popular_for: ['🏛️ History', '🎭 Culture', '🛍️ Shopping'], description: 'A global city with deep history, home to iconic landmarks, world-class museums, and diverse parks.', gradient: 'from-[#000428] to-[#004e92]', neighborhoods: ['Covent Garden', 'South Kensington', 'Shoreditch'], popular_activities: [{ name: 'British Museum', category: 'sightseeing', cost: 0 }, { name: 'London Eye', category: 'sightseeing', cost: 3000 }], tips: ['Get an Oyster card', 'Many museums are free!'] },
  { id: 9, name: 'Barcelona', country: 'Spain', region: 'Europe', budget_level: 2, avg_cost_per_day: 9000, rating: 4.8, best_seasons: ['🌸 Spring', '☀️ Summer'], popular_for: ['🏖️ Beach', '🏛️ Architecture', '🎭 Culture'], description: 'Catalan capital famous for Gaudí architecture, golden beaches, and vibrant nightlife.', gradient: 'from-[#fc00ff] to-[#00dbde]', neighborhoods: ['Gothic Quarter', 'Eixample', 'Gràcia'], popular_activities: [{ name: 'Sagrada Família', category: 'sightseeing', cost: 2500 }, { name: 'La Rambla Walk', category: 'sightseeing', cost: 0 }], tips: ['Visit Sagrada Família early', 'Try the local tapas'] },
  { id: 10, name: 'Singapore', country: 'Asia', region: 'Asia', budget_level: 3, avg_cost_per_day: 14000, rating: 4.8, best_seasons: ['❄️ Winter', '🌸 Spring'], popular_for: ['🏙️ Modernity', '🍜 Food', '🛍️ Shopping'], description: 'A garden city offering a blend of culture, luxury shopping, and incredible futuristic gardens.', gradient: 'from-[#FF4E50] to-[#F9D423]', neighborhoods: ['Marina Bay', 'Chinatown', 'Little India'], popular_activities: [{ name: 'Gardens by the Bay', category: 'sightseeing', cost: 2800 }, { name: 'Hawker Center Food', category: 'food', cost: 500 }], tips: ['Follow local rules strictly', 'Carry an umbrella for quick showers'] },
  { id: 11, name: 'Istanbul', country: 'Turkey', region: 'Middle East', budget_level: 1, avg_cost_per_day: 5000, rating: 4.7, best_seasons: ['🌸 Spring', '🍂 Autumn'], popular_for: ['🏛️ History', '🍜 Food', '🎭 Culture'], description: 'A transcontinental city bridging Europe and Asia, famous for its rich history and diverse culture.', gradient: 'from-[#e96443] to-[#904e95]', neighborhoods: ['Sultanahmet', 'Beyoğlu', 'Kadiköy'], popular_activities: [{ name: 'Hagia Sophia', category: 'sightseeing', cost: 0 }, { name: 'Grand Bazaar', category: 'shopping', cost: 0 }], tips: ['Try the Turkish tea', 'Cross the Bosphorus by ferry'] },
  { id: 12, name: 'Sydney', country: 'Australia', region: 'Oceania', budget_level: 3, avg_cost_per_day: 15000, rating: 4.8, best_seasons: ['🌸 Spring', '☀️ Summer'], popular_for: ['🏖️ Beach', '🏛️ Modernity', '🎭 Culture'], description: 'Coastal city known for the Opera House, golden beaches, and thriving harbor life.', gradient: 'from-[#00c6ff] to-[#0072ff]', neighborhoods: ['The Rocks', 'Bondi', 'Surry Hills'], popular_activities: [{ name: 'Opera House Tour', category: 'sightseeing', cost: 4000 }, { name: 'Bondi to Coogee Walk', category: 'sightseeing', cost: 0 }], tips: ['Apply sun protection often', 'Use the ferries for views'] }
];

export default function Explore() {
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [budgetFilter, setBudgetFilter] = useState('Any Budget');
  const [seasonFilter, setSeasonFilter] = useState('Any Season');
  const [sortBy, setSortBy] = useState('Popularity');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('exploreView') || 'grid');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityToAdd, setCityToAdd] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      
      const { data, error } = await supabase.from('cities').select('*');
      if (!error && data && data.length > 0) {
        setCities(data);
      } else {
        // Use fallbacks if DB is empty
        setCities(fallbackCities);
      }
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => { localStorage.setItem('exploreView', viewMode); }, [viewMode]);

  const filteredCities = useMemo(() => {
    let result = [...cities];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.country.toLowerCase().includes(q) ||
        (c.popular_for || []).some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (regionFilter !== 'All Regions') {
      result = result.filter(c => c.region === regionFilter);
    }

    if (budgetFilter !== 'Any Budget') {
      const level = budgets.indexOf(budgetFilter);
      result = result.filter(c => c.budget_level === level);
    }

    if (seasonFilter !== 'Any Season') {
      result = result.filter(c => (c.best_seasons || []).some(s => s.includes(seasonFilter)));
    }

    // Sort
    if (sortBy === 'Popularity') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'Cost: Low to High') result.sort((a, b) => a.avg_cost_per_day - b.avg_cost_per_day);
    else if (sortBy === 'Cost: High to Low') result.sort((a, b) => b.avg_cost_per_day - a.avg_cost_per_day);
    else if (sortBy === 'A–Z') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [cities, searchQuery, regionFilter, budgetFilter, seasonFilter, sortBy]);

  const clearFilters = () => {
    setRegionFilter('All Regions');
    setBudgetFilter('Any Budget');
    setSeasonFilter('Any Season');
    setSortBy('Popularity');
    setSearchQuery('');
  };

  const isFilterActive = regionFilter !== 'All Regions' || budgetFilter !== 'Any Budget' || seasonFilter !== 'Any Season' || sortBy !== 'Popularity' || searchQuery !== '';

  const handleAddSuccess = (tripName, tripId) => {
    setCityToAdd(null);
    setToast({ 
      message: `✅ City added to ${tripName}!`, 
      type: 'success',
      action: { label: 'View Itinerary', onClick: () => navigate(`/trips/${tripId}/itinerary`) }
    });
  };

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler';
  const initials = firstName[0]?.toUpperCase() || 'T';

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans">
      <Sidebar user={user} />
      <main className="md:ml-[240px] pb-24 md:pb-8 animate-fade-in">
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] tracking-tight">Explore Cities 🌍</h2>
              <p className="text-sm text-[#6B6B7B] font-medium mt-0.5">Discover your next destination</p>
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
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1D9E75] group-focus-within:scale-110 transition-transform" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities, countries..." 
                className="w-full bg-white border border-[#E8E0D5] rounded-full pl-14 pr-32 py-4 text-base text-[#1A1A2E] shadow-md placeholder-[#6B6B7B]/50 focus:outline-none focus:ring-4 focus:ring-[#1D9E75]/10 focus:border-[#1D9E75] transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1D9E75] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#158562] transition-all">Search</button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTags.map(tag => (
                <button 
                  key={tag.label} 
                  onClick={() => setSearchQuery(tag.label)}
                  className="bg-white border border-[#E8E0D5] rounded-full px-4 py-2 text-sm font-medium text-[#6B6B7B] hover:bg-[#1D9E75]/5 hover:border-[#1D9E75] hover:text-[#1D9E75] hover:scale-105 transition-all"
                >
                  {tag.icon} {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="relative min-w-[140px]">
                <select 
                  value={regionFilter} 
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className={`w-full appearance-none bg-white border rounded-full px-5 py-2.5 text-sm font-bold pr-10 focus:outline-none transition-all cursor-pointer ${regionFilter !== 'All Regions' ? 'border-[#1D9E75] text-[#1D9E75] bg-[#1D9E75]/5' : 'border-[#E8E0D5] text-[#6B6B7B]'}`}
                >
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              <div className="relative min-w-[140px]">
                <select 
                  value={budgetFilter} 
                  onChange={(e) => setBudgetFilter(e.target.value)}
                  className={`w-full appearance-none bg-white border rounded-full px-5 py-2.5 text-sm font-bold pr-10 focus:outline-none transition-all cursor-pointer ${budgetFilter !== 'Any Budget' ? 'border-[#1D9E75] text-[#1D9E75] bg-[#1D9E75]/5' : 'border-[#E8E0D5] text-[#6B6B7B]'}`}
                >
                  {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              <div className="relative min-w-[140px]">
                <select 
                  value={seasonFilter} 
                  onChange={(e) => setSeasonFilter(e.target.value)}
                  className={`w-full appearance-none bg-white border rounded-full px-5 py-2.5 text-sm font-bold pr-10 focus:outline-none transition-all cursor-pointer ${seasonFilter !== 'Any Season' ? 'border-[#1D9E75] text-[#1D9E75] bg-[#1D9E75]/5' : 'border-[#E8E0D5] text-[#6B6B7B]'}`}
                >
                  {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              <div className="relative min-w-[140px]">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E8E0D5] rounded-full px-5 py-2.5 text-sm font-bold text-[#6B6B7B] pr-10 focus:outline-none focus:border-[#1D9E75] transition-all cursor-pointer"
                >
                  {sortByOptions.map(s => <option key={s} value={s}>Sort: {s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              {isFilterActive && (
                <button onClick={clearFilters} className="text-xs font-bold text-[#E8593C] flex items-center gap-1 px-2 hover:underline"><FilterX size={14} /> Clear</button>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#F5EFE6] pt-4">
              <p className="text-sm font-semibold text-[#6B6B7B]">Showing {filteredCities.length} cities</p>
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
          ) : filteredCities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h4 className="text-xl font-bold text-[#1A1A2E] mb-2">No cities found 🏙️</h4>
              <p className="text-sm text-[#6B6B7B] mb-6">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="bg-[#1D9E75] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#158562] transition-all">Clear All Filters</button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCities.map((city, i) => (
                <CityCard key={city.id} city={city} index={i} viewMode="grid" onCardClick={setSelectedCity} onAddToTrip={setCityToAdd} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCities.map((city, i) => (
                <CityCard key={city.id} city={city} index={i} viewMode="list" onCardClick={setSelectedCity} onAddToTrip={setCityToAdd} />
              ))}
            </div>
          )}
        </div>
      </main>

      <CityDrawer city={selectedCity} onClose={() => setSelectedCity(null)} onAddToTrip={(city) => { setSelectedCity(null); setCityToAdd(city); }} />
      {cityToAdd && <AddToTripModal city={cityToAdd} onClose={() => setCityToAdd(null)} onAddSuccess={handleAddSuccess} />}
      {toast && <Toast message={toast.message} type={toast.type} action={toast.action} onClose={() => setToast(null)} />}
    </div>
  );
}
