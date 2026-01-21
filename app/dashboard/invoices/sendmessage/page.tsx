"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Send, Search, Clock, Mail, Eye } from "lucide-react";
// 🟢 Import Dialog components for the popup
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function MessagePage() {
  const [clients, setClients] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ clientId: "", subject: "", message: "" });

  // 🟢 State for the View Popup
  const [viewLog, setViewLog] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/send-message");
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load history");
    }
  };

  useEffect(() => {
    fetch("/api/client").then(res => res.ok ? res.json() : []).then(setClients);
    fetchHistory();
  }, []);

  const sendMessage = async () => {
    const client: any = clients.find((c: any) => c.id.toString() === form.clientId);
    if (!client?.email) return toast.error("Please select a valid client!");
    if (!form.subject || !form.message) return toast.error("All fields are required!");

    setLoading(true);
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, to: client.email }),
      });

      if (res.ok) {
        toast.success("Message Sent & Saved!");
        setForm({ clientId: "", subject: "", message: "" });
        fetchHistory(); 
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to send");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((h: any) => 
    h.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.subject?.toLowerCase().includes(search.toLowerCase())
  );

  // 🟢 Open View Modal
  const handleViewMessage = (log: any) => {
    setViewLog(log);
    setIsViewOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
  
      <main className="flex-1 p-8 space-y-10">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black  uppercase tracking-tighter text-slate-900">
            Send Message
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Client Message Node</p>
        </div>

        {/* SECTION 1: SEND FORM */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-4">
          <h2 className="font-black uppercase italic text-sm text-slate-500 tracking-widest">Send New Message</h2>
          <select 
            value={form.clientId}
            className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-blue-100 transition-all"
            onChange={e => setForm({...form, clientId: e.target.value})}
          >
            <option value="">Select Recipient</option>
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
          </select>
          <Input 
            placeholder="Subject Line" 
            value={form.subject}
            className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
            onChange={e => setForm({...form, subject: e.target.value})} 
          />
          <textarea 
            placeholder="Compose message..." 
            className="w-full p-4 bg-slate-50 rounded-2xl min-h-[150px] font-bold text-sm outline-none border border-transparent focus:border-blue-100 transition-all"
            value={form.message}
            onChange={e => setForm({...form, message: e.target.value})}
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading} 
            className="w-full bg-slate-900 h-14 rounded-2xl font-black italic uppercase tracking-widest text-white hover:bg-black transition-all"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={18} />}
            {loading ? "Transmitting..." : "Send Message"}
          </Button>
        </div>

        {/* SECTION 2: SEARCH & HISTORY TABLE */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Transmission Logs</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database Archives</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search logs by name or subject..." 
                className="pl-12 h-12 bg-white border-none shadow-sm rounded-2xl font-bold text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-8 py-5">Recipient</th>
                  <th className="px-8 py-5">Subject</th>
                  <th className="px-8 py-4">Timestamp</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredHistory.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-[10px]">
                          {log.client?.name?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 uppercase italic tracking-tight">{log.client?.name}</p>
                          <p className="text-[10px] text-slate-400 lowercase">{log.client?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600 italic">{log.subject}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <Clock size={14} />
                        {new Date(log.sentAt).toLocaleString()}
                      </div>
                    </td>
                    {/* 🟢 Action Column with View Button */}
                    <td className="px-8 py-5 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewMessage(log)}
                          className="rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600"
                        >
                          <Eye size={18} />
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredHistory.length === 0 && (
              <div className="p-20 text-center space-y-3">
                 <Mail className="mx-auto text-slate-200" size={48} />
                 <p className="text-slate-300 font-black uppercase italic tracking-widest text-xs">No transmission records found</p>
              </div>
            )}
          </div>
        </div>

        {/* 🟢 VIEW MESSAGE MODAL */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="bg-white rounded-[2rem] border-none max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-slate-900">
                    Transmission Content
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold uppercase text-blue-600 mt-1">
                    Subject: {viewLog?.subject}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <div>Recipient: <span className="text-slate-900 italic">{viewLog?.client?.name}</span></div>
                <div>Sent: <span className="text-slate-900 italic">{viewLog ? new Date(viewLog.sentAt).toLocaleString() : ""}</span></div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {viewLog?.body}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button 
                onClick={() => setIsViewOpen(false)}
                className="w-full bg-slate-900 rounded-xl font-bold uppercase italic text-xs h-12"
              >
                Close Archive
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}