import { useState, useEffect, useRef } from 'react';
import { Check, Trash2, Pencil, GripVertical, CheckCircle2 } from 'lucide-react';

export default function ChecklistItem({ item, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQty, setEditQty] = useState(item.quantity || 1);
  const [isHighlight, setIsHighlight] = useState(item.isNew);

  useEffect(() => {
    if (item.isNew) {
      const timer = setTimeout(() => setIsHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [item.isNew]);

  const handleUpdate = () => {
    if (editName.trim() && (editName !== item.name || editQty !== item.quantity)) {
      onUpdate(item.id, { name: editName, quantity: editQty });
    }
    setIsEditing(false);
  };

  return (
    <div className={`group flex items-center gap-4 py-3 border-b border-[#E8E0D5] last:border-0 transition-all duration-500 ${isHighlight ? 'bg-yellow-50' : 'bg-transparent'}`}>
      {/* Custom Checkbox */}
      <button 
        onClick={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 active:scale-90 ${
          item.is_packed ? 'bg-[#1D9E75] scale-110 shadow-sm' : 'border-2 border-[#E8E0D5] hover:border-[#1D9E75]/50'
        }`}
      >
        {item.is_packed && <Check size={14} className="text-white" />}
      </button>

      {/* Item Name */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input 
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              className="w-full bg-white border border-[#1D9E75] rounded px-2 py-0.5 text-sm focus:outline-none"
            />
            <input 
              type="number"
              value={editQty}
              onChange={(e) => setEditQty(parseInt(e.target.value) || 1)}
              className="w-12 bg-white border border-[#E8E0D5] rounded px-1 py-0.5 text-xs text-center"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className={`text-sm transition-all duration-300 truncate relative ${
              item.is_packed ? 'text-[#6B6B7B] italic' : 'text-[#1A1A2E] font-medium'
            }`}>
              {item.name}
              {item.is_packed && (
                <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#6B6B7B]/50 animate-strikethrough" />
              )}
            </p>
            {item.quantity > 1 && (
              <span className="text-[10px] font-bold bg-[#F5EFE6] text-[#6B6B7B] px-1.5 py-0.5 rounded">x{item.quantity}</span>
            )}
            {item.source === 'ai' && <span className="text-[8px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] px-1 rounded-full uppercase">✨ AI</span>}
            {item.source === 'template' && <span className="text-[8px] font-bold bg-[#6B6B7B]/10 text-[#6B6B7B] px-1 rounded-full uppercase">Template</span>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="p-1.5 text-[#6B6B7B] hover:text-[#1D9E75] hover:bg-[#1D9E75]/5 rounded-lg transition-all"><Pencil size={14} /></button>
        <button onClick={() => onDelete(item.id)} className="p-1.5 text-[#6B6B7B] hover:text-[#E8593C] hover:bg-[#E8593C]/5 rounded-lg transition-all"><Trash2 size={14} /></button>
        <button className="p-1.5 text-[#E8E0D5] cursor-grab active:cursor-grabbing"><GripVertical size={14} /></button>
      </div>
    </div>
  );
}
