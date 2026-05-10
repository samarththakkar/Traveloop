import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Pencil, Check, X, Landmark, Utensils, Car, Hotel, Package } from 'lucide-react';

const COLORS = {
  transport: '#3B82F6',
  stay: '#8B5CF6',
  activities: '#1D9E75',
  meals: '#F59E0B',
  misc: '#6B7280'
};

const ICONS = {
  transport: Car,
  stay: Hotel,
  activities: Landmark,
  meals: Utensils,
  misc: Package
};

export default function BudgetOverviewCard({ budget, totalSpent, categoryTotals, currency, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const pct = budget > 0 ? (totalSpent / budget) * 100 : 0;
    const timer = setTimeout(() => setProgress(Math.min(pct, 100)), 100);
    return () => clearTimeout(timer);
  }, [totalSpent, budget]);

  const chartData = Object.entries(categoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([key, value]) => ({ name: key, value }));

  const remaining = Math.max(0, budget - totalSpent);
  const curSym = currency.symbol;

  const barColor = progress > 90 ? 'bg-[#E8593C]' : progress > 70 ? 'bg-[#F59E0B]' : 'bg-[#1D9E75]';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] p-7 transition-all">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left Info */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <p className="text-xs font-bold text-[#6B6B7B] uppercase tracking-widest">Total Estimated Budget</p>
          {isEditing ? (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-2xl font-bold text-[#1A1A2E]">{curSym}</span>
              <input 
                type="number" 
                value={newBudget} 
                onChange={(e) => setNewBudget(e.target.value)}
                autoFocus
                className="text-2xl font-bold text-[#1A1A2E] bg-[#FDF8F3] border border-[#1D9E75] rounded-lg px-2 py-1 w-32 focus:outline-none"
              />
              <button onClick={() => { onUpdateBudget(newBudget); setIsEditing(false); }} className="p-1.5 bg-[#1D9E75] text-white rounded-lg"><Check size={18} /></button>
              <button onClick={() => { setIsEditing(false); setNewBudget(budget); }} className="p-1.5 bg-[#F5EFE6] text-[#6B6B7B] rounded-lg"><X size={18} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 justify-center md:justify-start group">
              <h1 className="text-4xl font-black text-[#1A1A2E]">{curSym}{budget.toLocaleString('en-IN')}</h1>
              <button onClick={() => setIsEditing(true)} className="p-2 text-[#6B6B7B] hover:text-[#1D9E75] transition-colors opacity-0 group-hover:opacity-100"><Pencil size={18} /></button>
            </div>
          )}
          {!budget && <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-[#1D9E75] hover:underline">Set Budget</button>}
        </div>

        {/* Right Donut */}
        <div className="w-40 h-40 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.length > 0 ? chartData : [{ name: 'empty', value: 1 }]}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.length > 0 ? chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()] || COLORS.misc} />
                )) : <Cell fill="#F5EFE6" />}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-bold text-[#6B6B7B] uppercase">Total Spent</p>
            <p className="text-sm font-black text-[#1A1A2E]">{curSym}{totalSpent.toLocaleString('en-IN', { notation: 'compact' })}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 space-y-2">
        <div className="w-full h-3 bg-[#F5EFE6] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-bold">
          <span className="text-[#1A1A2E]">{curSym}{totalSpent.toLocaleString('en-IN')} spent</span>
          <span className="text-[#6B6B7B]">{curSym}{remaining.toLocaleString('en-IN')} remaining</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Object.entries(categoryTotals).map(([cat, amount]) => {
          const Icon = ICONS[cat.toLowerCase()] || ICONS.misc;
          const color = COLORS[cat.toLowerCase()] || COLORS.misc;
          const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
          return (
            <div key={cat} className="flex-shrink-0 bg-white border border-[#E8E0D5] rounded-xl p-4 min-w-[140px] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                  <Icon size={14} />
                </div>
                <span className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-wider">{cat}</span>
              </div>
              <p className="text-sm font-bold text-[#1A1A2E]">{curSym}{amount.toLocaleString('en-IN')}</p>
              <p className="text-[10px] font-medium text-[#6B6B7B]">{pct}% of total</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
