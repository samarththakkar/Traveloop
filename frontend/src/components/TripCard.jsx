import { useNavigate } from 'react-router-dom';

const gradients = [
  'from-[#1D9E75] to-[#0d7a5a]',
  'from-[#E8593C] to-[#c44329]',
  'from-[#1A1A2E] to-[#2d2d5e]',
  'from-[#4285F4] to-[#2b6fcb]',
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TripCard({ trip, index = 0 }) {
  const navigate = useNavigate();
  const grad = gradients[index % gradients.length];

  const startDate = formatDate(trip.start_date);
  const endDate = formatDate(trip.end_date);
  const cityCount = Array.isArray(trip.cities) ? trip.cities.length : (trip.cities || 0);

  const isUpcoming = trip.start_date && new Date(trip.start_date) > new Date();
  const statusLabel = isUpcoming ? 'Upcoming' : (trip.status || 'Planning');
  const statusColor = isUpcoming
    ? 'bg-[#1D9E75]/15 text-[#1D9E75]'
    : 'bg-[#F5EFE6] text-[#E8593C]';

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="w-[240px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-[#F5EFE6] overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group"
    >
      {/* Gradient Banner */}
      <div className={`h-24 bg-gradient-to-br ${grad} relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute right-6 bottom-2 w-10 h-10 rounded-full bg-white/10" />
        {/* SVG plane */}
        <svg className="absolute right-4 bottom-3 w-8 h-8 text-white/30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-[#1A1A2E] text-base truncate group-hover:text-[#1D9E75] transition-colors">
          {trip.name || 'Untitled Trip'}
        </h3>

        {startDate && (
          <p className="text-xs text-[#6B6B7B] font-medium">
            {startDate}{endDate ? ` – ${endDate}` : ''}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          {cityCount > 0 && (
            <span className="text-xs text-[#6B6B7B] font-medium">
              {cityCount} {cityCount === 1 ? 'stop' : 'stops'}
            </span>
          )}
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
