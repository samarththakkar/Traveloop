import { useState, useEffect, useRef } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Highlighter, 
  Link2, Smile, Copy, Trash2, Share2, PenLine, ChevronLeft, Loader2
} from 'lucide-react';
import NoteTypeSelector from './NoteTypeSelector';
import EmojiPicker from './EmojiPicker';

export default function NoteEditor({ 
  note, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onShare,
  isSaving,
  onCloseMobile
}) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [type, setType] = useState(note?.note_type || 'trip');
  const [showEmojis, setShowEmojis] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  const textareaRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setType(note.note_type || 'trip');
      setDeleteConfirm(false);
    }
  }, [note?.id]);

  // Handle auto-save trigger on local change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (note && (title !== note.title || content !== note.content || type !== note.note_type)) {
        onUpdate(note.id, { title, content, note_type: type });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [title, content, type]);

  if (!note) {
    return (
      <div className="flex-1 bg-[#FDFCFA] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 text-[#E8E0D5] mb-6 animate-float">
          <PenLine size={80} />
        </div>
        <h3 className="text-xl font-black text-[#1A1A2E] mb-2">Select a note to read or edit</h3>
        <p className="text-sm text-[#6B6B7B] mb-8">Or create a new one to capture your thoughts.</p>
      </div>
    );
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newText);
    textarea.focus();
  };

  return (
    <div className="flex-1 bg-[#FDFCFA] flex flex-col h-full animate-fade-in">
      {/* Header */}
      <header className="px-6 sm:px-10 py-6 border-b border-[#E8E0D5]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onCloseMobile} className="md:hidden p-2 -ml-2 text-[#6B6B7B] hover:text-[#1A1A2E]"><ChevronLeft size={20} /></button>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="flex-1 text-2xl sm:text-3xl font-black text-[#1A1A2E] bg-transparent focus:outline-none placeholder-[#E8E0D5]"
          />
          <div className="flex-shrink-0 flex items-center gap-2">
            {isSaving ? (
              <span className="text-[10px] font-bold text-[#1D9E75] animate-pulse">Saving...</span>
            ) : (
              <span className="text-[10px] font-bold text-[#1D9E75] opacity-50">Saved ✓</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <NoteTypeSelector value={type} onChange={setType} isOpen={typeOpen} setIsOpen={setTypeOpen} />
          <div className="h-4 w-px bg-[#E8E0D5]" />
          <span className="text-[#6B6B7B] font-medium">Last edited {new Date(note.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-6 sm:px-10 py-2 border-b border-[#E8E0D5] flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {[
          { icon: Bold, action: () => insertText('**', '**'), label: 'Bold' },
          { icon: Italic, action: () => insertText('_', '_'), label: 'Italic' },
          { icon: Underline, action: () => insertText('<u>', '</u>'), label: 'Underline' },
          { separator: true },
          { icon: List, action: () => insertText('\n• '), label: 'Bullets' },
          { icon: ListOrdered, action: () => insertText('\n1. '), label: 'Numbered' },
          { separator: true },
          { icon: Highlighter, action: () => insertText('==', '=='), label: 'Highlight' },
          { icon: Link2, action: () => insertText('[', '](url)'), label: 'Link' },
        ].map((btn, i) => btn.separator ? (
          <div key={`sep-${i}`} className="w-px h-6 bg-[#E8E0D5] mx-1" />
        ) : (
          <button 
            key={i} 
            onClick={btn.action}
            title={btn.label}
            className="p-1.5 rounded-lg text-[#6B6B7B] hover:text-[#1A1A2E] hover:bg-[#F5EFE6] transition-all"
          >
            <btn.icon size={16} />
          </button>
        ))}
        <div className="w-px h-6 bg-[#E8E0D5] mx-1" />
        <div className="relative">
          <button 
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-1.5 rounded-lg text-[#6B6B7B] hover:text-[#1A1A2E] hover:bg-[#F5EFE6] transition-all"
          >
            <Smile size={16} />
          </button>
          {showEmojis && <EmojiPicker onSelect={(e) => insertText(e)} onClose={() => setShowEmojis(false)} />}
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 px-6 sm:px-10 py-8 relative">
        <textarea 
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note... Use this space for hotel info, daily highlights, or anything you don't want to forget."
          className="w-full h-full bg-transparent focus:outline-none text-[15px] text-[#1A1A2E] leading-relaxed resize-none scrollbar-hide"
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              insertText('  ');
            }
          }}
        />
        <div className="absolute bottom-6 right-10 text-[10px] font-bold text-[#6B6B7B] uppercase tracking-widest bg-white/80 px-2 py-1 rounded">
          {wordCount} words
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-4 border-t border-[#E8E0D5] flex items-center justify-between">
        <div className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-widest">
          {wordCount} words · {charCount} chars
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onDuplicate(note.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E0D5] text-[10px] font-bold text-[#6B6B7B] hover:bg-[#FDF8F3] transition-all"><Copy size={12} /> Duplicate</button>
          <button 
            onClick={() => deleteConfirm ? onDelete(note.id) : setDeleteConfirm(true)}
            onMouseLeave={() => setDeleteConfirm(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold ${
              deleteConfirm ? 'bg-[#E8593C] text-white border-[#E8593C] animate-pulse' : 'border-[#E8E0D5] text-[#E8593C] hover:bg-[#E8593C]/5'
            }`}
          >
            <Trash2 size={12} /> {deleteConfirm ? 'Sure? Yes' : 'Delete'}
          </button>
          <button onClick={() => onShare(note)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1D9E75] text-[10px] font-bold text-[#1D9E75] hover:bg-[#1D9E75]/5 transition-all"><Share2 size={12} /> Share</button>
        </div>
      </footer>
    </div>
  );
}
