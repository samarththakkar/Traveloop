export default function TripSummaryCard({ stops, activities, trip }) {
  const totalStops = stops.length;
  const totalActivities = activities.length;
  const totalDays = trip?.start_date && trip?.end_date
    ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 864e5)
    : 0;
  const totalCost = activities.reduce((s, a) => s + (Number(a.estimated_cost) || 0), 0);
  const budget = Number(trip?.estimated_budget) || 0;
  const pct = budget > 0 ? Math.round((totalCost / budget) * 100) : 0;
  const barColor = pct > 100 ? 'bg-[#E8593C]' : pct > 80 ? 'bg-[#F59E0B]' : 'bg-[#1D9E75]';
  const cur = trip?.currency === 'USD' ? '$' : trip?.currency === 'EUR' ? '€' : '₹';

  const stats = [
    { label: 'Total Stops', value: totalStops },
    { label: 'Total Activities', value: totalActivities },
    { label: 'Total Days', value: totalDays },
    { label: 'Est. Cost', value: `${cur}${totalCost.toLocaleString('en-IN')}` },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F5EFE6] p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-[#1A1A2E]">{s.value}</p>
            <p className="text-xs text-[#6B6B7B] font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {budget > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#6B6B7B] mb-1.5">
            <span>Budget Usage</span>
            <span>{cur}{totalCost.toLocaleString('en-IN')} of {cur}{budget.toLocaleString('en-IN')} ({pct}%)</span>
          </div>
          <div className="w-full h-2.5 bg-[#F5EFE6] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
