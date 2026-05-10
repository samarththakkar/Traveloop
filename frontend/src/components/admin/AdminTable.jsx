export default function AdminTable({ headers, children }) {
  return (
    <div className="bg-[#1E1E30] border border-[#2A2A40] rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#2A2A40] text-white/40 text-[10px] font-black uppercase tracking-widest">
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A40]">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminTableRow({ children }) {
  return (
    <tr className="hover:bg-[#2A2A40]/30 transition-colors group">
      {children}
    </tr>
  );
}

export function AdminTableCell({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 text-sm ${className}`}>
      {children}
    </td>
  );
}
