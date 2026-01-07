// components/admin/AdminModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { updateAdmin } from "@/app/action/admin-actions"; // 🟢 Import Update Action

export default function AdminModal({ isOpen, onClose, admin, refresh }: any) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) setForm({ username: admin.username, password: "" });
    else setForm({ username: "", password: "" });
  }, [admin, isOpen]);

  const handleSubmit = async () => {
    if (!form.username) return toast.error("Username is required");
    setLoading(true);

    try {
      if (admin) {
        // 🟢 EDIT MODE: Uses Server Action
        const res = await updateAdmin(admin.id, form);
        if (res.success) {
          toast.success("Node Access Modified Successfully");
          refresh();
          onClose();
        } else {
          toast.error(res.error || "Update Failed");
        }
      } else {
        // 🟢 CREATE MODE: Uses your existing signup/route.ts
const res = await fetch("/api/signup", { // 🟢 Ensure this matches your route.ts location
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...form, role: "ADMIN" }), 
}).then(r => r.json());

        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("New Admin Provisioned Successfully");
          refresh();
          onClose();
        }
      }
    } catch (err) {
      toast.error("Critical System Connection Failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white rounded-[2rem] max-w-sm">
        <DialogHeader className="items-center">
          <div className="bg-blue-600/20 p-3 rounded-2xl mb-2">
            <ShieldCheck className="text-blue-500" size={24} />
          </div>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">
            {admin ? "Modify Node" : "Provision Node"}
          </DialogTitle>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Security Clearance: SUPERADMIN</p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Username</label>
            <Input 
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="bg-slate-800 border-none h-12 rounded-xl text-white font-bold placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-500 ml-1">
              {admin ? "New Password (Leave blank to keep)" : "Temporary Password"}
            </label>
            <Input 
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-slate-800 border-none h-12 rounded-xl text-white font-bold"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="ghost" onClick={onClose} className="flex-1 text-slate-400 font-black uppercase italic text-xs hover:text-white hover:bg-white/5">
              Abort
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-white text-slate-950 font-black uppercase italic text-xs rounded-xl hover:bg-slate-200">
              {loading ? <Loader2 className="animate-spin" size={18} /> : admin ? "Update Node" : "Confirm Provision"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}