// app/superadmin/admins/page.tsx
"use client";

import { useState, useEffect } from "react";
import AdminStats from "@/app/superadmin/createadmin/AdminStats";
import AdminTable from "@/app/superadmin/createadmin/AdminTable";
import AdminModal from "@/app/superadmin/createadmin/AdminModal";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react"
  const { data: session, status } = useSession()
import router from "next/router";

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== "SUPERADMIN") {
      router.push("/login")
    }
  }, [status, session, router])
  
export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);

const fetchAdmins = async () => {
  try {
    const res = await fetch("/api/admin-list"); // 🟢 Ensure this matches the new API file
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    setAdmins(data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

  useEffect(() => { fetchAdmins(); }, []);

  const openCreateModal = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const openEditModal = (admin: any) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
            Node Management<span className="text-red-600">.</span>
          </h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Manage System Access Levels</p>
        </div>
        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-xl font-black italic uppercase tracking-widest">
          <UserPlus className="mr-2" size={20} /> Create Admin
        </Button>
      </div>

      <AdminStats stats={{ total: admins.length, active: admins.length, super: admins.filter((a: any) => a.role === "SUPERADMIN").length }} />
      
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <AdminTable admins={admins} onEdit={openEditModal} refresh={fetchAdmins} />
      </div>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        admin={editingAdmin} 
        refresh={fetchAdmins}
      />
    </div>
  );
}