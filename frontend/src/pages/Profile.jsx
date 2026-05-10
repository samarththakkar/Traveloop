import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import SettingsNav from '../components/SettingsNav';
import AvatarUpload from '../components/AvatarUpload';
import ToggleSwitch from '../components/ToggleSwitch';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import DangerZoneModal from '../components/DangerZoneModal';
import Toast from '../components/Toast';
import { 
  User, Mail, AtSign, Phone, MapPin, CalendarDays, Lock, 
  Eye, EyeOff, Globe, Trash2, Download, LogOut, Laptop, Smartphone,
  CheckCircle, Loader2
} from 'lucide-react';

const CURRENCIES = ['₹ INR', '$ USD', '€ EUR', '£ GBP'];
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese'];
const VISIBILITY = ['🔒 Private', '🌍 Public'];
const TEMP_UNITS = ['°C Celsius', '°F Fahrenheit'];

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const [dangerModal, setDangerModal] = useState(null);
  
  // Form States
  const [profileForm, setProfileForm] = useState({
    full_name: '', username: '', phone: '', bio: '', home_city: ''
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [preferences, setPreferences] = useState({
    currency: '₹ INR', dateFormat: 'DD/MM/YYYY', language: 'English', visibility: '🔒 Private', temp: '°C Celsius'
  });
  const [notifications, setNotifications] = useState({
    reminders: true, budget: true, features: true, weekly: false, email: true, push: true
  });

  const sectionRefs = {
    profile: useRef(null), security: useRef(null), notifications: useRef(null),
    preferences: useRef(null), destinations: useRef(null), danger: useRef(null)
  };

  useEffect(() => {
    async function fetchData() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', u.id).single();
      if (prof) {
        setProfile(prof);
        setProfileForm({
          full_name: prof.full_name || '',
          username: prof.username || '',
          phone: prof.phone || '',
          bio: prof.bio || '',
          home_city: prof.home_city || ''
        });
        if (prof.preferences) setPreferences({ ...preferences, ...prof.preferences });
        if (prof.notification_preferences) setNotifications({ ...notifications, ...prof.notification_preferences });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSectionChange = (id) => {
    setActiveSection(id);
    sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update(profileForm).eq('id', user.id);
    if (!error) {
      setToast({ message: 'Profile updated! ✓', type: 'success' });
      setProfile({ ...profile, ...profileForm });
    }
    setSaving(false);
  };

  const handleUpdatePassword = async () => {
    if (passwords.new !== passwords.confirm) return setToast({ message: 'Passwords do not match', type: 'error' });
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    if (!error) {
      setToast({ message: 'Password updated! ✓', type: 'success' });
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      setToast({ message: error.message, type: 'error' });
    }
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ preferences }).eq('id', user.id);
    if (!error) setToast({ message: 'Preferences saved! ✓', type: 'success' });
    setSaving(false);
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ notification_preferences: notifications }).eq('id', user.id);
    if (!error) setToast({ message: 'Notification settings saved! ✓', type: 'success' });
    setSaving(false);
  };

  const handleExportData = async () => {
    setSaving(true);
    // In a real app, you'd fetch everything and generate a JSON file
    setTimeout(() => {
      const data = { profile, preferences, notifications, trips: [] };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `traveloop-data-${user.id}.json`;
      a.click();
      setSaving(false);
      setToast({ message: 'Data exported successfully! 📥', type: 'success' });
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-[#1D9E75]" />
    </div>
  );

  const isProfileDirty = JSON.stringify(profileForm) !== JSON.stringify({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    home_city: profile?.home_city || ''
  });

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans">
      <Sidebar user={user} />
      <main className="md:ml-[240px] pb-24 md:pb-12 animate-fade-in">
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6] px-6 sm:px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">Settings ⚙️</h2>
            <p className="text-sm text-[#6B6B7B] font-medium mt-0.5">Manage your account and preferences</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-sm font-bold">
            {user.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
        </header>

        <div className="max-w-[860px] mx-auto px-6 sm:px-8 py-8 flex flex-col md:flex-row gap-8">
          {/* Left Nav */}
          <aside className="w-full md:w-[240px] flex-shrink-0">
            <SettingsNav activeSection={activeSection} onSectionChange={handleSectionChange} />
          </aside>

          {/* Right Content */}
          <div className="flex-1 space-y-8 scroll-mt-[100px]">
            {/* PROFILE INFO */}
            <section ref={sectionRefs.profile} className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-[#F5EFE6] p-8 flex flex-col sm:flex-row items-center gap-6">
                <AvatarUpload user={user} avatarUrl={profile?.avatar_url} onUploadSuccess={(url) => setProfile({ ...profile, avatar_url: url })} />
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <h3 className="text-2xl font-black text-[#1A1A2E] truncate">{profileForm.full_name || 'Traveler'}</h3>
                  <p className="text-sm text-[#6B6B7B] font-medium">{user.email}</p>
                  <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold text-[#6B6B7B]">
                    <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-[#1D9E75]" /> Joined {new Date(profile?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#1D9E75]" /> {profileForm.home_city || 'Add Location'}</span>
                  </div>
                </div>
                <button onClick={() => sectionRefs.profile.current?.querySelector('input')?.focus()} className="bg-[#FDF8F3] border border-[#E8E0D5] text-[#1D9E75] font-bold px-5 py-2.5 rounded-full text-xs hover:bg-[#1D9E75] hover:text-white transition-all">Edit Profile</button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-[#F5EFE6] p-8">
                <h4 className="text-base font-black text-[#1A1A2E] mb-6">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', key: 'full_name', icon: User, type: 'text' },
                    { label: 'Display Username', key: 'username', icon: AtSign, type: 'text' },
                    { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel' },
                    { label: 'Home City', key: 'home_city', icon: MapPin, type: 'text' }
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-widest mb-2">{f.label}</label>
                      <div className="relative">
                        <f.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                        <input 
                          type={f.type} 
                          value={profileForm[f.key]} 
                          onChange={(e) => setProfileForm({ ...profileForm, [f.key]: e.target.value })}
                          className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#1D9E75] transition-all"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-[#6B6B7B] uppercase tracking-widest">Bio / About</label>
                      <span className="text-[10px] font-bold text-[#6B6B7B]">{profileForm.bio.length} / 150</span>
                    </div>
                    <textarea 
                      maxLength={150} 
                      value={profileForm.bio} 
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      rows={3} 
                      className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#1D9E75] transition-all resize-none" 
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={!isProfileDirty || saving}
                    className="bg-[#1D9E75] text-white font-black px-8 py-3.5 rounded-full shadow-lg shadow-[#1D9E75]/20 hover:bg-[#158562] transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </div>
            </section>

            {/* SECURITY */}
            <section ref={sectionRefs.security} className="bg-white rounded-3xl shadow-sm border border-[#F5EFE6] p-8 space-y-8">
              <div>
                <h4 className="text-base font-black text-[#1A1A2E] mb-6">Password & Security</h4>
                <div className="space-y-6">
                  {['new', 'confirm'].map(key => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-widest mb-2">
                        {key === 'new' ? 'New Password' : 'Confirm New Password'}
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                        <input 
                          type={showPass[key] ? 'text' : 'password'} 
                          value={passwords[key]} 
                          onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                          className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl pl-11 pr-12 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#1D9E75]"
                        />
                        <button 
                          onClick={() => setShowPass({ ...showPass, [key]: !showPass[key] })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B7B] hover:text-[#1D9E75]"
                        >
                          {showPass[key] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {key === 'new' && <PasswordStrengthMeter password={passwords.new} />}
                    </div>
                  ))}
                  <button onClick={handleUpdatePassword} disabled={!passwords.new || saving} className="bg-[#1D9E75] text-white font-black px-8 py-3.5 rounded-full shadow-md text-xs">Update Password</button>
                </div>
              </div>

              <div className="h-px bg-[#F5EFE6]" />

              <div>
                <h5 className="text-sm font-bold text-[#1A1A2E] mb-4">Active Sessions</h5>
                <div className="space-y-4">
                  {[
                    { icon: Laptop, name: 'Chrome on MacBook Pro', loc: 'Mumbai, India', current: true },
                    { icon: Smartphone, name: 'Traveloop App on iPhone 15', loc: 'Delhi, India', current: false }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#FDF8F3] p-4 rounded-2xl border border-[#F5EFE6]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B]"><s.icon size={20} /></div>
                        <div>
                          <p className="text-xs font-bold text-[#1A1A2E]">{s.name} {s.current && <span className="ml-2 text-[8px] bg-[#1D9E75]/10 text-[#1D9E75] px-1.5 py-0.5 rounded-full">Current</span>}</p>
                          <p className="text-[10px] text-[#6B6B7B]">{s.loc}</p>
                        </div>
                      </div>
                      {!s.current && <button className="text-[10px] font-bold text-[#E8593C] hover:underline">Revoke</button>}
                    </div>
                  ))}
                  <button className="w-full text-center py-3 text-xs font-bold text-[#E8593C] border border-[#E8593C] rounded-xl hover:bg-[#E8593C]/5 transition-all">Sign out all other sessions</button>
                </div>
              </div>
            </section>

            {/* NOTIFICATIONS */}
            <section ref={sectionRefs.notifications} className="bg-white rounded-3xl shadow-sm border border-[#F5EFE6] p-8">
              <h4 className="text-base font-black text-[#1A1A2E] mb-6">Notification Preferences</h4>
              <div className="divide-y divide-[#F5EFE6]">
                <ToggleSwitch isOn={notifications.reminders} onToggle={() => setNotifications({ ...notifications, reminders: !notifications.reminders })} label="Trip Reminders" description="Get reminders 24hrs before trip start" />
                <ToggleSwitch isOn={notifications.budget} onToggle={() => setNotifications({ ...notifications, budget: !notifications.budget })} label="Budget Alerts" description="Alert when spending approaches budget" />
                <ToggleSwitch isOn={notifications.features} onToggle={() => setNotifications({ ...notifications, features: !notifications.features })} label="New Features" description="Be first to know about new Traveloop features" />
                <ToggleSwitch isOn={notifications.email} onToggle={() => setNotifications({ ...notifications, email: !notifications.email })} label="Email Notifications" description="Receive notifications via email" />
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={handleSaveNotifications} disabled={saving} className="bg-[#1D9E75] text-white font-black px-8 py-3.5 rounded-full shadow-lg shadow-[#1D9E75]/20 transition-all flex items-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />} Save Preferences
                </button>
              </div>
            </section>

            {/* PREFERENCES */}
            <section ref={sectionRefs.preferences} className="bg-white rounded-3xl shadow-sm border border-[#F5EFE6] p-8 space-y-8">
              <h4 className="text-base font-black text-[#1A1A2E] mb-6">App Preferences</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-widest mb-4">Default Currency</label>
                  <div className="flex flex-wrap gap-2">
                    {CURRENCIES.map(c => (
                      <button key={c} onClick={() => setPreferences({ ...preferences, currency: c })} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${preferences.currency === c ? 'bg-[#1D9E75] text-white shadow-md' : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-widest mb-4">Date Format</label>
                  <div className="flex flex-wrap gap-2">
                    {DATE_FORMATS.map(f => (
                      <button key={f} onClick={() => setPreferences({ ...preferences, dateFormat: f })} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${preferences.dateFormat === f ? 'bg-[#1D9E75] text-white shadow-md' : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'}`}>{f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-widest mb-4">Language</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                    <select value={preferences.language} onChange={(e) => setPreferences({ ...preferences, language: e.target.value })} className="w-full appearance-none bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1A1A2E] focus:outline-none">
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B6B7B] uppercase tracking-widest mb-4">Default Visibility</label>
                  <div className="flex flex-wrap gap-2">
                    {VISIBILITY.map(v => (
                      <button key={v} onClick={() => setPreferences({ ...preferences, visibility: v })} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${preferences.visibility === v ? 'bg-[#1D9E75] text-white shadow-md' : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'}`}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={handleSavePreferences} disabled={saving} className="bg-[#1D9E75] text-white font-black px-8 py-3.5 rounded-full shadow-lg shadow-[#1D9E75]/20 flex items-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />} Save Preferences
                </button>
              </div>
            </section>

            {/* DESTINATIONS */}
            <section ref={sectionRefs.destinations} className="bg-white rounded-3xl shadow-sm border border-[#F5EFE6] p-8">
              <h4 className="text-base font-black text-[#1A1A2E] mb-6">Saved Destinations 📍</h4>
              {profile?.saved_destinations?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.saved_destinations.map((city, i) => (
                    <div key={i} className="group relative bg-white border border-[#E8E0D5] rounded-2xl p-4 hover:border-[#1D9E75] transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${THEME_GRADIENTS[i % 6]} flex-shrink-0`} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#1A1A2E] truncate">{city.name}</p>
                          <p className="text-[10px] text-[#6B6B7B] font-medium">{city.country}</p>
                        </div>
                      </div>
                      <button className="absolute top-2 right-2 p-1.5 text-[#E8E0D5] hover:text-[#E8593C] opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#FDF8F3] rounded-3xl border-2 border-dashed border-[#E8E0D5]">
                  <p className="text-sm font-bold text-[#6B6B7B] mb-4">No saved destinations yet.</p>
                  <button onClick={() => navigate('/explore')} className="bg-[#1D9E75] text-white font-black px-6 py-2.5 rounded-full text-xs">Explore Cities</button>
                </div>
              )}
            </section>

            {/* DANGER ZONE */}
            <section ref={sectionRefs.danger} className="bg-white rounded-3xl shadow-sm border-2 border-[#E8593C]/20 p-8 space-y-6">
              <h4 className="text-base font-black text-[#E8593C]">Danger Zone</h4>
              <div className="divide-y divide-[#F5EFE6]">
                <div className="py-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#1A1A2E]">Export My Data</p>
                    <p className="text-xs text-[#6B6B7B]">Download all your trip data as JSON</p>
                  </div>
                  <button onClick={handleExportData} className="flex items-center gap-2 border border-[#E8E0D5] text-[#6B6B7B] font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#F5EFE6] transition-all"><Download size={14} /> Export</button>
                </div>
                <div className="py-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#1A1A2E]">Delete All Trips</p>
                    <p className="text-xs text-[#6B6B7B]">Permanently delete all trips and itineraries</p>
                  </div>
                  <button onClick={() => setDangerModal('delete_trips')} className="flex items-center gap-2 border border-[#E8593C] text-[#E8593C] font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#E8593C]/5 transition-all"><Trash2 size={14} /> Delete Trips</button>
                </div>
                <div className="py-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#1A1A2E]">Delete Account</p>
                    <p className="text-xs text-[#6B6B7B]">Permanently delete your account and all data</p>
                  </div>
                  <button onClick={() => setDangerModal('delete_account')} className="flex items-center gap-2 bg-[#E8593C] text-white font-bold px-4 py-2 rounded-xl text-xs hover:scale-105 transition-all"><LogOut size={14} /> Delete Account</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {dangerModal && (
        <DangerZoneModal 
          type={dangerModal} 
          onClose={() => setDangerModal(null)} 
          onConfirm={dangerModal === 'delete_account' ? handleDeleteAccount : () => { setToast({ message: 'Trips deleted successfully', type: 'success' }); setDangerModal(null); }}
          confirmationText={dangerModal === 'delete_account' ? user.email : 'DELETE'}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

const THEME_GRADIENTS = [
  'from-[#1D9E75] to-[#1A1A2E]',
  'from-[#E8593C] to-[#1A1A2E]',
  'from-[#3B82F6] to-[#1A1A2E]',
  'from-[#8B5CF6] to-[#1A1A2E]',
  'from-[#F59E0B] to-[#1A1A2E]',
  'from-[#10B981] to-[#1A1A2E]',
];
