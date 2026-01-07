"use client" // Ensure this is at the very top

import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAdmin } from "@/app/action/admin-actions"; 

export default function AdminTable({ admins, onEdit, refresh }: any) {
  
  // 🟢 Fixed: handleDelete remains async, but the component itself is not
  const handleDelete = async (adminId: number) => {
    // 🛡️ Confirmation Dialog
    if (!confirm("TERMINATE NODE? This action is permanent and recorded.")) return;
    
    const res = await deleteAdmin(adminId);
    
    if (res && typeof res === 'object' && 'success' in res && res.success) {
      toast.success("Admin Node Terminated Successfully");
      refresh(); 
    } else {
      toast.error((res && typeof res === 'object' && 'error' in res && res.error) || "De-provisioning failed");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <th className="px-8 py-5">Admin Node</th>
            <th className="px-8 py-5">Privilege</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5">Join Date</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {admins.map((admin: any) => (
            <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                    {admin.username[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900 uppercase italic tracking-tighter">{admin.username}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`text-[10px] font-black uppercase italic ${admin.role === 'SUPERADMIN' ? 'text-red-600' : 'text-blue-600'}`}>
                  {admin.role}
                </span>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-slate-500">Active</span>
                </div>
              </td>
              <td className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase">
                {new Date(admin.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(admin)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all border border-transparent hover:border-blue-100">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(admin.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all border border-transparent hover:border-red-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}