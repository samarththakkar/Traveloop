import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DarkChart, { chartConfig } from '../../components/admin/DarkChart';
import AdminTable, { AdminTableRow, AdminTableCell } from '../../components/admin/AdminTable';

const FEATURE_USAGE = [
  { name: 'Itinerary', value: 85, color: '#1D9E75' },
  { name: 'Budget', value: 62, color: '#3B82F6' },
  { name: 'Checklist', value: 58, color: '#F59E0B' },
  { name: 'Notes', value: 42, color: '#8B5CF6' },
  { name: 'Search', value: 78, color: '#E8593C' },
];

const DAU_DATA = [
  { day: '1', users: 120 }, { day: '5', users: 150 }, { day: '10', users: 140 },
  { day: '15', users: 180 }, { day: '20', users: 210 }, { day: '25', users: 195 },
  { day: '30', users: 240 },
];

const TOP_ACTIVE_USERS = [
  { rank: '🥇', name: 'Samarth Thakkar', trips: 42, activities: 512, notes: 84, lastActive: '2m ago' },
  { rank: '🥈', name: 'Sarah Wilson', trips: 35, activities: 420, notes: 120, lastActive: '15m ago' },
  { rank: '🥉', name: 'Mike Ross', trips: 28, activities: 310, notes: 45, lastActive: '1h ago' },
];

export default function Engagement() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DarkChart title="Feature Adoption Rate (%)">
          <BarChart data={FEATURE_USAGE} layout="vertical">
            <CartesianGrid {...chartConfig.grid} horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" {...chartConfig.axis} width={80} />
            <Tooltip {...chartConfig.tooltip} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {FEATURE_USAGE.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </DarkChart>

        <DarkChart title="Daily Active Users (Last 30 Days)">
          <LineChart data={DAU_DATA}>
            <CartesianGrid {...chartConfig.grid} />
            <XAxis dataKey="day" {...chartConfig.axis} />
            <YAxis {...chartConfig.axis} />
            <Tooltip {...chartConfig.tooltip} />
            <Line type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#1E1E30' }} />
          </LineChart>
        </DarkChart>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-black text-white">Power Users Leaderboard</h3>
        <AdminTable headers={['Rank', 'User', 'Trips', 'Activities', 'Notes', 'Last Active']}>
          {TOP_ACTIVE_USERS.map((user, i) => (
            <AdminTableRow key={i}>
              <AdminTableCell className="text-xl">{user.rank}</AdminTableCell>
              <AdminTableCell className="font-bold text-white">{user.name}</AdminTableCell>
              <AdminTableCell className="text-white/60 font-medium">{user.trips}</AdminTableCell>
              <AdminTableCell className="text-white/60 font-medium">{user.activities}</AdminTableCell>
              <AdminTableCell className="text-white/60 font-medium">{user.notes}</AdminTableCell>
              <AdminTableCell className="text-white/40 font-bold italic">{user.lastActive}</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
