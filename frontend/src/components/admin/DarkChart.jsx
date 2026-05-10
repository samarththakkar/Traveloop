import { ResponsiveContainer } from 'recharts';

export default function DarkChart({ title, children }) {
  return (
    <div className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-6 shadow-xl h-[360px] flex flex-col">
      <h3 className="text-sm font-bold text-white/80 mb-6 uppercase tracking-widest">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export const chartConfig = {
  axis: {
    fontSize: 10,
    fontWeight: 600,
    fill: 'rgba(255, 255, 255, 0.4)',
  },
  grid: {
    stroke: '#2A2A40',
    strokeDasharray: '3 3',
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#0F0F1E',
      border: '1px solid #2A2A40',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 700,
      color: '#fff',
      padding: '12px'
    },
    itemStyle: { color: '#fff' },
    cursor: { fill: 'rgba(255, 255, 255, 0.05)' }
  }
};
