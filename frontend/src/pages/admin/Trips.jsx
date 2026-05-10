import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminTable, { AdminTableRow, AdminTableCell } from '../../components/admin/AdminTable';
import DarkChart, { chartConfig } from '../../components/admin/DarkChart';
import { Map, Eye, Trash2, Globe, Lock } from 'lucide-react';

const MOCK_TRIPS = [
  { id: 1, name: 'Summer in Europe', owner: 'Samarth T.', cities: 4, dates: 'Jun 12 - Jun 25', activities: 24, budget: '₹85k', visibility: 'Public', status: 'Upcoming' },
  { id: 2, name: 'Tokyo Food Tour', owner: 'Priya S.', cities: 2, dates: 'Jul 05 - Jul 12', activities: 18, budget: '₹120k', visibility: 'Private', status: 'Planning' },
  { id: 3, name: 'Goa Weekend', owner: 'John D.', cities: 1, dates: 'May 20 - May 22', activities: 6, budget: '₹15k', visibility: 'Public', status: 'Completed' },
];

const TOP_CITIES = [
  { name: 'Paris', count: 145 },
  { name: 'London', count: 120 },
  { name: 'Tokyo', count: 98 },
  { name: 'New York', count: 84 },
  { name: 'Goa', count: 76 },
  { name: 'Rome', count: 65 },
  { name: 'Dubai', count: 52 },
];

export default function Trips() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: '842', color: '#1D9E75' },
          { label: 'Public Trips', value: '312', color: '#3B82F6' },
          { label: 'Private Trips', value: '530', color: '#6B6B7B' },
          { label: 'Avg Activities', value: '14', color: '#8B5CF6' }
        ].map((s, i) => (
          <div key={i} className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-4 flex items-center gap-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: s.color + '20', color: s.color }}>
              <Map size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{s.label}</p>
              <p className="text-lg font-black text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-black text-white">Recent Trip Activity</h3>
          <AdminTable headers={['Trip Name', 'Owner', 'Cities', 'Activities', 'Visibility', 'Status', 'Actions']}>
            {MOCK_TRIPS.map(trip => (
              <AdminTableRow key={trip.id}>
                <AdminTableCell className="font-bold text-white">{trip.name}</AdminTableCell>
                <AdminTableCell className="text-white/60 font-medium">{trip.owner}</AdminTableCell>
                <AdminTableCell className="text-white/60">{trip.cities}</AdminTableCell>
                <AdminTableCell className="text-white/60">{trip.activities}</AdminTableCell>
                <AdminTableCell>
                  <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${trip.visibility === 'Public' ? 'text-[#1D9E75]' : 'text-white/40'}`}>
                    {trip.visibility === 'Public' ? <Globe size={10} /> : <Lock size={10} />}
                    {trip.visibility}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded text-[8px] font-black uppercase">{trip.status}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-white/40 hover:text-white"><Eye size={14} /></button>
                    <button className="p-2 text-white/40 hover:text-[#E8593C]"><Trash2 size={14} /></button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black text-white">Top Destinations</h3>
          <div className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_CITIES} layout="vertical">
                <CartesianGrid {...chartConfig.grid} horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" {...chartConfig.axis} width={70} />
                <Tooltip {...chartConfig.tooltip} cursor={chartConfig.tooltip.cursor} />
                <Bar dataKey="count" fill="#1D9E75" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
