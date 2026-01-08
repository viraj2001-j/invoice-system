// components/client/ClientStats.tsx
import { Users, UserCheck, Clock, UserX } from "lucide-react";

export default function ClientStats({ stats }: { stats: any }) {
  const cards = [
    { title: "Total Clients", value: stats.total, icon: Users, color: "bg-blue-600" },
    { title: "Active Clients", value: stats.active, icon: UserCheck, color: "bg-green-600" },
    { title: "Pending Clients", value: stats.pending, icon: Clock, color: "bg-orange-500" },
    { title: "Inactive Clients", value: stats.inactive, icon: UserX, color: "bg-slate-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{card.title}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 italic tracking-tighter">{card.value}</h3>
            </div>
            <div className={`${card.color} p-3 rounded-xl shadow-lg shadow-black/10 text-white`}>
              <card.icon size={22} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}