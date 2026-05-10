import { User, Lock, Bell, Globe, MapPin, AlertTriangle } from 'lucide-react';

const SECTIONS = [
  { id: 'profile', label: 'Profile Info', icon: User },
  { id: 'security', label: 'Password & Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'App Preferences', icon: Globe },
  { id: 'destinations', label: 'Saved Destinations', icon: MapPin },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, color: 'text-[#E8593C]' },
];

export default function SettingsNav({ activeSection, onSectionChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] p-4 h-fit sticky top-[100px]">
      <nav className="flex md:flex-col gap-1 overflow-x-auto scrollbar-hide">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => onSectionChange(s.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap md:w-full ${
              activeSection === s.id 
                ? 'bg-[#1D9E75]/10 text-[#1D9E75] border-l-4 border-[#1D9E75] rounded-l-none' 
                : 'text-[#6B6B7B] hover:bg-[#F5EFE6]'
            }`}
          >
            <s.icon size={18} className={s.color || ''} />
            {s.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
