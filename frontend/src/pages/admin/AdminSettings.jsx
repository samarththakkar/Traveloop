import { useState } from 'react';
import { Save, AlertCircle, Database, Megaphone, Trash2 } from 'lucide-react';
import ToggleSwitch from '../../components/ToggleSwitch';

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false);
  const [signups, setSignups] = useState(true);

  return (
    <div className="max-w-[800px] space-y-8">
      {/* Platform Settings */}
      <div className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-8 space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]"><Save size={20} /></div>
          <h3 className="text-xl font-black text-white">Platform Settings</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0F0F1E] rounded-xl border border-[#2A2A40]">
              <div>
                <p className="text-xs font-bold text-white">Maintenance Mode</p>
                <p className="text-[10px] text-white/40">Block app access for updates</p>
              </div>
              <button 
                onClick={() => setMaintenance(!maintenance)}
                className={`relative w-10 h-5 rounded-full transition-all ${maintenance ? 'bg-[#E8593C]' : 'bg-[#2A2A40]'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all ${maintenance ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0F0F1E] rounded-xl border border-[#2A2A40]">
              <div>
                <p className="text-xs font-bold text-white">Allow New Signups</p>
                <p className="text-[10px] text-white/40">Enable/disable user registration</p>
              </div>
              <button 
                onClick={() => setSignups(!signups)}
                className={`relative w-10 h-5 rounded-full transition-all ${signups ? 'bg-[#1D9E75]' : 'bg-[#2A2A40]'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all ${signups ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Max Trips Per User</label>
              <input type="number" defaultValue={20} className="w-full bg-[#0F0F1E] border border-[#2A2A40] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">API Rate Limit (req/min)</label>
              <input type="number" defaultValue={60} className="w-full bg-[#0F0F1E] border border-[#2A2A40] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1D9E75]" />
            </div>
          </div>
        </div>
        
        <button className="bg-[#1D9E75] text-white font-black px-8 py-3.5 rounded-xl text-xs shadow-lg shadow-[#1D9E75]/20 hover:scale-105 transition-all">Save Platform Settings</button>
      </div>

      {/* Announcements */}
      <div className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]"><Megaphone size={20} /></div>
          <h3 className="text-xl font-black text-white">Platform Announcement</h3>
        </div>
        <textarea 
          placeholder="Type an announcement message to show to all users..." 
          className="w-full bg-[#0F0F1E] border border-[#2A2A40] rounded-xl px-4 py-4 text-sm text-white focus:outline-none h-32 resize-none"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showAnn" className="accent-[#1D9E75]" />
            <label htmlFor="showAnn" className="text-xs font-bold text-white/60">Show announcement to all users</label>
          </div>
          <button className="bg-[#3B82F6] text-white font-black px-8 py-3.5 rounded-xl text-xs shadow-lg shadow-[#3B82F6]/20 transition-all">Publish Announcement</button>
        </div>
      </div>

      {/* Database Health */}
      <div className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8593C]/10 flex items-center justify-center text-[#E8593C]"><Database size={20} /></div>
          <h3 className="text-xl font-black text-white">System Health</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Trips', count: '842' }, { label: 'Users', count: '143' },
            { label: 'Activities', count: '2.4k' }, { label: 'Stops', count: '3.1k' },
            { label: 'Notes', count: '5.2k' }, { label: 'Checklist', count: '12.4k' }
          ].map((t, i) => (
            <div key={i} className="bg-[#0F0F1E] p-4 rounded-xl border border-[#2A2A40]">
              <p className="text-lg font-black text-white">{t.count}</p>
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{t.label} Rows</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-white/40 flex items-center gap-2 italic"><AlertCircle size={14} /> Last cleanup run 4 days ago</p>
          <button className="flex items-center gap-2 text-[#E8593C] font-black text-xs hover:underline"><Trash2 size={16} /> Run Orphan Cleanup</button>
        </div>
      </div>
    </div>
  );
}
