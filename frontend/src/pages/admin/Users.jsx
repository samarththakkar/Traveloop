import { useState } from 'react';
import AdminTable, { AdminTableRow, AdminTableCell } from '../../components/admin/AdminTable';
import { Search, Eye, Shield, Ban, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: 'Samarth Thakkar', email: 'samarth@example.com', joined: '12 May 2025', trips: 12, status: 'Active', role: 'Admin' },
  { id: 2, name: 'Priya Sharma', email: 'priya@travel.com', joined: '15 May 2025', trips: 4, status: 'Active', role: 'User' },
  { id: 3, name: 'John Doe', email: 'john@doe.com', joined: '18 May 2025', trips: 1, status: 'Inactive', role: 'User' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@globetrotter.com', joined: '20 May 2025', trips: 8, status: 'Active', role: 'User' },
  { id: 5, name: 'Mike Ross', email: 'mike@ross.com', joined: '22 May 2025', trips: 0, status: 'Active', role: 'User' },
];

export default function Users() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-white">All Users</h2>
          <span className="bg-[#1D9E75]/20 text-[#1D9E75] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">143 Total</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1E1E30] border border-[#2A2A40] rounded-full pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1D9E75] transition-all w-[240px]"
            />
          </div>
          <button className="flex items-center gap-2 border border-[#2A2A40] text-white/60 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-[#2A2A40] transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <AdminTable headers={['User', 'Joined', 'Trips', 'Status', 'Role', 'Actions']}>
        {MOCK_USERS.map(user => (
          <AdminTableRow key={user.id}>
            <AdminTableCell className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1A1A2E] flex items-center justify-center text-xs font-black shadow-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-[10px] text-white/40 font-medium">{user.email}</p>
              </div>
            </AdminTableCell>
            <AdminTableCell className="text-white/60 font-medium">{user.joined}</AdminTableCell>
            <AdminTableCell>
              <span className="bg-[#1D9E75]/10 text-[#1D9E75] px-2.5 py-1 rounded-full text-[10px] font-black">
                {user.trips} Trips
              </span>
            </AdminTableCell>
            <AdminTableCell>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                user.status === 'Active' ? 'bg-[#1D9E75]/10 text-[#1D9E75]' : 'bg-white/5 text-white/40'
              }`}>
                {user.status}
              </span>
            </AdminTableCell>
            <AdminTableCell>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                user.role === 'Admin' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-white/5 text-white/40'
              }`}>
                {user.role}
              </span>
            </AdminTableCell>
            <AdminTableCell>
              <div className="flex items-center gap-2">
                <button className="p-2 text-white/40 hover:text-white transition-colors" title="View Profile"><Eye size={16} /></button>
                <button className="p-2 text-white/40 hover:text-[#F59E0B] transition-colors" title="Toggle Admin"><Shield size={16} /></button>
                <button className="p-2 text-white/40 hover:text-[#E8593C] transition-colors" title="Ban User"><Ban size={16} /></button>
              </div>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>

      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-white/40">Showing 1–5 of 143 users</p>
        <div className="flex items-center gap-1">
          <button className="p-2 text-white/40 hover:text-white"><ChevronLeft size={20} /></button>
          {[1, 2, 3].map(p => (
            <button key={p} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === 1 ? 'bg-[#1D9E75] text-white shadow-lg' : 'text-white/40 hover:bg-[#2A2A40]'}`}>{p}</button>
          ))}
          <button className="p-2 text-white/40 hover:text-white"><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
}
