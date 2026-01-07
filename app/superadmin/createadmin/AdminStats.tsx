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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{card.value}</h3>
            </div>
            <div className={`${card.color} p-3 rounded-lg shadow-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}