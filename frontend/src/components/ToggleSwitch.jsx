export default function ToggleSwitch({ isOn, onToggle, label, description }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 pr-4">
        <p className="text-sm font-bold text-[#1A1A2E]">{label}</p>
        {description && <p className="text-xs text-[#6B6B7B] mt-0.5">{description}</p>}
      </div>
      <button 
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${
          isOn ? 'bg-[#1D9E75]' : 'bg-[#E8E0D5]'
        }`}
      >
        <div 
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
            isOn ? 'translate-x-5' : 'translate-x-0'
          }`} 
        />
      </button>
    </div>
  );
}
