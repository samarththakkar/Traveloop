import { Trash2, CheckCircle2, ChevronDown } from 'lucide-react';

export default function BulkActionsBar({ 
  selectedCount, 
  onDeleteSelected, 
  onUncheckAll, 
  onMoveToCategory,
  categories 
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:left-[240px] bg-white border-t border-[#E8E0D5] shadow-2xl p-4 sm:px-8 animate-slide-up">
      <div className="max-w-[860px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#1D9E75] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{selectedCount}</div>
          <p className="text-sm font-bold text-[#1A1A2E] hidden sm:block">items selected</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-2 border border-[#E8E0D5] rounded-full px-4 py-2 text-xs font-bold text-[#6B6B7B] hover:bg-[#F5EFE6] transition-all">
              Move to... <ChevronDown size={14} />
            </button>
            <div className="absolute bottom-full mb-2 left-0 bg-white border border-[#E8E0D5] rounded-xl shadow-xl overflow-hidden hidden group-hover:block min-w-[140px]">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => onMoveToCategory(cat)}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#6B6B7B] hover:bg-[#FDF8F3] hover:text-[#1D9E75] transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={onDeleteSelected}
            className="flex items-center gap-2 border border-[#E8593C] rounded-full px-4 py-2 text-xs font-bold text-[#E8593C] hover:bg-[#E8593C]/5 transition-all"
          >
            <Trash2 size={14} /> <span className="hidden sm:inline">Delete Selected</span>
          </button>

          <button 
            onClick={onUncheckAll}
            className="text-xs font-bold text-[#6B6B7B] hover:text-[#1A1A2E] px-2"
          >
            Uncheck All
          </button>
        </div>
      </div>
    </div>
  );
}
