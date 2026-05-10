import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import StatCard from '../../components/admin/StatCard';
import DarkChart, { chartConfig } from '../../components/admin/DarkChart';
import { Users, Map, Activity, Zap } from 'lucide-react';

const SIGNUP_DATA = [
  { date: 'May 1', count: 12 }, { date: 'May 2', count: 18 }, { date: 'May 3', count: 15 },
  { date: 'May 4', count: 22 }, { date: 'May 5', count: 30 }, { date: 'May 6', count: 28 },
  { date: 'May 7', count: 35 }, { date: 'May 8', count: 42 }, { date: 'May 9', count: 38 },
  { date: 'May 10', count: 45 },
];

const TRIP_DATA = [
  { week: 'Week 1', count: 45 },
  { week: 'Week 2', count: 62 },
  { week: 'Week 3', count: 58 },
  { week: 'Week 4', count: 84 },
];

export default function Overview() {
  return (
    <div className="space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value="1432" icon={Users} color="#3B82F6" trend="up" trendValue="12" />
        <StatCard label="Trips Created" value="842" icon={Map} color="#1D9E75" trend="up" trendValue="8" />
        <StatCard label="Active Users" value="324" icon={Activity} color="#F59E0B" trend="down" trendValue="3" />
        <StatCard label="Activities Planned" value="2412" icon={Zap} color="#8B5CF6" trend="up" trendValue="24" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DarkChart title="User Signups (Last 10 Days)">
          <AreaChart data={SIGNUP_DATA}>
            <defs>
              <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid {...chartConfig.grid} />
            <XAxis dataKey="date" {...chartConfig.axis} />
            <YAxis {...chartConfig.axis} />
            <Tooltip {...chartConfig.tooltip} cursor={chartConfig.tooltip.cursor} />
            <Area type="monotone" dataKey="count" stroke="#1D9E75" strokeWidth={3} fillOpacity={1} fill="url(#signupGradient)" />
          </AreaChart>
        </DarkChart>

        <DarkChart title="Weekly Trip Creation">
          <BarChart data={TRIP_DATA}>
            <CartesianGrid {...chartConfig.grid} />
            <XAxis dataKey="week" {...chartConfig.axis} />
            <YAxis {...chartConfig.axis} />
            <Tooltip {...chartConfig.tooltip} cursor={chartConfig.tooltip.cursor} />
            <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]}>
              {TRIP_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fillOpacity={0.8 + (index * 0.05)} />
              ))}
            </Bar>
          </BarChart>
        </DarkChart>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Avg Trips per User', value: '2.4' },
          { label: 'Most Popular City', value: 'Paris' },
          { label: 'Avg Trip Duration', value: '8.5 days' }
        ].map((s, i) => (
          <div key={i} className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-black text-white mb-1">{s.value}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
