import { useState } from 'react';
import AdminTable, { AdminTableRow, AdminTableCell } from '../../components/admin/AdminTable';
import { Plus, Search, Edit3, Trash2, PieChart as PieIcon, Globe, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { chartConfig } from '../../components/admin/DarkChart';

const MOCK_CITIES = [
  { id: 1, name: 'Paris', country: 'France', region: 'Europe', budget: 'High', cost: '₹12k', activities: 45 },
  { id: 2, name: 'Bangkok', country: 'Thailand', region: 'Asia', budget: 'Low', cost: '₹3k', activities: 120 },
  { id: 3, name: 'New York', country: 'USA', region: 'Americas', budget: 'High', cost: '₹18k', activities: 84 },
];

const CATEGORY_DATA = [
  { name: 'Sightseeing', value: 400, color: '#1D9E75' },
  { name: 'Food', value: 300, color: '#F59E0B' },
  { name: 'Adventure', value: 200, color: '#3B82F6' },
  { name: 'Culture', value: 100, color: '#8B5CF6' },
];

export default function CitiesActivities() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Cities & Activities</h2>
        <button className="bg-[#1D9E75] text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#1D9E75]/20">
          <Plus size={16} /> Add New City
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Database Content</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="text" placeholder="Search cities..." className="bg-[#1E1E30] border border-[#2A2A40] rounded-full pl-9 pr-4 py-1.5 text-[10px] text-white focus:outline-none w-[180px]" />
            </div>
          </div>
          <AdminTable headers={['City Name', 'Region', 'Budget', 'Avg Cost', 'Activities', 'Actions']}>
            {MOCK_CITIES.map(city => (
              <AdminTableRow key={city.id}>
                <AdminTableCell className="font-bold text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2A2A40] flex items-center justify-center text-[#1D9E75]"><Globe size={16} /></div>
                    <div>
                      <p>{city.name}</p>
                      <p className="text-[10px] text-white/40 font-medium">{city.country}</p>
                    </div>
                  </div>
                </AdminTableCell>
                <AdminTableCell className="text-white/60 font-medium">{city.region}</AdminTableCell>
                <AdminTableCell>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    city.budget === 'High' ? 'bg-[#E8593C]/10 text-[#E8593C]' : 'bg-[#1D9E75]/10 text-[#1D9E75]'
                  }`}>{city.budget}</span>
                </AdminTableCell>
                <AdminTableCell className="text-white/60 font-medium">{city.cost}/day</AdminTableCell>
                <AdminTableCell className="text-white/60 font-medium">{city.activities} items</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-white/40 hover:text-white"><Edit3 size={14} /></button>
                    <button className="p-2 text-white/40 hover:text-[#E8593C]"><Trash2 size={14} /></button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Category Distribution</h3>
          <div className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-6 h-[400px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...chartConfig.tooltip} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 w-full">
              <div className="bg-[#2A2A40] p-4 rounded-2xl text-center">
                <p className="text-xl font-black text-white">412</p>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Total Cities</p>
              </div>
              <div className="bg-[#2A2A40] p-4 rounded-2xl text-center">
                <p className="text-xl font-black text-white">2.4k</p>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Total Activities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
