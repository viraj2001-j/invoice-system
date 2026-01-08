"use client"

import { useState, useEffect } from "react"; // Added useEffect
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAdmin } from "@/app/action/admin-actions"; 

export default function AdminTable({ admins, onEdit, refresh }: any) {
  // Use state for date to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const handleDelete = async (adminId: number) => {
    if (!confirm("TERMINATE NODE? This action is permanent.")) return;
    const res = await deleteAdmin(adminId);
    if (res?.success) {
      toast.success("Admin Node Terminated");
      refresh(); 
    } else {
      toast.error(res?.error || "Termination failed");
    }
  };

  if (!isMounted) return null; // Prevents server-side render of dynamic dates

  return (
    <div className="overflow-x-auto">
      {/* 🟢 Added min-width to ensure table doesn't squish on mobile */}
      <table className="w-full text-left min-w-[600px]">
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
                  <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shrink-0">
                    {admin.username[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900 uppercase italic tracking-tighter truncate max-w-[100px]">{admin.username}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`text-[10px] font-black uppercase italic ${admin.role === 'SUPERADMIN' ? 'text-red-600' : 'text-blue-600'}`}>
                  {admin.role}
                </span>
              </td>
              <td className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase">
                {new Date(admin.createdAt).toLocaleDateString()}
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(admin)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(admin.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}