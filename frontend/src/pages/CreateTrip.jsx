import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import {
  Pencil, CalendarDays, CalendarCheck, Wallet, Check, Loader2, ChevronLeft,
} from 'lucide-react';

const themes = [
  { label: 'Jungle Green', from: '#1D9E75', to: '#0d7a5a' },
  { label: 'Sunset Orange', from: '#E8593C', to: '#c93e24' },
  { label: 'Ocean Purple', from: '#4F46E5', to: '#7C3AED' },
  { label: 'Golden Sand', from: '#F59E0B', to: '#D97706' },
  { label: 'Sky Blue', from: '#0EA5E9', to: '#0284C7' },
  { label: 'Midnight', from: '#1A1A2E', to: '#3D3D5C' },
];

const currencies = [
  { symbol: '₹', code: 'INR' },
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function CreateTrip() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Form state
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [visibility, setVisibility] = useState('private');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(0);

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function init() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);
    }
    init();
  }, [navigate]);

  // Calculated duration
  const tripDuration = (() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  })();

  const validate = () => {
    const newErrors = {};
    if (!tripName || tripName.trim().length < 3) {
      newErrors.tripName = 'Trip name must be at least 3 characters';
    }
    if (!startDate) {
      newErrors.startDate = 'Departure date is required';
    }
    if (!endDate) {
      newErrors.endDate = 'Return date is required';
    }
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = 'Return date must be after departure date';
    }
    if (budgetAmount && (isNaN(Number(budgetAmount)) || Number(budgetAmount) < 0)) {
      newErrors.budget = 'Budget must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.from('trips').insert([
        {
          user_id: user.id,
          name: tripName.trim(),
          description: description.trim(),
          start_date: startDate,
          end_date: endDate,
          theme_color: selectedTheme,
          visibility,
          estimated_budget: budgetAmount ? Number(budgetAmount) : null,
          currency: currencies[selectedCurrency].code,
          status: 'planning',
          created_at: new Date().toISOString(),
        },
      ]).select();

      if (error) throw error;

      setToast({ message: '🎉 Trip created! Let\'s build your itinerary.', type: 'success' });

      const newId = data?.[0]?.id;
      setTimeout(() => {
        navigate(newId ? `/trips/${newId}` : '/dashboard');
      }, 1200);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = useCallback(() => setToast(null), []);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler';
  const initials = firstName[0]?.toUpperCase() || 'T';

  // Input base style
  const inputBase = 'w-full bg-[#FDF8F3] border rounded-2xl py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B]/60 font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] transition-all duration-200';

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans">
      <Sidebar user={user} />

      <main className="md:ml-[240px] pb-24 md:pb-8">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] hover:border-[#1D9E75] transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] tracking-tight">
                  {getGreeting()}, {firstName} 👋
                </h2>
                <p className="text-sm text-[#6B6B7B] font-medium mt-0.5">Let's plan something amazing</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
          </div>
        </header>

        <div className="px-6 sm:px-8 py-8">
          {/* Page Title */}
          <div className="max-w-[680px] mx-auto mb-8" style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] tracking-tight">Plan a New Trip ✈️</h1>
            <p className="text-sm text-[#6B6B7B] font-medium mt-1">Fill in the details to kick off your adventure</p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="max-w-[680px] mx-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F5EFE6] p-6 sm:p-10 space-y-8">

            {/* Section 1 — Trip Basics */}
            <div className="space-y-5" style={{ animation: 'fadeIn 0.4s ease-out 0.08s both' }}>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Trip Name</label>
                <div className="relative">
                  <Pencil size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => { setTripName(e.target.value); setErrors(p => ({ ...p, tripName: undefined })); }}
                    className={`${inputBase} pl-12 pr-4 ${errors.tripName ? 'border-[#E8593C]' : 'border-[#E8E0D5]'}`}
                    placeholder="e.g. Europe Summer 2025"
                  />
                </div>
                {errors.tripName && <p className="text-xs text-[#E8593C] font-semibold mt-1.5">{errors.tripName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Description (optional)</label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) setDescription(e.target.value);
                    }}
                    className={`${inputBase} px-4 resize-y border-[#E8E0D5]`}
                    rows="3"
                    placeholder="What's this trip about? Any special plans?"
                  />
                  <span className="absolute right-3 bottom-3 text-[10px] font-bold text-[#6B6B7B]/60">
                    {description.length}/300
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F5EFE6]" />

            {/* Section 2 — Travel Dates */}
            <div className="space-y-4" style={{ animation: 'fadeIn 0.4s ease-out 0.16s both' }}>
              <label className="block text-sm font-semibold text-[#1A1A2E]">Travel Dates</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#6B6B7B] mb-1.5">Departure Date</label>
                  <div className="relative">
                    <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B] pointer-events-none" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); setErrors(p => ({ ...p, startDate: undefined })); }}
                      className={`${inputBase} pl-12 pr-4 ${errors.startDate ? 'border-[#E8593C]' : 'border-[#E8E0D5]'}`}
                    />
                  </div>
                  {errors.startDate && <p className="text-xs text-[#E8593C] font-semibold mt-1">{errors.startDate}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#6B6B7B] mb-1.5">Return Date</label>
                  <div className="relative">
                    <CalendarCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B] pointer-events-none" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); setErrors(p => ({ ...p, endDate: undefined })); }}
                      className={`${inputBase} pl-12 pr-4 ${errors.endDate ? 'border-[#E8593C]' : 'border-[#E8E0D5]'}`}
                    />
                  </div>
                  {errors.endDate && <p className="text-xs text-[#E8593C] font-semibold mt-1">{errors.endDate}</p>}
                </div>
              </div>
              {tripDuration && (
                <div className="inline-flex items-center gap-1.5 bg-[#1D9E75]/10 text-[#1D9E75] text-sm font-bold px-4 py-1.5 rounded-full">
                  🗓️ {tripDuration} {tripDuration === 1 ? 'day' : 'days'}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#F5EFE6]" />

            {/* Section 3 — Cover Theme */}
            <div style={{ animation: 'fadeIn 0.4s ease-out 0.24s both' }}>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-3">Choose a Trip Theme</label>
              <div className="flex flex-wrap gap-3">
                {themes.map((theme, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedTheme(i)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                      selectedTheme === i
                        ? 'ring-2 ring-[#1A1A2E] ring-offset-2 ring-offset-white scale-110'
                        : 'hover:ring-1 hover:ring-[#E8E0D5]'
                    }`}
                    style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                    title={theme.label}
                  >
                    {selectedTheme === i && <Check size={20} className="text-white" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F5EFE6]" />

            {/* Section 4 — Trip Visibility */}
            <div style={{ animation: 'fadeIn 0.4s ease-out 0.32s both' }}>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-3">Who can see this trip?</label>
              <div className="flex gap-3">
                {[
                  { value: 'private', label: 'Private 🔒' },
                  { value: 'public', label: 'Public 🌍' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setVisibility(opt.value)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      visibility === opt.value
                        ? 'bg-[#1D9E75] text-white shadow-lg shadow-[#1D9E75]/20'
                        : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F5EFE6]" />

            {/* Section 5 — Budget */}
            <div style={{ animation: 'fadeIn 0.4s ease-out 0.4s both' }}>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Estimated Budget (optional)</label>
              <div className="flex gap-3">
                {/* Currency Selector */}
                <div className="relative flex-shrink-0">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(Number(e.target.value))}
                    className="appearance-none bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl pl-4 pr-10 py-3.5 text-[#1A1A2E] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] transition-all duration-200 cursor-pointer"
                  >
                    {currencies.map((c, i) => (
                      <option key={c.code} value={i}>{c.symbol} {c.code}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7B] pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Amount Input */}
                <div className="relative flex-1">
                  <Wallet size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => { setBudgetAmount(e.target.value); setErrors(p => ({ ...p, budget: undefined })); }}
                    className={`${inputBase} pl-12 pr-4 ${errors.budget ? 'border-[#E8593C]' : 'border-[#E8E0D5]'}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              {errors.budget && <p className="text-xs text-[#E8593C] font-semibold mt-1.5">{errors.budget}</p>}
            </div>

            {/* Form Error */}
            {errors.form && (
              <div className="bg-[#E8593C]/10 border border-[#E8593C]/20 rounded-xl px-4 py-3">
                <p className="text-sm text-[#E8593C] font-semibold">{errors.form}</p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-[#F5EFE6]" />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2" style={{ animation: 'fadeIn 0.4s ease-out 0.48s both' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border-2 border-[#E8E0D5] text-[#6B6B7B] font-bold text-sm hover:bg-[#F5EFE6] hover:border-[#6B6B7B] transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-w-[160px] px-8 py-3.5 rounded-full bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#1D9E75]/20 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                {loading ? 'Creating...' : 'Create Trip →'}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}
