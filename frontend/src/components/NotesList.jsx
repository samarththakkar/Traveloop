import { Search, MapPin, Clock, Pin, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const typeBadgeStyles = {
  trip: 'bg-[#DBEAFE] text-[#2563EB]',
  day: 'bg-[#DCFCE7] text-[#16A34A]',
  reminder: 'bg-[#FEF3C7] text-[#D97706]',
  idea: 'bg-[#EDE9FE] text-[#7C3AED]',
};

export default function NotesList({ 
  notes, 
  selectedId, 
  onSelect, 
  searchQuery, 
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  onPin,
  onDelete
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);

  const pinned = notes.filter(n => n.is_pinned);
  const others = notes.filter(n => !n.is_pinned);

  const renderNote = (note) => {
    const isSelected = selectedId === note.id;
    const isReminder = note.note_type === 'reminder';
    const isOverdue = isReminder && note.reminder_date && new Date(note.reminder_date) < new Date();
    const isToday = isReminder && note.reminder_date && new Date(note.reminder_date).toDateString() === new Date().toDateString();

    return (
      <div 
        key={note.id}
        onClick={() => onSelect(note.id)}
        className={`group relative p-4 cursor-pointer transition-all border-b border-[#E8E0D5] hover:bg-[#F5EFE6]/50 ${
          isSelected ? 'bg-[#F5EFE6] border-l-4 border-l-[#1D9E75]' : ''
        } ${isToday ? 'border-l-4 border-l-[#F59E0B]' : ''} ${isOverdue ? 'border-l-4 border-l-[#E8593C]' : ''}`}
      >
        <div className="flex justify-between items-start mb-1 gap-2">
          <h4 className="text-sm font-bold text-[#1A1A2E] truncate flex-1">{note.title || 'Untitled Note'}</h4>
          <span className="text-[10px] font-bold text-[#6B6B7B] whitespace-nowrap">
            {new Date(note.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${typeBadgeStyles[note.note_type]}`}>
            {note.note_type}
          </span>
          {note.note_type === 'day' && note.linked_day_date && (
            <span className="text-[10px] text-[#6B6B7B] font-medium">• Day {new Date(note.linked_day_date).getDate()}</span>
          )}
          {note.is_pinned && <Pin size={10} className="text-[#1D9E75] fill-[#1D9E75]" />}
          {isReminder && <Clock size={10} className={isOverdue ? 'text-[#E8593C]' : 'text-[#6B6B7B]'} />}
          {isOverdue && <span className="text-[8px] font-black text-[#E8593C] uppercase">Overdue</span>}
        </div>

        <p className="text-[11px] text-[#6B6B7B] line-clamp-2 leading-relaxed italic">
          {note.content ? note.content.substring(0, 60) + (note.content.length > 60 ? '...' : '') : 'No content...'}
        </p>

        {/* Actions Menu */}
        <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === note.id ? null : note.id); }}
            className="p-1 text-[#6B6B7B] hover:text-[#1A1A2E]"
          >
            <MoreVertical size={14} />
          </button>
          {menuOpenId === note.id && (
            <div className="absolute bottom-full right-0 mb-2 bg-white border border-[#E8E0D5] rounded-xl shadow-xl py-1 z-50 min-w-[120px]">
              <button onClick={(e) => { e.stopPropagation(); onPin(note.id, !note.is_pinned); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-[#6B6B7B] hover:bg-[#FDF8F3] hover:text-[#1D9E75] transition-colors">
                {note.is_pinned ? 'Unpin' : 'Pin Note'}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-[#E8593C] hover:bg-[#E8593C]/5 transition-colors">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#E8E0D5]">
      {/* Search & Filter */}
      <div className="p-4 space-y-4 border-b border-[#F5EFE6]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#1D9E75] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {['All', 'Trip', 'Day', 'Reminder', 'Idea'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeFilter === f ? 'bg-[#1D9E75] text-white shadow-sm' : 'bg-[#F5EFE6] text-[#6B6B7B] hover:bg-[#E8E0D5]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {pinned.length > 0 && (
          <div>
            <div className="bg-[#FDF8F3] px-4 py-1.5 border-b border-[#E8E0D5] text-[9px] font-black text-[#6B6B7B] uppercase tracking-[0.2em] flex items-center gap-2">
              <Pin size={10} className="text-[#1D9E75]" /> Pinned
            </div>
            {pinned.map(renderNote)}
          </div>
        )}
        
        {others.length > 0 && (
          <div>
            {pinned.length > 0 && (
              <div className="bg-[#FDF8F3] px-4 py-1.5 border-b border-[#E8E0D5] text-[9px] font-black text-[#6B6B7B] uppercase tracking-[0.2em]">
                Recent Notes
              </div>
            )}
            {others.map(renderNote)}
          </div>
        )}

        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 text-[#E8E0D5] mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <p className="text-xs font-bold text-[#6B6B7B] mb-4">No notes found yet</p>
            <button className="text-xs font-black text-[#1D9E75] hover:underline">Write your first note →</button>
          </div>
        )}
      </div>
    </div>
  );
}
