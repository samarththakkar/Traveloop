import { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import ChecklistItem from './ChecklistItem';

export default function ChecklistCategory({ 
  category, 
  items, 
  color, 
  emoji, 
  onToggle, 
  onDelete, 
  onUpdate, 
  onAddItem 
}) {
  const [expanded, setExpanded] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState(1);

  const packedCount = items.filter(i => i.is_packed).length;
  const totalCount = items.length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddItem(category, newName, newQty);
      setNewName('');
      setNewQty(1);
      setShowAdd(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] overflow-hidden mb-4 transition-all duration-300">
      {/* Header */}
      <div 
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-[#FDF8F3] transition-colors select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{emoji}</span>
          <h3 className="font-bold text-[#1A1A2E] text-[15px]">{category}</h3>
          <div className="flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${color}10`, color: color }}>
            {packedCount} / {totalCount} packed
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowAdd(!showAdd); }}
            className="text-xs font-bold text-[#1D9E75] hover:underline px-2"
          >
            Add Item +
          </button>
          <ChevronDown 
            size={18} 
            className={`text-[#6B6B7B] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Content */}
      <div className={`transition-all duration-300 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-5 pb-4">
          {/* Add Form */}
          {showAdd && (
            <form onSubmit={handleAdd} className="bg-[#FDF8F3] border border-[#E8E0D5] rounded-xl p-3 mb-3 animate-slide-down flex gap-2">
              <input 
                autoFocus
                placeholder="e.g. Sunscreen SPF 50" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 bg-white border border-[#E8E0D5] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
              />
              <input 
                type="number"
                placeholder="Qty"
                value={newQty}
                onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
                className="w-16 bg-white border border-[#E8E0D5] rounded-lg px-2 py-1.5 text-xs text-center"
              />
              <button type="submit" className="bg-[#1D9E75] text-white font-bold px-3 py-1.5 rounded-lg text-xs">Add</button>
              <button type="button" onClick={() => setShowAdd(false)} className="text-[#6B6B7B] p-1.5"><X size={16} /></button>
            </form>
          )}

          {/* Items */}
          <div className="divide-y divide-[#E8E0D5]">
            {items.map(item => (
              <ChecklistItem 
                key={item.id} 
                item={item} 
                onToggle={onToggle} 
                onDelete={onDelete} 
                onUpdate={onUpdate}
              />
            ))}
            {items.length === 0 && !showAdd && (
              <p className="py-4 text-xs text-[#6B6B7B] text-center italic">No items in this category yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
