import { X, LayoutTemplate, CheckCircle2 } from 'lucide-react';

const templates = [
  {
    id: 'beach',
    name: 'Beach Vacation',
    emoji: '🏖️',
    items: {
      'Clothing': ['Swimsuits', 'Shorts', 'T-shirts', 'Flip flops', 'Sun hat'],
      'Toiletries': ['Sunscreen', 'After-sun lotion', 'Insect repellent'],
      'Accessories': ['Sunglasses', 'Beach towel', 'Dry bag']
    }
  },
  {
    id: 'mountain',
    name: 'Mountain Trek',
    emoji: '🏔️',
    items: {
      'Clothing': ['Hiking boots', 'Thermal layers', 'Rain jacket', 'Thick socks'],
      'Accessories': ['Walking poles', 'Backpack', 'Water bottle'],
      'Health & Medicine': ['Blister pads', 'Muscle balm']
    }
  },
  {
    id: 'city',
    name: 'City Break',
    emoji: '🏙️',
    items: {
      'Clothing': ['Walking sneakers', 'Evening outfit', 'Light sweater'],
      'Accessories': ['Portable charger', 'City map app', 'Earplugs'],
      'Documents': ['Museum tickets', 'Travel insurance']
    }
  },
  {
    id: 'flight',
    name: 'Long Haul Flight',
    emoji: '✈️',
    items: {
      'Clothing': ['Compression socks', 'Comfortable hoodie'],
      'Accessories': ['Neck pillow', 'Eye mask', 'Noise-canceling headphones'],
      'Toiletries': ['Hand sanitizer', 'Lip balm', 'Face mist']
    }
  }
];

export default function TemplateModal({ onClose, onApply }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-[560px] w-full overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-[#F5EFE6] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1D9E75]">
            <LayoutTemplate size={20} />
            <h3 className="font-bold text-[#1A1A2E] text-lg">Load Template</h3>
          </div>
          <button onClick={onClose} className="p-2 text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {templates.map(t => (
            <div key={t.id} className="group border border-[#E8E0D5] rounded-2xl p-5 hover:border-[#1D9E75] hover:bg-[#1D9E75]/5 transition-all cursor-pointer flex flex-col justify-between h-full">
              <div>
                <span className="text-3xl mb-3 block">{t.emoji}</span>
                <h4 className="font-bold text-[#1A1A2E] mb-2">{t.name}</h4>
                <div className="space-y-1">
                  {Object.entries(t.items).slice(0, 2).map(([cat, items]) => (
                    <p key={cat} className="text-[10px] text-[#6B6B7B] font-medium leading-tight">• {cat}: {items.slice(0, 2).join(', ')}...</p>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onApply(t)}
                className="mt-4 w-full bg-[#1D9E75]/10 text-[#1D9E75] font-bold py-2 rounded-xl text-xs group-hover:bg-[#1D9E75] group-hover:text-white transition-all"
              >
                Apply Template
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-[#FDF8F3] border-t border-[#F5EFE6]">
          <p className="text-[11px] text-[#6B6B7B] text-center font-medium italic">Template items will be merged with your current list. No duplicates will be added.</p>
        </div>
      </div>
    </div>
  );
}
