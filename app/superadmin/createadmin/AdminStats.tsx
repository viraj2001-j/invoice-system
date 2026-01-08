// components/admin/AdminStats.tsx
import { Users, ShieldCheck, UserCog, LifeBuoy } from "lucide-react";
export default function AdminStats({ stats }: { stats: any }) {
  const cards = [
    { title: "Total Admins", value: stats.total, icon: Users, color: "bg-blue-500" },
    { title: "Active Admins", value: stats.active, icon: UserCog, color: "bg-green-500" },
    { title: "Super Admins", value: stats.super, icon: ShieldCheck, color: "bg-purple-500" },
    { title: "Support Staff", value: "0", icon: LifeBuoy, color: "bg-orange-500" },
  ];

  return (
    // 🟢 Changed gap and responsive columns
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 italic tracking-tighter">{card.value}</h3>
            </div>
            <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}