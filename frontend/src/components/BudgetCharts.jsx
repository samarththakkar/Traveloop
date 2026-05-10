import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, ReferenceLine
} from 'recharts';

const COLORS = {
  transport: '#3B82F6',
  stay: '#8B5CF6',
  activities: '#1D9E75',
  meals: '#F59E0B',
  misc: '#6B7280'
};

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E8E0D5] p-3 rounded-xl shadow-lg">
        <p className="text-xs font-bold text-[#1A1A2E] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs font-bold" style={{ color: p.color || p.fill }}>
            {currency.symbol}{p.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CategoryBarChart({ data, currency }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value,
    cat: name.toLowerCase()
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#F5EFE6] p-6 h-[320px]">
      <h3 className="text-sm font-bold text-[#1A1A2E] mb-6">Spending by Category</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#6B6B7B' }} />
            <YAxis hide />
            <Tooltip cursor={{ fill: '#FDF8F3' }} content={<CustomTooltip currency={currency} />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.cat] || COLORS.misc} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DailyAreaChart({ data, currency, avgSpend }) {
  return (
    <div className="bg-white rounded-2xl border border-[#F5EFE6] p-6 h-[320px]">
      <h3 className="text-sm font-bold text-[#1A1A2E] mb-6">Daily Spending</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#6B6B7B' }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <ReferenceLine y={avgSpend} stroke="#6B6B7B" strokeDasharray="3 3" label={{ position: 'top', value: `Avg ${currency.symbol}${Math.round(avgSpend)}`, fontSize: 10, fill: '#6B6B7B', fontWeight: 600 }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#1D9E75" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorSpend)"
              dot={{ r: 4, fill: '#1D9E75', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
