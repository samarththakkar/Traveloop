import { Smile } from 'lucide-react';

const EMOJIS = [
  '✈️', '🗺️', '🏨', '🍽️', '📸', '🎒', '🌍', '🏖️', '🏔️', '🎭', 
  '💰', '🚗', '🚢', '🌅', '🎯', '📍', '⏰', '🌟', '💡', '📝'
];

export default function EmojiPicker({ onSelect, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-[#E8E0D5] rounded-2xl shadow-xl p-3 w-[180px] animate-scale-in">
      <div className="grid grid-cols-5 gap-2">
        {EMOJIS.map(e => (
          <button 
            key={e} 
            onClick={() => { onSelect(e); onClose(); }}
            className="w-7 h-7 flex items-center justify-center text-lg hover:bg-[#FDF8F3] rounded-lg transition-colors"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
