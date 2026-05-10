import { MapPin } from 'lucide-react';

export default function DailyCostTable({ days, currency, totalTripCost }) {
  const curSym = currency.symbol;

  return (
    <div className="bg-white rounded-2xl border border-[#F5EFE6] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#F5EFE6] text-[#6B6B7B] font-bold">
              <th className="px-6 py-4">Day</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">Activities</th>
              <th className="px-6 py-4 text-right">Est. Cost</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => {
              const status = day.cost === 0 ? 'no-activities' : day.overBudget ? 'over' : 'on-track';
              const statusLabel = status === 'no-activities' ? 'No Activities' : status === 'over' ? 'Over Budget' : 'On Track';
              const statusStyles = {
                'no-activities': 'bg-[#F1F5F9] text-[#64748B]',
                'over': 'bg-[#FEE2E2] text-[#DC2626]',
                'on-track': 'bg-[#DCFCE7] text-[#16A34A]'
              };

              return (
                <tr key={i} className={`border-b border-[#F5EFE6] last:border-0 hover:bg-[#FDF8F3] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDF8F3]/50'}`}>
                  <td className="px-6 py-4 font-black text-[#1A1A2E]">{day.dayNum}</td>
                  <td className="px-6 py-4 text-[#6B6B7B] font-medium whitespace-nowrap">
                    {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[#1A1A2E] font-bold">
                      <MapPin size={14} className="text-[#6B6B7B]" />
                      <span className="truncate max-w-[120px]">{day.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#6B6B7B] font-bold">{day.activityCount}</td>
                  <td className="px-6 py-4 text-right font-black text-[#1A1A2E]">{curSym}{day.cost.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}>
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[#F5EFE6]/50 font-black">
              <td colSpan="4" className="px-6 py-5 text-[#1A1A2E] text-right uppercase tracking-widest text-xs">Trip Total</td>
              <td className="px-6 py-5 text-right text-lg text-[#1A1A2E]">{curSym}{totalTripCost.toLocaleString('en-IN')}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
