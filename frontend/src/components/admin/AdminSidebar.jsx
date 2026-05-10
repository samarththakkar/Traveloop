import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, Users, Map, Globe, Activity, Settings, 
  Compass, ArrowLeft, LayoutDashboard 
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'trips', label: 'Trips', icon: Map },
  { id: 'cities', label: 'Cities & Activities', icon: Globe },
  { id: 'engagement', label: 'Engagement', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="w-[240px] bg-[#0F0F1E] border-r border-[#2A2A40] fixed inset-y-0 left-0 z-50 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center text-white shadow-lg shadow-[#1D9E75]/20">
            <Compass size={20} />
          </div>
          <span className="font-black text-xl text-white tracking-tight">Traveloop</span>
        </Link>
        <span className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-[0.2em] ml-10">Admin Panel</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSection === item.id 
                ? 'bg-[#1D9E75]/20 text-[#1D9E75] border-l-4 border-[#1D9E75] rounded-l-none' 
                : 'text-white/60 hover:bg-[#1E1E30] hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2A40]">
        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#6B6B7B] hover:text-white transition-all">
          <ArrowLeft size={18} />
          Back to App
        </Link>
      </div>
    </aside>
  );
}
