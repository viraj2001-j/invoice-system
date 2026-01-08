// components/client/ClientModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ClientModal({ isOpen, onClose, client, refresh }: any) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", website: "" });

  useEffect(() => {
    if (client) setForm({ ...client });
    else setForm({ name: "", email: "", phone: "", address: "", website: "" });
  }, [client, isOpen]);

  const handleSubmit = async () => {
    const method = client ? "PATCH" : "POST";
    const url = client ? `/api/client/${client.id}` : "/api/client";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(client ? "Client details updated" : "Client successfully provisioned");
      refresh();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-[2rem] bg-white p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
            {client ? "Edit Client" : "Register New Client"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Email Address</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Phone Number</label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Physical Address</label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button variant="ghost" onClick={onClose} className="flex-1 font-bold uppercase italic text-xs">Cancel</Button>
          <Button onClick={handleSubmit} className="flex-1 bg-slate-900 h-12 rounded-xl font-black uppercase italic text-xs text-white">
            {client ? "Save Changes" : "Confirm Entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}