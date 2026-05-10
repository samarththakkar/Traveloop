import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import ChecklistCategory from '../components/ChecklistCategory';
import TemplateModal from '../components/TemplateModal';
import BulkActionsBar from '../components/BulkActionsBar';
import Toast from '../components/Toast';
import { ChevronLeft, Sparkles, RotateCcw, Trash2, LayoutTemplate, Bell, Loader2, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { name: 'Clothing', emoji: '👔', color: '#3B82F6' },
  { name: 'Toiletries', emoji: '🧴', color: '#10B981' },
  { name: 'Documents', emoji: '📄', color: '#F59E0B' },
  { name: 'Health & Medicine', emoji: '💊', color: '#EF4444' },
  { name: 'Electronics', emoji: '💻', color: '#6366F1' },
  { name: 'Accessories', emoji: '🎒', color: '#8B5CF6' },
  { name: 'Snacks & Food', emoji: '🍎', color: '#EC4899' },
  { name: 'Miscellaneous', emoji: '🧾', color: '#6B7280' },
];

export default function PackingChecklist() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const undoRef = useRef(null);

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      const { data: tripData } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (!tripData) return navigate('/trips');
      setTrip(tripData);

      const { data: itemsData } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('order_index');
      
      setItems(itemsData || []);
      setLoading(false);
    }
    init();
  }, [tripId, navigate]);

  const stats = useMemo(() => {
    const total = items.length;
    const packed = items.filter(i => i.is_packed).length;
    const pct = total > 0 ? Math.round((packed / total) * 100) : 0;
    
    const catStats = CATEGORIES.map(c => {
      const catItems = items.filter(i => i.category === c.name);
      return {
        ...c,
        packed: catItems.filter(i => i.is_packed).length,
        total: catItems.length,
        pct: catItems.length > 0 ? Math.round((catItems.filter(i => i.is_packed).length / catItems.length) * 100) : 0
      };
    });

    return { total, packed, pct, catStats };
  }, [items]);

  useEffect(() => {
    if (stats.pct === 100 && stats.total > 0 && !confetti) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
    }
  }, [stats.pct, stats.total]);

  const handleToggle = async (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    // Optimistic
    const newPacked = !item.is_packed;
    setItems(items.map(i => i.id === id ? { ...i, is_packed: newPacked } : i));

    const { error } = await supabase.from('checklist_items').update({ is_packed: newPacked }).eq('id', id);
    if (error) {
      // Revert
      setItems(items.map(i => i.id === id ? { ...i, is_packed: !newPacked } : i));
      setToast({ message: 'Error updating item', type: 'error' });
    }
  };

  const handleUpdate = async (id, data) => {
    setItems(items.map(i => i.id === id ? { ...i, ...data } : i));
    await supabase.from('checklist_items').update(data).eq('id', id);
  };

  const handleDelete = async (id) => {
    const deletedItem = items.find(i => i.id === id);
    setItems(items.filter(i => i.id !== id));

    const { error } = await supabase.from('checklist_items').delete().eq('id', id);
    if (!error) {
      setToast({ 
        message: `Deleted "${deletedItem.name}"`, 
        type: 'success', 
        action: { 
          label: 'Undo', 
          onClick: async () => {
            const { data, error: reError } = await supabase.from('checklist_items').insert([deletedItem]).select();
            if (!reError) setItems(prev => [...prev, data[0]].sort((a,b) => a.order_index - b.order_index));
          } 
        } 
      });
    }
  };

  const handleAddItem = async (category, name, quantity) => {
    const newItem = {
      trip_id: tripId,
      user_id: user.id,
      category,
      name,
      quantity,
      is_packed: false,
      order_index: items.length,
      source: 'manual'
    };

    const { data, error } = await supabase.from('checklist_items').insert([newItem]).select();
    if (!error) setItems([...items, data[0]]);
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    // Mocking Claude API response for demo
    setTimeout(async () => {
      const suggestions = {
        'Clothing': ['Lightweight jacket', 'Walking shoes', 'T-shirts', 'Quick-dry socks'],
        'Toiletries': ['Travel-size shampoo', 'Toothbrush & paste', 'Sunscreen'],
        'Documents': ['Passport copy', 'Hotel reservations', 'Travel insurance'],
        'Electronics': ['Power bank', 'Universal adapter', 'Camera charger']
      };

      const newItems = [];
      let idx = items.length;

      Object.entries(suggestions).forEach(([cat, names]) => {
        names.forEach(name => {
          if (!items.find(i => i.name === name)) {
            newItems.push({
              trip_id: tripId,
              user_id: user.id,
              category: cat,
              name,
              quantity: 1,
              is_packed: false,
              order_index: idx++,
              source: 'ai'
            });
          }
        });
      });

      if (newItems.length > 0) {
        const { data, error } = await supabase.from('checklist_items').insert(newItems).select();
        if (!error) {
          setItems([...items, ...data.map(i => ({ ...i, isNew: true }))]);
          setToast({ message: `✨ Added ${data.length} suggested items!`, type: 'success' });
        }
      } else {
        setToast({ message: 'All suggested items already in your list.', type: 'success' });
      }
      setAiLoading(false);
    }, 1500);
  };

  const handleResetAll = async () => {
    if (window.confirm('Reset all checkboxes? Items will not be deleted.')) {
      setItems(items.map(i => ({ ...i, is_packed: false })));
      await supabase.from('checklist_items').update({ is_packed: false }).eq('trip_id', tripId);
      setToast({ message: 'All checkboxes reset', type: 'success' });
    }
  };

  const handleClearPacked = async () => {
    if (window.confirm('Remove all packed items permanently?')) {
      const packedIds = items.filter(i => i.is_packed).map(i => i.id);
      setItems(items.filter(i => !i.is_packed));
      await supabase.from('checklist_items').delete().in('id', packedIds);
      setToast({ message: 'Cleared all packed items', type: 'success' });
    }
  };

  const handleApplyTemplate = async (template) => {
    const newItems = [];
    let idx = items.length;
    
    Object.entries(template.items).forEach(([cat, names]) => {
      names.forEach(name => {
        if (!items.find(i => i.name === name)) {
          newItems.push({
            trip_id: tripId,
            user_id: user.id,
            category: cat,
            name,
            quantity: 1,
            is_packed: false,
            order_index: idx++,
            source: 'template'
          });
        }
      });
    });

    if (newItems.length > 0) {
      const { data, error } = await supabase.from('checklist_items').insert(newItems).select();
      if (!error) {
        setItems([...items, ...data]);
        setToast({ message: `Applied ${template.name} template!`, type: 'success' });
      }
    } else {
      setToast({ message: 'Template items already in your list.', type: 'success' });
    }
    setShowTemplates(false);
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

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans animate-fade-in pb-20">
      <Sidebar user={user} />
      <main className="md:ml-[240px] pb-8 relative">
        {/* Celebration Confetti */}
        {confetti && (
          <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{ 
                  backgroundColor: ['#1D9E75','#E8593C','#3B82F6','#F59E0B'][i % 4],
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => navigate(`/trips/${tripId}/view`)} className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] hover:border-[#1D9E75] transition-all flex-shrink-0"><ChevronLeft size={20} /></button>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] tracking-tight truncate">Packing Checklist 🧳</h2>
                <p className="text-sm text-[#6B6B7B] font-medium truncate">{trip?.name} · Make sure you don't forget anything!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button 
                onClick={handleAiSuggest}
                disabled={aiLoading}
                className="flex items-center gap-2 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all shadow-md disabled:opacity-70"
              >
                {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span className="hidden sm:inline">{aiLoading ? 'Thinking...' : 'AI Suggest'}</span>
              </button>
              <button 
                onClick={() => setShowTemplates(true)}
                className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1D9E75] transition-all"
              >
                <LayoutTemplate size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold">{initials}</div>
            </div>
          </div>
        </header>

        <div className="max-w-[860px] mx-auto px-6 sm:px-8 py-8 space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] p-6 flex flex-col sm:flex-row items-center gap-8">
            <div className="text-center sm:text-left flex-shrink-0">
              <h1 className="text-5xl font-black text-[#1A1A2E]">{stats.packed} <span className="text-2xl text-[#E8E0D5]">/</span> <span className="text-2xl text-[#6B6B7B]">{stats.total}</span></h1>
              <p className="text-xs font-bold text-[#6B6B7B] uppercase tracking-widest mt-1">items packed</p>
              <div className="mt-4 flex gap-2">
                <button onClick={handleResetAll} className="flex items-center gap-1.5 text-[10px] font-bold text-[#E8593C] uppercase tracking-wider hover:underline"><RotateCcw size={12} /> Reset</button>
                <button onClick={handleClearPacked} className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider hover:underline"><Trash2 size={12} /> Clear Packed</button>
              </div>
            </div>

            <div className="w-32 h-32 relative flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="54" fill="none" stroke="#E8E0D5" strokeWidth="8" />
                <circle 
                  cx="64" cy="64" r="54" fill="none" stroke="#1D9E75" strokeWidth="8" 
                  strokeDasharray={339.29}
                  strokeDashoffset={339.29 - (339.29 * stats.pct) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-[#1A1A2E]">{stats.pct}%</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              {stats.catStats.filter(c => c.total > 0).slice(0, 5).map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider">
                    <span>{cat.name}</span>
                    <span>{cat.packed} / {cat.total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F5EFE6] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Celebration Banner */}
          {stats.pct === 100 && stats.total > 0 && (
            <div className="bg-[#DCFCE7] border-2 border-[#16A34A]/20 rounded-2xl p-4 flex items-center gap-3 animate-bounce-subtle">
              <CheckCircle2 size={24} className="text-[#16A34A]" />
              <p className="text-sm font-bold text-[#16A34A]">🎉 All packed! You're ready for your trip to {trip?.name}!</p>
            </div>
          )}

          {/* Categories */}
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <ChecklistCategory 
                key={cat.name}
                category={cat.name}
                emoji={cat.emoji}
                color={cat.color}
                items={items.filter(i => i.category === cat.name)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onAddItem={handleAddItem}
              />
            ))}
          </div>

          {/* Empty State */}
          {items.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-32 h-32 text-[#E8E0D5] mb-6 animate-float">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 8H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM16 8V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3" />
                  <path d="M12 12v4M8 14h8" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-[#1A1A2E] mb-2">Your checklist is empty</h4>
              <p className="text-sm text-[#6B6B7B] mb-8">Start adding items manually or let our AI suggest a list for you.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAiSuggest}
                  disabled={aiLoading}
                  className="flex items-center justify-center gap-2 bg-[#1D9E75] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-[#1D9E75]/20 hover:bg-[#158562] transition-all"
                >
                  {aiLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                  {aiLoading ? 'Thinking...' : 'AI Suggest List'}
                </button>
                <button 
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-[#E8E0D5] text-[#1A1A2E] font-bold px-8 py-3.5 rounded-full hover:bg-[#FDF8F3] transition-all"
                >
                  <LayoutTemplate size={20} />
                  Load Template
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <BulkActionsBar 
        selectedCount={0} // To be implemented with multi-select if needed
        categories={CATEGORIES.map(c => c.name)}
      />

      {showTemplates && <TemplateModal onClose={() => setShowTemplates(false)} onApply={handleApplyTemplate} />}
      {toast && <Toast message={toast.message} type={toast.type} action={toast.action} onClose={() => setToast(null)} />}
    </div>
  );
}
