"use client";

import { useState, useEffect } from "react";
import AdminStats from "@/app/superadmin/createadmin/AdminStats";
import AdminTable from "@/app/superadmin/createadmin/AdminTable";
import AdminModal from "@/app/superadmin/createadmin/AdminModal";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // 🟢 CORRECT: Use next/navigation for App Router

export default function AdminManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // 🟢 Hook must be inside the component
  
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);

  // --- AUTH PROTECT ---
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "SUPERADMIN") {
      router.push("/login");
    }
  }, [status, session, router]);

  // --- DATA FETCHING ---
  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin-list"); 
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "SUPERADMIN") {
      fetchAdmins();
    }
  }, [status, session]);

  const openCreateModal = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const openEditModal = (admin: any) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  // Prevent flicker/rendering before auth check is complete
  if (status === "loading" || session?.user?.role !== "SUPERADMIN") {
    return <div className="p-8 font-bold animate-pulse">Authenticating Access...</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black  uppercase tracking-tighter text-slate-900">
            Admin Management
          </h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Manage System Access Levels</p>
        </div>
        <Button 
          onClick={openCreateModal} 
          className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-xl font-black italic uppercase tracking-widest w-full md:w-auto"
        >
          <UserPlus className="mr-2" size={20} /> Create Admin
        </Button>
      </div>

      <AdminStats stats={{ 
        total: admins.length, 
        active: admins.length, 
        super: admins.filter((a: any) => a.role === "SUPERADMIN").length 
      }} />
      
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-x-auto">
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