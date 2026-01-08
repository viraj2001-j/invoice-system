// app/dashboard/clients/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import ClientStats from "./ClientStats";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Edit3, Trash2, Mail, Phone } from "lucide-react";
import ClientModal from "./ClientModal";
import { toast } from "sonner";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    const res = await fetch("/api/client");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => { fetchClients(); }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toString().includes(searchTerm)
    );
  }, [searchTerm, clients]);

  const handleDelete = async (id: number) => {
    if (!confirm("Confirm client deletion?")) return;
    const res = await fetch(`/api/client/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Client node removed");
      fetchClients();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* <Sidebar /> */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
              Client Directory<span className="text-blue-600">.</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database Management</p>
          </div>
          <Button onClick={() => { setEditingClient(null); setIsModalOpen(true); }} className="bg-slate-900 hover:bg-black h-12 rounded-xl font-black italic uppercase text-xs tracking-widest">
            <UserPlus className="mr-2" size={18} /> Add New Client
          </Button>
        </div>

        <ClientStats stats={{ total: clients.length, active: clients.length, pending: 0, inactive: 0 }} />

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search by name, ID, email or company..." 
                className="pl-12 h-12 bg-slate-50 border-none rounded-xl font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Company</th>
                <th className="px-8 py-5">Phone No</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900 italic tracking-tight">{client.name}</td>
                  <td className="px-8 py-5 text-xs font-black uppercase text-blue-600 italic">
                    {client.company?.name || "Independent"}
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-mono">{client.phone}</td>
                  <td className="px-8 py-5 text-sm text-slate-400">{client.email}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingClient(client); setIsModalOpen(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        client={editingClient} 
        refresh={fetchClients} 
      />
    </div>
  );
}