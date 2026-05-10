import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AdminSidebar from '../components/admin/AdminSidebar';
import Overview from './admin/Overview';
import Users from './admin/Users';
import Trips from './admin/Trips';
import CitiesActivities from './admin/CitiesActivities';
import Engagement from './admin/Engagement';
import AdminSettings from './admin/AdminSettings';
import Toast from '../components/Toast';
import { RotateCcw, Calendar, Loader2 } from 'lucide-react';

export default function Admin() {
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) {
        navigate('/');
        return;
      }
      setUser(u);

      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', u.id).single();
      if (!profile?.is_admin) {
        setToast({ message: 'Access denied. Admins only.', type: 'error' });
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    }
    checkAdmin();
  }, [navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center text-white">
        <Loader2 size={40} className="animate-spin text-[#1D9E75] mb-4" />
        <p className="text-xs font-bold tracking-widest uppercase opacity-60">Verifying Admin Privileges...</p>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return <Overview dateRange={dateRange} />;
      case 'users': return <Users />;
      case 'trips': return <Trips />;
      case 'cities': return <CitiesActivities />;
      case 'engagement': return <Engagement />;
      case 'settings': return <AdminSettings />;
      default: return <Overview />;
    }
  };

  const sectionTitles = {
    overview: 'System Overview',
    users: 'User Management',
    trips: 'Trip Analytics',
    cities: 'Cities & Content',
    engagement: 'User Engagement',
    settings: 'Admin Settings'
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white font-sans flex">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 ml-[240px] flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-[60px] bg-[#0F0F1E] border-b border-[#2A2A40] px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-black tracking-tight">{sectionTitles[activeSection]}</h1>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-[#2A2A40] rounded-xl p-1 gap-1">
              {[
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: '90d', label: '90D' },
                { id: 'all', label: 'ALL' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setDateRange(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    dateRange === r.id ? 'bg-[#1D9E75] text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            
            <button className="p-2 text-white/40 hover:text-[#1D9E75] transition-colors"><RotateCcw size={18} /></button>
            <div className="h-6 w-px bg-[#2A2A40]" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black leading-none">{user.user_metadata?.full_name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-white/40 mt-1">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#3B82F6] flex items-center justify-center text-xs font-bold ring-2 ring-[#2A2A40]">
                {user.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 animate-fade-in overflow-y-auto">
          {renderSection()}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
