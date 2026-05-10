import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { House, Map, Compass, Wallet, UserRound, LogOut } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: House, path: '/dashboard' },
  { label: 'My Trips', icon: Map, path: '/trips' },
  { label: 'Explore', icon: Compass, path: '/explore' },
  { label: 'Budget', icon: Wallet, path: '/budget' },
  { label: 'Profile', icon: UserRound, path: '/profile' },
];

export default function Sidebar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler';
  const email = user?.email || '';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] h-screen bg-white border-r border-[#E8E0D5] fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#F5EFE6]">
          <h1 className="text-[#1D9E75] font-bold text-2xl tracking-tight">
            Traveloop <span className="text-lg">✈</span>
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#1D9E75]/10 text-[#1D9E75] border-l-[3px] border-[#1D9E75]'
                    : 'text-[#6B6B7B] hover:bg-[#F5EFE6] hover:text-[#1A1A2E] border-l-[3px] border-transparent'
                }`
              }
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-[#F5EFE6]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1A1A2E] truncate">{fullName}</p>
              <p className="text-xs text-[#6B6B7B] truncate">{email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-[#E8593C] hover:bg-[#E8593C]/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E0D5] px-2 py-2 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all ${
                isActive ? 'text-[#1D9E75]' : 'text-[#6B6B7B]'
              }`
            }
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
