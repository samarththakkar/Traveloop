import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import Toast from '../components/Toast';
import { ChevronLeft, PenLine, Sparkles, Bell, Loader2 } from 'lucide-react';

export default function TripNotes() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      const { data: tripData } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (!tripData) return navigate('/trips');
      setTrip(tripData);

      const { data: notesData } = await supabase
        .from('trip_notes')
        .select('*')
        .eq('trip_id', tripId)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });
      
      setNotes(notesData || []);
      setLoading(false);
    }
    init();
  }, [tripId, navigate]);

  // Filter Logic
  const filteredNotes = useMemo(() => {
    let result = [...notes];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q));
    }
    if (activeFilter !== 'All') {
      result = result.filter(n => n.note_type.toLowerCase() === activeFilter.toLowerCase());
    }
    return result;
  }, [notes, searchQuery, activeFilter]);

  const selectedNote = useMemo(() => notes.find(n => n.id === selectedId), [notes, selectedId]);

  const handleCreateNote = async () => {
    const newNote = {
      trip_id: tripId,
      user_id: user.id,
      title: 'Untitled Note',
      content: '',
      note_type: 'trip',
      is_pinned: false
    };

    const { data, error } = await supabase.from('trip_notes').insert([newNote]).select();
    if (!error) {
      setNotes([data[0], ...notes]);
      setSelectedId(data[0].id);
      setIsMobileEditorOpen(true);
    }
  };

  const handleUpdateNote = async (id, updates) => {
    setIsSaving(true);
    const { error } = await supabase.from('trip_notes').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) {
      setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n));
    }
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleDeleteNote = async (id) => {
    const { error } = await supabase.from('trip_notes').delete().eq('id', id);
    if (!error) {
      setNotes(notes.filter(n => n.id !== id));
      if (selectedId === id) setSelectedId(null);
      setToast({ message: 'Note deleted', type: 'success' });
    }
  };

  const handlePinNote = async (id, isPinned) => {
    const { error } = await supabase.from('trip_notes').update({ is_pinned: isPinned }).eq('id', id);
    if (!error) {
      setNotes(notes.map(n => n.id === id ? { ...n, is_pinned: isPinned } : n));
    }
  };

  const handleDuplicateNote = async (id) => {
    const note = notes.find(n => n.id === id);
    const dup = { ...note, id: undefined, title: `${note.title} (copy)`, updated_at: undefined, created_at: undefined };
    const { data, error } = await supabase.from('trip_notes').insert([dup]).select();
    if (!error) {
      setNotes([data[0], ...notes]);
      setSelectedId(data[0].id);
      setToast({ message: 'Note duplicated', type: 'success' });
    }
  };

  const handleAiSummarize = async () => {
    setAiLoading(true);
    // Mocking Claude API response
    setTimeout(async () => {
      const summaryContent = "This trip to " + trip.name + " was an incredible journey. From exploring the vibrant street food scenes to visiting historic monuments, every moment felt special. Highlights included the local market tours and the breathtaking sunset views. Overall, a well-planned adventure that balanced excitement and relaxation perfectly.";
      
      const newNote = {
        trip_id: tripId,
        user_id: user.id,
        title: `✨ Trip Journal — ${trip.name}`,
        content: summaryContent,
        note_type: 'trip',
        is_pinned: true
      };

      const { data, error } = await supabase.from('trip_notes').insert([newNote]).select();
      if (!error) {
        setNotes([data[0], ...notes]);
        setSelectedId(data[0].id);
        setIsMobileEditorOpen(true);
        setToast({ message: 'Journal entry created! ✨', type: 'success' });
      }
      setAiLoading(false);
    }, 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && selectedId) {
        e.preventDefault();
        setToast({ message: 'Saved ✓', type: 'success' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, notes]);

  if (loading) return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-[#1D9E75]" />
    </div>
  );

  const initials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T';

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans flex flex-col h-screen overflow-hidden">
      <Sidebar user={user} />
      <main className="md:ml-[240px] flex-1 flex flex-col h-full relative animate-fade-in">
        {/* Header */}
        <header className="bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#F5EFE6] px-6 sm:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/trips/${tripId}/view`)} className="w-9 h-9 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center text-[#6B6B7B] hover:text-[#1A1A2E] transition-all"><ChevronLeft size={18} /></button>
            <div>
              <h2 className="text-xl font-black text-[#1A1A2E] tracking-tight">{trip?.name}</h2>
              <p className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-[0.15em] mt-0.5">Notes & Journal 📓</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleAiSummarize}
              disabled={aiLoading}
              className="flex items-center gap-2 bg-white border border-[#1D9E75] text-[#1D9E75] font-black text-[10px] px-4 py-2.5 rounded-full transition-all hover:bg-[#1D9E75] hover:text-white disabled:opacity-50"
            >
              {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              <span className="hidden sm:inline">{aiLoading ? 'Summarizing...' : 'AI Summarize'}</span>
            </button>
            <button 
              onClick={handleCreateNote}
              className="flex items-center gap-2 bg-[#1D9E75] text-white font-black text-[10px] px-4 py-2.5 rounded-full transition-all hover:bg-[#158562] shadow-lg shadow-[#1D9E75]/20"
            >
              <PenLine size={12} /> <span className="hidden sm:inline">New Note</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
          </div>
        </header>

        {/* Content Panel */}
        <div className="flex-1 flex overflow-hidden relative">
          <div className={`w-full md:w-[300px] shrink-0 h-full ${isMobileEditorOpen ? 'hidden md:block' : 'block'}`}>
            <NotesList 
              notes={filteredNotes} 
              selectedId={selectedId} 
              onSelect={(id) => { setSelectedId(id); setIsMobileEditorOpen(true); }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              onPin={handlePinNote}
              onDelete={handleDeleteNote}
            />
          </div>
          <div className={`flex-1 h-full ${isMobileEditorOpen ? 'block' : 'hidden md:block'}`}>
            <NoteEditor 
              note={selectedNote} 
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              onDuplicate={handleDuplicateNote}
              onShare={(note) => {
                navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
                setToast({ message: 'Note copied to clipboard!', type: 'success' });
              }}
              isSaving={isSaving}
              onCloseMobile={() => setIsMobileEditorOpen(false)}
            />
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
