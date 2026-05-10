import { useMemo } from 'react';

export default function PasswordStrengthMeter({ password }) {
  const strength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const levels = [
    { label: 'Too Short', color: 'bg-[#E8E0D5]' },
    { label: 'Weak', color: 'bg-[#E8593C]' },
    { label: 'Fair', color: 'bg-[#F59E0B]' },
    { label: 'Good', color: 'bg-[#3B82F6]' },
    { label: 'Strong', color: 'bg-[#1D9E75]' }
  ];

  const current = levels[strength];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-bold text-[#6B6B7B] uppercase tracking-widest">Strength: {current.label}</p>
        <p className="text-[10px] font-bold text-[#6B6B7B]">{strength}/4</p>
      </div>
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className={`flex-1 rounded-full transition-all duration-500 ${
              i <= strength ? current.color : 'bg-[#F5EFE6]'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}
