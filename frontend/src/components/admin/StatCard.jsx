import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StatCard({ label, value, icon: Icon, color, trend, trendValue }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (start === end) {
      setDisplayValue(value);
      return;
    }
    
    let timer = setInterval(() => {
      start += Math.ceil((end - start) / 10);
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(start);
    }, 50);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`} style={{ backgroundColor: color }}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
            trend === 'up' ? 'bg-[#1D9E75]/20 text-[#1D9E75]' : 'bg-[#E8593C]/20 text-[#E8593C]'
          }`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}%
          </div>
        )}
      </div>
      <h2 className="text-3xl font-black text-white mb-1">{displayValue.toLocaleString()}</h2>
      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{label}</p>
    </div>
  );
}
