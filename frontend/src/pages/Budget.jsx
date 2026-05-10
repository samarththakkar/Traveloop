import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import BudgetOverviewCard from '../components/BudgetOverviewCard';
import { CategoryBarChart, DailyAreaChart } from '../components/BudgetCharts';
import StopBudgetAccordion from '../components/StopBudgetAccordion';
import DailyCostTable from '../components/DailyCostTable';
import Toast from '../components/Toast';
import { ChevronLeft, Download, AlertTriangle, CheckCircle, Bell, Loader2 } from 'lucide-react';

const CURRENCIES = [
  { id: 'INR', symbol: '₹', rate: 1 },
  { id: 'USD', symbol: '$', rate: 1/84 },
  { id: 'EUR', symbol: '€', rate: 1/91 }
];

export default function Budget() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      const { data: tripData } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (!tripData) return navigate('/trips');
      setTrip(tripData);

      const { data: stopsData } = await supabase.from('stops').select('*').eq('trip_id', tripId).order('order_index');
      setStops(stopsData || []);

      if (stopsData && stopsData.length > 0) {
        const stopIds = stopsData.map(s => s.id);
        const { data: actsData } = await supabase.from('activities').select('*').in('stop_id', stopIds).order('day_date');
        setActivities(actsData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [tripId, navigate]);

  const convert = (amount) => (amount || 0) * currency.rate;

  const stats = useMemo(() => {
    if (!trip || !activities.length) return { totalSpent: 0, categoryTotals: {}, dailySpending: [], alerts: [] };

    const catTotals = { transport: 0, stay: 0, activities: 0, meals: 0, misc: 0 };
    const dailyMap = {};
    const alerts = [];

    activities.forEach(a => {
      const cat = a.category?.toLowerCase() || 'misc';
      const cost = Number(a.estimated_cost) || 0;
      const normalizedCat = cat.includes('food') ? 'meals' : (cat.includes('hotel') || cat.includes('accommodation')) ? 'stay' : cat;
      
      if (catTotals.hasOwnProperty(normalizedCat)) catTotals[normalizedCat] += cost;
      else catTotals.misc += cost;

      dailyMap[a.day_date] = (dailyMap[a.day_date] || 0) + cost;
    });

    const totalSpent = Object.values(catTotals).reduce((a, b) => a + b, 0);
    const dailySpending = Object.entries(dailyMap).sort().map(([date, value]) => ({
      date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      value: convert(value),
      rawDate: date
    }));

    // Simple alerts logic: if a day is > 15% of total budget
    const dayThreshold = trip.estimated_budget * 0.15;
    Object.entries(dailyMap).forEach(([date, value]) => {
      if (value > dayThreshold) {
        alerts.push({
          type: 'danger',
          message: `Day on ${new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} is over your planned daily allocation.`
        });
      }
    });

    return { 
      totalSpent, 
      categoryTotals: Object.fromEntries(Object.entries(catTotals).map(([k, v]) => [k, convert(v)])),
      dailySpending,
      alerts
    };
  }, [trip, activities, currency]);

  const daysTableData = useMemo(() => {
    if (!stops.length) return [];
    const days = [];
    let dayCount = 0;

    stops.forEach(stop => {
      const start = new Date(stop.arrival_date);
      const end = new Date(stop.departure_date);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        dayCount++;
        const dateStr = d.toISOString().split('T')[0];
        const dayActs = activities.filter(a => a.day_date === dateStr);
        const cost = dayActs.reduce((s, a) => s + (Number(a.estimated_cost) || 0), 0);
        days.push({
          dayNum: dayCount,
          date: dateStr,
          city: stop.city_name,
          activityCount: dayActs.length,
          cost: convert(cost),
          overBudget: trip?.estimated_budget && cost > (trip.estimated_budget / 7) // Simple logic: over 1/7th of total
        });
      }
    });
    return days;
  }, [stops, activities, trip, currency]);

  const handleUpdateBudget = async (newVal) => {
    const val = Number(newVal) / currency.rate; // Convert back to base (INR)
    const { error } = await supabase.from('trips').update({ estimated_budget: val }).eq('id', tripId);
    if (!error) {
      setTrip({ ...trip, estimated_budget: val });
      setToast({ message: 'Budget updated successfully! 💰', type: 'success' });
    }
  };

  const handleAddExpense = async (stopId, data) => {
    const { error } = await supabase.from('activities').insert([{
      stop_id: stopId,
      name: data.name,
      category: data.category,
      estimated_cost: Number(data.cost) / currency.rate,
      day_date: stops.find(s => s.id === stopId).arrival_date // Default to first day of stop
    }]);
    if (!error) {
      setToast({ message: 'Expense added! 📝', type: 'success' });
      // Refresh
      const stopIds = stops.map(s => s.id);
      const { data: actsData } = await supabase.from('activities').select('*').in('stop_id', stopIds).order('day_date');
      setActivities(actsData || []);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] font-sans">
        <Sidebar user={user} />
        <main className="md:ml-[240px] flex items-center justify-center h-screen">
          <Loader2 size={40} className="animate-spin text-[#1D9E75]" />
        </main>
      </div>
    );
  }

  const initials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T';
  const avgDaily = stats.dailySpending.length > 0 ? stats.dailySpending.reduce((a, b) => a + b.value, 0) / stats.dailySpending.length : 0;

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans animate-fade-in">
      <Sidebar user={user} />
      <main className="md:ml-[240px] pb-24 md:pb-8">
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(`/trips/${tripId}/view`)} className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] hover:border-[#1D9E75] transition-all flex-shrink-0"><ChevronLeft size={20} /></button>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] tracking-tight">Budget & Costs 💰</h2>
                <p className="text-sm text-[#6B6B7B] font-medium mt-0.5">{trip?.name} · {new Date(trip?.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(trip?.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={currency.id} 
                onChange={(e) => setCurrency(CURRENCIES.find(c => c.id === e.target.value))}
                className="bg-white border border-[#E8E0D5] rounded-xl px-3 py-2 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 transition-all cursor-pointer"
              >
                {CURRENCIES.map(c => <option key={c.id} value={c.id}>{c.id} ({c.symbol})</option>)}
              </select>
              <button onClick={() => setToast({ message: 'Export coming soon!', type: 'success' })} className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] transition-all"><Download size={20} /></button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold">{initials}</div>
            </div>
          </div>
        </header>

        <div className="max-w-[1000px] mx-auto px-6 sm:px-8 py-8 space-y-8">
          {/* Overview Card */}
          <BudgetOverviewCard 
            budget={convert(trip?.estimated_budget)} 
            totalSpent={convert(stats.totalSpent)} 
            categoryTotals={stats.categoryTotals}
            currency={currency}
            onUpdateBudget={handleUpdateBudget}
          />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBarChart data={stats.categoryTotals} currency={currency} />
            <DailyAreaChart data={stats.dailySpending} currency={currency} avgSpend={avgDaily} />
          </div>

          {/* Breakdown Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1A1A2E]">Breakdown by City Stop</h3>
            <div className="space-y-4">
              {stops.map(stop => (
                <StopBudgetAccordion 
                  key={stop.id} 
                  stop={stop} 
                  activities={activities.filter(a => a.stop_id === stop.id)} 
                  currency={currency}
                  onAddExpense={handleAddExpense}
                />
              ))}
            </div>
          </div>

          {/* Alerts Section */}
          <div className="space-y-3">
            {stats.alerts.length > 0 ? stats.alerts.map((alert, i) => (
              <div key={i} className="bg-[#E8593C]/10 border border-[#E8593C]/20 rounded-2xl p-5 flex items-start gap-4">
                <AlertTriangle className="text-[#E8593C] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#1A1A2E]">{alert.message}</p>
                  <p className="text-xs text-[#6B6B7B] mt-1">Consider reducing activities on this day or finding cheaper alternatives.</p>
                </div>
              </div>
            )) : (
              <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-2xl p-5 flex items-center gap-4">
                <CheckCircle className="text-[#1D9E75] flex-shrink-0" />
                <p className="text-sm font-bold text-[#1A1A2E]">All days within budget! Great planning.</p>
              </div>
            )}
          </div>

          {/* Daily Table Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1A1A2E]">Daily Cost Summary</h3>
            <DailyCostTable days={daysTableData} currency={currency} totalTripCost={convert(stats.totalSpent)} />
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
