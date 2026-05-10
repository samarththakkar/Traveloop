import { useState } from 'react';
import { ChevronDown, MapPin, Landmark, Utensils, Car, Hotel, Package, Plus, Loader2 } from 'lucide-react';

const ICONS = { sightseeing: Landmark, food: Utensils, transport: Car, hotel: Hotel, accommodation: Hotel, misc: Package };
const COLORS = { sightseeing: '#1D9E75', food: '#F59E0B', transport: '#3B82F6', hotel: '#8B5CF6', accommodation: '#8B5CF6', misc: '#6B7280' };

export default function StopBudgetAccordion({ stop, activities, currency, onAddExpense }) {
  const [expanded, setExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expenseData, setExpenseData] = useState({ name: '', category: 'misc', cost: '' });
  const [submitting, setSubmitting] = useState(false);

  const curSym = currency.symbol;
  const stopTotal = activities.reduce((s, a) => s + (Number(a.estimated_cost) || 0), 0);

  const categoryBreakdown = activities.reduce((acc, a) => {
    const cat = a.category?.toLowerCase() || 'misc';
    acc[cat] = (acc[cat] || 0) + (Number(a.estimated_cost) || 0);
    return acc;
  }, {});

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!expenseData.name || !expenseData.cost) return;
    setSubmitting(true);
    await onAddExpense(stop.id, expenseData);
    setExpenseData({ name: '', category: 'misc', cost: '' });
    setShowAddForm(false);
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F5EFE6] shadow-sm overflow-hidden transition-all">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-[#FDF8F3] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] font-bold text-sm">{stop.order_index + 1}</div>
          <div>
            <h4 className="font-bold text-[#1A1A2E]">{stop.city_name}</h4>
            <p className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-widest">{new Date(stop.arrival_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(stop.departure_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-lg font-black text-[#1A1A2E]">{curSym}{stopTotal.toLocaleString('en-IN')}</p>
          <ChevronDown size={20} className={`text-[#6B6B7B] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 border-t border-[#F5EFE6] animate-slide-down">
          {/* Category Bars */}
          <div className="py-6 space-y-4">
            {Object.entries(categoryBreakdown).map(([cat, amount]) => {
              const Icon = ICONS[cat] || ICONS.misc;
              const color = COLORS[cat] || COLORS.misc;
              const pct = stopTotal > 0 ? (amount / stopTotal) * 100 : 0;
              return (
                <div key={cat} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-28 flex-shrink-0">
                    <Icon size={14} style={{ color }} />
                    <span className="text-[10px] font-bold text-[#6B6B7B] uppercase truncate">{cat}</span>
                  </div>
                  <div className="flex-1 h-2 bg-[#F5EFE6] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-xs font-bold text-[#1A1A2E] w-20 text-right">{curSym}{amount.toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>

          {/* Activities Table */}
          <div className="rounded-xl border border-[#F5EFE6] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5EFE6] text-[#6B6B7B] font-bold">
                  <th className="px-4 py-2.5">Activity</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act, i) => (
                  <tr key={act.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#FDF8F3]'} border-b border-[#F5EFE6] last:border-0`}>
                    <td className="px-4 py-3 font-medium text-[#1A1A2E]">{act.name}</td>
                    <td className="px-4 py-3 text-[#6B6B7B] capitalize">{act.category}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#1A1A2E]">{curSym}{Number(act.estimated_cost).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Expense Button/Form */}
          <div className="mt-4">
            {showAddForm ? (
              <form onSubmit={handleAdd} className="bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl p-4 flex flex-wrap gap-3 animate-fade-in">
                <input 
                  placeholder="Description" 
                  value={expenseData.name} 
                  onChange={e => setExpenseData({...expenseData, name: e.target.value})}
                  className="flex-1 min-w-[150px] bg-white border border-[#E8E0D5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
                />
                <select 
                  value={expenseData.category}
                  onChange={e => setExpenseData({...expenseData, category: e.target.value})}
                  className="bg-white border border-[#E8E0D5] rounded-lg px-3 py-2 text-xs focus:outline-none"
                >
                  {Object.keys(ICONS).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="number" 
                  placeholder="Cost" 
                  value={expenseData.cost}
                  onChange={e => setExpenseData({...expenseData, cost: e.target.value})}
                  className="w-24 bg-white border border-[#E8E0D5] rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={submitting} className="bg-[#1D9E75] text-white rounded-lg px-4 py-2 text-xs font-bold disabled:opacity-50">{submitting ? <Loader2 size={14} className="animate-spin" /> : 'Save'}</button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="bg-white border border-[#E8E0D5] text-[#6B6B7B] rounded-lg px-4 py-2 text-xs font-bold">Cancel</button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 text-[#1D9E75] text-xs font-bold hover:underline"
              >
                <Plus size={14} /> Add Manual Expense
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
