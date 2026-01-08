// "use client"

// import React, { useState, useMemo, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { toast } from "sonner"
// import { Search, CheckCircle2, Trash2, Edit3, Mail, Landmark, Download } from "lucide-react"

// import { shareReceipt, shareStatement } from "@/lib/receiptGenerator";
// import { recordPaymentAction, deletePaymentAction, updatePaymentAction } from "@/app/action/invoice-payment"
// import Sidebar from '@/components/sidebar'

// export default function PaymentsPage({ invoices = [] }: { invoices: any[] }) {
//   const [mounted, setMounted] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
//   const [payAmount, setPayAmount] = useState<number>(0);
//   const [loading, setLoading] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingPayment, setEditingPayment] = useState<any>(null);

//   useEffect(() => { setMounted(true); }, []);

//   const selectedInvoice = useMemo(() => 
//     invoices.find((inv: any) => inv.id.toString() === selectedInvoiceId),
//   [selectedInvoiceId, invoices]);

//   const globalStats = useMemo(() => {
//     const total = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
//     const paid = invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
//     return { total, paid, due: total - paid };
//   }, [invoices]);

//   const filteredInvoices = useMemo(() => invoices.filter((inv: any) => 
//     inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   ), [searchTerm, invoices]);

//   const handleDeletePayment = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this payment?")) return;
//     setLoading(true);
//     const res: any = await deletePaymentAction(id);
//     if (res.success) toast.success("Payment deleted");
//     setLoading(false);
//   };

//   const handleBulkDelete = async () => {
//     if (!selectedInvoice?.payments.length) return;
//     if (!confirm(`CRITICAL: Delete ALL payments for ${selectedInvoice.client.name}?`)) return;
//     setLoading(true);
//     try {
//       for (const p of selectedInvoice.payments) { await deletePaymentAction(p.id); }
//       toast.success("All payments cleared");
//     } catch (err) { toast.error("Bulk delete failed"); }
//     setLoading(false);
//   };

//   const handleUpdatePayment = async () => {
//     if (!editingPayment) return;
//     setLoading(true);
//     const res: any = await updatePaymentAction({
//       paymentId: editingPayment.id,
//       amount: editingPayment.amount,
//       method: editingPayment.method,
//       paymentDate: editingPayment.paymentDate
//     });
//     if (res.success) { toast.success("Updated"); setEditModalOpen(false); }
//     setLoading(false);
//   };

//   if (!mounted) return null;

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       {/* <Sidebar /> */}

//       <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
//         <div className="p-8 space-y-8">
          
//           {/* STATS CARDS */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card className="bg-slate-900 text-white border-none shadow-md">
//               <CardContent className="p-4">
//                 <p className="text-[10px] uppercase opacity-50 font-bold">Total Revenue</p>
//                 <p className="text-xl font-black italic">LKR {globalStats.total.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//             <Card className="bg-green-600 text-white border-none shadow-md">
//               <CardContent className="p-4">
//                 <p className="text-[10px] uppercase opacity-50 font-bold">Collected</p>
//                 <p className="text-xl font-black italic">LKR {globalStats.paid.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//             <Card className="bg-red-500 text-white border-none shadow-md">
//               <CardContent className="p-4">
//                 <p className="text-[10px] uppercase opacity-50 font-bold">Owed</p>
//                 <p className="text-xl font-black italic">LKR {globalStats.due.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
//             <div className="xl:col-span-4">
//               <Card className="p-6 space-y-4 shadow-xl border-none bg-white font-bold">
//                 <Label className="text-xs uppercase text-slate-500 tracking-widest">Entry Panel</Label>
//                 <Input placeholder="Search Client..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//                 <Select onValueChange={setSelectedInvoiceId} value={selectedInvoiceId}>
//                   <SelectTrigger className="font-bold"><SelectValue placeholder="Select Account" /></SelectTrigger>
//                   <SelectContent>{filteredInvoices.map(inv => <SelectItem key={inv.id} value={inv.id.toString()}>{inv.client.name}</SelectItem>)}</SelectContent>
//                 </Select>
//                 {selectedInvoice && (selectedInvoice.total - selectedInvoice.amountPaid) <= 0 ? (
//                    <div className="p-4 text-center bg-green-50 rounded-lg border border-green-200">
//                       <CheckCircle2 size={24} className="mx-auto text-green-600 mb-1" />
//                       <p className="text-[10px] font-black uppercase text-green-800">Settled</p>
//                    </div>
//                 ) : (
//                   <>
//                     <Input type="number" placeholder="LKR Amount" className="h-12 text-lg font-bold" value={payAmount || ""} onChange={e => setPayAmount(Number(e.target.value))} />
//                     <Button className="w-full bg-slate-900 h-12" onClick={() => recordPaymentAction({ invoiceId: Number(selectedInvoiceId), amount: payAmount, method: 'Cash', paymentDate: new Date().toISOString() })}>Submit Payment</Button>
//                   </>
//                 )}
//               </Card>
//             </div>

//             <div className="xl:col-span-8 space-y-4">
//               {selectedInvoice && (
//                 <>
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
//                       <p className="text-[9px] font-bold text-slate-400 uppercase">Billed</p>
//                       <p className="text-sm font-black italic">LKR {selectedInvoice.total.toLocaleString()}</p>
//                     </div>
//                     <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
//                       <p className="text-[9px] font-bold text-slate-400 uppercase">Paid</p>
//                       <p className="text-sm font-black text-green-600 italic">LKR {selectedInvoice.amountPaid.toLocaleString()}</p>
//                     </div>
//                     <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
//                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Remaining</p>
//                       <p className="text-sm font-black text-red-600 italic">LKR {(selectedInvoice.total - selectedInvoice.amountPaid).toLocaleString()}</p>
//                     </div>
//                   </div>

//                   <Card className="shadow-xl border-none bg-white overflow-hidden">
//                     <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-slate-50 border-b">
//                       <CardTitle className="text-xs font-black uppercase text-slate-500 italic tracking-widest">History Ledger</CardTitle>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm" className="gap-2 h-8 font-bold" onClick={() => shareStatement(selectedInvoice, true)}>
//                           <Download size={14}/> Download
//                         </Button>
//                         <Button variant="outline" size="sm" className="gap-2 h-8 font-bold" onClick={() => shareStatement(selectedInvoice, false)}>
//                           <Mail size={14}/> Share All
//                         </Button>
//                         <Button variant="destructive" size="sm" className="gap-2 h-8 font-bold shadow-sm" onClick={handleBulkDelete}>
//                           <Trash2 size={14}/> Delete All
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-0">
//                       {selectedInvoice.payments.map((p: any) => (
//                         <div key={p.id} className="p-4 flex justify-between items-center border-b last:border-0 group hover:bg-slate-50">
//                           <div className="flex items-center gap-4">
//                             <Landmark size={18} className="text-slate-300"/>
//                             <div>
//                               <p className="font-black text-xs uppercase italic">Payment Received</p>
//                               <p className="text-[10px] text-slate-400">{new Date(p.paymentDate).toLocaleString()}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-6">
//                             <span className="font-black text-green-600 text-sm">+{p.amount.toLocaleString()}</span>
//                             <div className="flex gap-1 opacity-0 group-hover:opacity-100">
//                               <Button variant="ghost" size="icon" onClick={() => shareReceipt(p, selectedInvoice, true)}><Download size={14}/></Button>
//                               <Button variant="ghost" size="icon" className="text-blue-500" onClick={() => shareReceipt(p, selectedInvoice, false)}><Mail size={14}/></Button>
//                               <Button variant="ghost" size="icon" onClick={() => { setEditingPayment(p); setEditModalOpen(true); }}><Edit3 size={14}/></Button>
//                               <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeletePayment(p.id)}><Trash2 size={14}/></Button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* EDIT MODAL */}
//       <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
//         <DialogContent className="bg-white">
//           <DialogHeader><DialogTitle className="text-xs font-black uppercase">Edit Entry</DialogTitle></DialogHeader>
//           <div className="space-y-4 py-4">
//             <Input type="number" value={editingPayment?.amount || 0} onChange={e => setEditingPayment({...editingPayment, amount: Number(e.target.value)})} />
//             <Input type="datetime-local" value={editingPayment?.paymentDate ? new Date(editingPayment.paymentDate).toISOString().slice(0, 16) : ''} onChange={e => setEditingPayment({...editingPayment, paymentDate: new Date(e.target.value).toISOString()})} />
//           </div>
//           <DialogFooter>
//             <Button onClick={handleUpdatePayment} disabled={loading} className="bg-slate-900 w-full font-bold">Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


// "use client"

// import React, { useState, useMemo, useEffect, useTransition } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { toast } from "sonner"
// import { Search, CheckCircle2, Trash2, Edit3, Mail, Landmark, Download, Loader2 } from "lucide-react"

// import { shareReceipt, shareStatement } from "@/lib/receiptGenerator";
// import { recordPaymentAction, deletePaymentAction, updatePaymentAction } from "@/app/action/invoice-payment"
// import Sidebar from '@/components/sidebar'

// export default function PaymentsPage({ invoices = [] }: { invoices: any[] }) {
//   const [mounted, setMounted] = useState(false);
//   const [isPending, startTransition] = useTransition();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
//   const [payAmount, setPayAmount] = useState<number>(0);
//   const [loading, setLoading] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingPayment, setEditingPayment] = useState<any>(null);

//   useEffect(() => { setMounted(true); }, []);

//   // --- LOGIC: GLOBAL SEARCH & FLATTENING ---
  
//   // Flatten all payments into one array for the "Global Feed"
//   const allPaymentsFeed = useMemo(() => {
//     return invoices.flatMap(inv => 
//       inv.payments.map((p: any) => ({
//         ...p,
//         clientName: inv.client.name,
//         invoiceNumber: inv.invoiceNumber,
//         fullInvoice: inv // Attached for receipt generation
//       }))
//     ).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
//   }, [invoices]);

//   // Filter based on Search Term
//   const filteredInvoices = useMemo(() => invoices.filter((inv: any) => 
//     inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   ), [searchTerm, invoices]);

//   const selectedInvoice = useMemo(() => 
//     invoices.find((inv: any) => inv.id.toString() === selectedInvoiceId),
//   [selectedInvoiceId, invoices]);

//   // Determine what to show in the Ledger
//   const displayPayments = useMemo(() => {
//     if (selectedInvoice) {
//       return selectedInvoice.payments.map((p: any) => ({
//         ...p,
//         clientName: selectedInvoice.client.name,
//         invoiceNumber: selectedInvoice.invoiceNumber,
//         fullInvoice: selectedInvoice
//       }));
//     }
//     // If no specific invoice selected, show everything filtered by search
//     return allPaymentsFeed.filter(p => 
//       p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
//     ).slice(0, 50); // Limit to 50 for performance
//   }, [selectedInvoice, allPaymentsFeed, searchTerm]);

//   const globalStats = useMemo(() => {
//     const total = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
//     const paid = invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
//     return { total, paid, due: total - paid };
//   }, [invoices]);

//   // --- ACTIONS ---

//   const handleRecordPayment = async () => {
//     if (!selectedInvoiceId || payAmount <= 0) return toast.error("Select account & enter amount");
    
//     setLoading(true);
//     startTransition(async () => {
//       const res: any = await recordPaymentAction({ 
//         invoiceId: Number(selectedInvoiceId), 
//         amount: payAmount, 
//         method: 'Cash', 
//         paymentDate: new Date().toISOString() 
//       });

//       if (res.success) {
//         toast.success(`Payment of LKR ${payAmount.toLocaleString()} recorded!`, {
//             description: `Account: ${selectedInvoice?.client.name}`,
//             icon: <CheckCircle2 className="text-green-600" />
//         });
//         setPayAmount(0);
//       } else {
//         toast.error(res.error || "Failed to record payment");
//       }
//       setLoading(false);
//     });
//   };

//   const handleDeletePayment = async (id: number) => {
//     if (!confirm("Delete this payment record?")) return;
//     setLoading(true);
//     const res: any = await deletePaymentAction(id);
//     if (res.success) toast.success("Payment removed from ledger");
//     setLoading(false);
//   };

//   if (!mounted) return null;

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />

//       <main className="flex-1 pt-20 md:pt-8 px-4 md:px-8 pb-12 transition-all">
//         <div className="max-w-7xl mx-auto space-y-8">
          
//           {/* HEADER SECTION */}
//           <div>
//             <h1 className="text-2xl font-black uppercase italic tracking-tighter">Financial Ledger<span className="text-blue-600">.</span></h1>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Real-time payment tracking & reconciliation</p>
//           </div>

//           {/* STATS CARDS */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card className="bg-slate-900 text-white border-none shadow-xl rounded-2xl">
//               <CardContent className="p-6">
//                 <p className="text-[10px] uppercase opacity-50 font-black tracking-widest">Total Billed</p>
//                 <p className="text-2xl font-black italic">LKR {globalStats.total.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//             <Card className="bg-white text-slate-900 border-none shadow-xl rounded-2xl">
//               <CardContent className="p-6">
//                 <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Collected</p>
//                 <p className="text-2xl font-black text-green-600 italic">LKR {globalStats.paid.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//             <Card className="bg-red-600 text-white border-none shadow-xl rounded-2xl">
//               <CardContent className="p-6">
//                 <p className="text-[10px] uppercase opacity-50 font-black tracking-widest">Outstanding</p>
//                 <p className="text-2xl font-black italic">LKR {globalStats.due.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
//             {/* ENTRY PANEL */}
//             <div className="xl:col-span-4 space-y-4">
//               <Card className="p-6 shadow-2xl border-none bg-white rounded-[2rem]">
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Search size={16} className="text-slate-400" />
//                     <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Quick Locate & Pay</Label>
//                   </div>
                  
//                   <Input 
//                     placeholder="Search client or invoice..." 
//                     className="bg-slate-50 border-none h-12 rounded-xl font-bold"
//                     value={searchTerm} 
//                     onChange={(e) => setSearchTerm(e.target.value)} 
//                   />

//                   <Select onValueChange={setSelectedInvoiceId} value={selectedInvoiceId}>
//                     <SelectTrigger className="h-12 rounded-xl font-bold border-slate-100">
//                       <SelectValue placeholder="Select Account" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {filteredInvoices.map(inv => (
//                         <SelectItem key={inv.id} value={inv.id.toString()} className="font-bold">
//                           {inv.client.name} <span className="text-[10px] opacity-50 ml-2">#{inv.invoiceNumber}</span>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   {selectedInvoice && (selectedInvoice.total - selectedInvoice.amountPaid) <= 0 ? (
//                     <div className="p-6 text-center bg-green-50 rounded-2xl border border-green-100">
//                        <CheckCircle2 size={32} className="mx-auto text-green-600 mb-2 animate-bounce" />
//                        <p className="text-xs font-black uppercase text-green-800">Account Fully Settled</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3 pt-2">
//                       <Input 
//                         type="number" 
//                         placeholder="0.00" 
//                         className="h-14 text-2xl font-black text-center bg-slate-50 border-none rounded-2xl" 
//                         value={payAmount || ""} 
//                         onChange={e => setPayAmount(Number(e.target.value))} 
//                       />
//                       <Button 
//                         className="w-full bg-slate-900 hover:bg-black h-14 rounded-2xl font-black uppercase italic tracking-widest transition-all" 
//                         onClick={handleRecordPayment}
//                         disabled={loading || isPending}
//                       >
//                         {loading ? <Loader2 className="animate-spin" /> : "Confirm Payment"}
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </div>

//             {/* LEDGER FEED */}
//             <div className="xl:col-span-8">
//               <Card className="shadow-2xl border-none bg-white rounded-[2rem] overflow-hidden">
//                 <CardHeader className="flex flex-col md:flex-row items-center justify-between py-5 px-8 bg-slate-50/50 border-b border-slate-100 gap-4">
//                   <div className="flex flex-col">
//                     <CardTitle className="text-xs font-black uppercase text-slate-500 italic tracking-widest">
//                       {selectedInvoice ? `History: ${selectedInvoice.client.name}` : "Recent Global Activity"}
//                     </CardTitle>
//                     <span className="text-[9px] font-bold text-blue-500 uppercase">Showing {displayPayments.length} records</span>
//                   </div>
                  
//                   {selectedInvoice && (
//                     <div className="flex gap-2 w-full md:w-auto">
//                       <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 h-9 font-black uppercase text-[10px] rounded-lg" onClick={() => shareStatement(selectedInvoice, true)}>
//                         <Download size={14}/> PDF
//                       </Button>
//                       <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 h-9 font-black uppercase text-[10px] rounded-lg" onClick={() => shareStatement(selectedInvoice, false)}>
//                         <Mail size={14}/> Share
//                       </Button>
//                     </div>
//                   )}
//                 </CardHeader>
                
//                 <CardContent className="p-0 max-h-[600px] overflow-y-auto custom-scrollbar">
//                   {displayPayments.length === 0 ? (
//                     <div className="p-20 text-center space-y-2">
//                       <Search className="mx-auto text-slate-200" size={48} />
//                       <p className="text-[10px] font-black uppercase text-slate-400">No transactions found</p>
//                     </div>
//                   ) : (
//                     displayPayments.map((p: any) => (
//                       <div key={p.id} className="p-5 flex justify-between items-center border-b border-slate-50 last:border-0 group hover:bg-blue-50/30 transition-colors">
//                         <div className="flex items-center gap-4">
//                           <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
//                             <Landmark size={18}/>
//                           </div>
//                           <div>
//                             <p className="font-black text-xs uppercase italic tracking-tighter">
//                               {p.clientName} <span className="text-[9px] text-slate-400 font-bold ml-1">#{p.invoiceNumber}</span>
//                             </p>
//                             <p className="text-[10px] text-slate-400 font-bold">{new Date(p.paymentDate).toLocaleDateString()} • {new Date(p.paymentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-6">
//                           <span className="font-black text-green-600 text-sm">+{p.amount.toLocaleString()}</span>
//                           {/* Visible on mobile (opacity-100), hover only on desktop */}
//                           <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
//                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shareReceipt(p, p.fullInvoice, true)}><Download size={14}/></Button>
//                             <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => shareReceipt(p, p.fullInvoice, false)}><Mail size={14}/></Button>
//                             <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeletePayment(p.id)}><Trash2 size={14}/></Button>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import React, { useState, useMemo, useEffect, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Search, CheckCircle2, Trash2, Edit3, Mail, Landmark, Download, Loader2, TrendingUp, Wallet, AlertCircle } from "lucide-react"

import { shareReceipt, shareStatement } from "@/lib/receiptGenerator";
import { recordPaymentAction, deletePaymentAction, updatePaymentAction } from "@/app/action/invoice-payment"
import Sidebar from '@/components/sidebar'

export default function PaymentsPage({ invoices = [] }: { invoices: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);

  useEffect(() => { setMounted(true); }, []);

  // --- 1. GLOBAL SYSTEM STATS (Static for the whole system) ---
  const globalStats = useMemo(() => {
    const total = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    const paid = invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
    return { total, paid, due: total - paid };
  }, [invoices]);

  // --- 2. DYNAMIC SEARCH & SELECTION LOGIC ---
  const allPaymentsFeed = useMemo(() => {
    return invoices.flatMap(inv => 
      inv.payments.map((p: any) => ({
        ...p, clientName: inv.client.name, invoiceNumber: inv.invoiceNumber, fullInvoice: inv 
      }))
    ).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [invoices]);

  const filteredInvoices = useMemo(() => invoices.filter((inv: any) => 
    inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm, invoices]);

  const selectedInvoice = useMemo(() => 
    invoices.find((inv: any) => inv.id.toString() === selectedInvoiceId),
  [selectedInvoiceId, invoices]);

  // Calculate stats for the Dynamic mini-cards (Billed/Paid/Remaining)
  const currentViewStats = useMemo(() => {
    if (selectedInvoice) {
      return {
        total: selectedInvoice.total,
        paid: selectedInvoice.amountPaid,
        due: selectedInvoice.total - selectedInvoice.amountPaid,
        label: `Account: ${selectedInvoice.client.name}`
      };
    }
    const target = searchTerm ? filteredInvoices : invoices;
    const total = target.reduce((acc, inv) => acc + (inv.total || 0), 0);
    const paid = target.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
    return { total, paid, due: total - paid, label: searchTerm ? "Search Results" : "Global Activity" };
  }, [selectedInvoice, searchTerm, filteredInvoices, invoices]);

  const displayPayments = useMemo(() => {
    if (selectedInvoice) {
      return selectedInvoice.payments.map((p: any) => ({
        ...p, clientName: selectedInvoice.client.name, invoiceNumber: selectedInvoice.invoiceNumber, fullInvoice: selectedInvoice
      }));
    }
    return allPaymentsFeed.filter(p => 
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 50);
  }, [selectedInvoice, allPaymentsFeed, searchTerm]);

  // --- 3. ACTIONS ---
  const handleRecordPayment = async () => {
    if (!selectedInvoiceId || payAmount <= 0) return toast.error("Check account & amount");
    setLoading(true);
    startTransition(async () => {
      const res: any = await recordPaymentAction({ 
        invoiceId: Number(selectedInvoiceId), amount: payAmount, method: 'Cash', paymentDate: new Date().toISOString() 
      });
      if (res.success) {
        toast.success(`LKR ${payAmount.toLocaleString()} Added Successfully`);
        setPayAmount(0);
      }
      setLoading(false);
    });
  };

  const handleDeletePayment = async (id: number) => {
    if (!confirm("Delete payment permanently?")) return;
    setLoading(true);
    const res: any = await deletePaymentAction(id);
    if (res.success) toast.success("Record Deleted");
    setLoading(false);
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* <Sidebar /> */}

      <main className="flex-1 pt-20 md:pt-8 px-4 md:px-8 pb-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* 🟢 GLOBAL SYSTEM OVERVIEW (TOTAL REVENUE, COLLECTED, OWED) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-3xl overflow-hidden relative">
              <CardContent className="p-6">
                <TrendingUp className="absolute right-4 top-4 opacity-10" size={60} />
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 mb-1">Total Revenue</p>
                <h2 className="text-3xl font-black italic tracking-tighter">LKR {globalStats.total.toLocaleString()}</h2>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-xl rounded-3xl overflow-hidden relative">
              <CardContent className="p-6">
                <Wallet className="absolute right-4 top-4 text-green-100" size={60} />
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-1">Total Collected</p>
                <h2 className="text-3xl font-black italic tracking-tighter text-green-600">LKR {globalStats.paid.toLocaleString()}</h2>
              </CardContent>
            </Card>
            <Card className="bg-red-600 text-white border-none shadow-2xl rounded-3xl overflow-hidden relative">
              <CardContent className="p-6">
                <AlertCircle className="absolute right-4 top-4 opacity-20" size={60} />
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-red-200 mb-1">Total Owed</p>
                <h2 className="text-3xl font-black italic tracking-tighter">LKR {globalStats.due.toLocaleString()}</h2>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* LEFT: ENTRY PANEL */}
            <div className="xl:col-span-4 space-y-4">
              <Card className="p-6 shadow-2xl border-none bg-white rounded-[2rem]">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Payment Entry</Label>
                  <Input 
                    placeholder="Search Client Name..." 
                    className="bg-slate-50 border-none h-12 rounded-xl font-bold"
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                  <Select onValueChange={setSelectedInvoiceId} value={selectedInvoiceId}>
                    <SelectTrigger className="h-12 rounded-xl font-bold border-slate-100"><SelectValue placeholder="Select Account" /></SelectTrigger>
                    <SelectContent>
                      {filteredInvoices.map(inv => (
                        <SelectItem key={inv.id} value={inv.id.toString()} className="font-bold">
                          {inv.client.name} <span className="text-[9px] opacity-40">#{inv.invoiceNumber}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedInvoice && (selectedInvoice.total - selectedInvoice.amountPaid) <= 0 ? (
                    <div className="p-6 text-center bg-green-50 rounded-2xl border border-green-100">
                       <CheckCircle2 size={32} className="mx-auto text-green-600 mb-2" />
                       <p className="text-xs font-black uppercase text-green-800">Settled</p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <Input 
                        type="number" 
                        placeholder="LKR Amount" 
                        className="h-14 text-2xl font-black text-center bg-slate-50 border-none rounded-2xl" 
                        value={payAmount || ""} 
                        onChange={e => setPayAmount(Number(e.target.value))} 
                      />
                      <Button 
                        className="w-full bg-slate-900 h-14 rounded-2xl font-black uppercase italic tracking-widest" 
                        onClick={handleRecordPayment}
                        disabled={loading || isPending}
                      >
                        {loading ? <Loader2 className="animate-spin" /> : "Submit Payment"}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT: DYNAMIC FEED */}
            <div className="xl:col-span-8 space-y-4">
              
              {/* 🟢 DYNAMIC SEARCH STATS (BILLED, PAID, REMAINING for specific search/select) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Billed</p>
                  <p className="text-sm font-black italic">LKR {currentViewStats.total.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Paid</p>
                  <p className="text-sm font-black text-green-600 italic">LKR {currentViewStats.paid.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Remaining</p>
                  <p className="text-sm font-black text-red-600 italic">LKR {currentViewStats.due.toLocaleString()}</p>
                </div>
              </div>

              <Card className="shadow-2xl border-none bg-white rounded-[2rem] overflow-hidden">
                <CardHeader className="flex items-center justify-between py-5 px-8 bg-slate-50/50 border-b">
                  <CardTitle className="text-xs font-black uppercase text-slate-500 italic tracking-widest">
                    {currentViewStats.label}
                  </CardTitle>
                  {selectedInvoice && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 font-black uppercase text-[9px]" onClick={() => shareStatement(selectedInvoice, true)}>PDF</Button>
                      <Button variant="outline" size="sm" className="h-8 font-black uppercase text-[9px]" onClick={() => shareStatement(selectedInvoice, false)}>Mail</Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-0 max-h-[500px] overflow-y-auto">
                  {displayPayments.map((p: any) => (
                    <div key={p.id} className="p-5 flex justify-between items-center border-b last:border-0 group hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Landmark size={18} className="text-slate-300"/>
                        <div>
                          <p className="font-black text-xs uppercase italic truncate max-w-[150px] md:max-w-none">
                            {p.clientName} <span className="text-[9px] text-slate-400 font-bold ml-1">#{p.invoiceNumber}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">{new Date(p.paymentDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-black text-green-600 text-sm">+{p.amount.toLocaleString()}</span>
                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shareReceipt(p, p.fullInvoice, true)}><Download size={14}/></Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => shareReceipt(p, p.fullInvoice, false)}><Mail size={14}/></Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeletePayment(p.id)}><Trash2 size={14}/></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


// "use client"

// import React, { useState, useMemo, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { toast } from "sonner"
// import { Search, CheckCircle2, Trash2, Edit3, Mail, Landmark, Download } from "lucide-react"

// import { shareReceipt, shareStatement } from "@/lib/receiptGenerator";
// import { recordPaymentAction, deletePaymentAction, updatePaymentAction } from "@/app/action/invoice-payment"
// import Sidebar from '@/components/sidebar'

// export default function PaymentsPage({ invoices = [] }: { invoices: any[] }) {
//   const [mounted, setMounted] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
//   const [payAmount, setPayAmount] = useState<number>(0);
//   const [loading, setLoading] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingPayment, setEditingPayment] = useState<any>(null);

//   useEffect(() => { setMounted(true); }, []);

//   const selectedInvoice = useMemo(() => 
//     invoices.find((inv: any) => inv.id.toString() === selectedInvoiceId),
//   [selectedInvoiceId, invoices]);

//   const globalStats = useMemo(() => {
//     const total = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
//     const paid = invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
//     return { total, paid, due: total - paid };
//   }, [invoices]);

//   const filteredInvoices = useMemo(() => invoices.filter((inv: any) => 
//     inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   ), [searchTerm, invoices]);

//   const handleDeletePayment = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this payment?")) return;
//     setLoading(true);
//     const res: any = await deletePaymentAction(id);
//     if (res.success) toast.success("Payment deleted");
//     setLoading(false);
//   };

//   const handleBulkDelete = async () => {
//     if (!selectedInvoice?.payments.length) return;
//     if (!confirm(`CRITICAL: Delete ALL payments for ${selectedInvoice.client.name}?`)) return;
//     setLoading(true);
//     try {
//       for (const p of selectedInvoice.payments) { await deletePaymentAction(p.id); }
//       toast.success("All payments cleared");
//     } catch (err) { toast.error("Bulk delete failed"); }
//     setLoading(false);
//   };

//   const handleUpdatePayment = async () => {
//     if (!editingPayment) return;
//     setLoading(true);
//     const res: any = await updatePaymentAction({
//       paymentId: editingPayment.id,
//       amount: editingPayment.amount,
//       method: editingPayment.method,
//       paymentDate: editingPayment.paymentDate
//     });
//     if (res.success) { toast.success("Updated"); setEditModalOpen(false); }
//     setLoading(false);
//   };

//   if (!mounted) return null;

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />

//       <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
//         <div className="p-8 space-y-8">
          
//           {/* STATS CARDS */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card className="bg-slate-900 text-white border-none shadow-md">
//               <CardContent className="p-4">
//                 <p className="text-[10px] uppercase opacity-50 font-bold">Total Revenue</p>
//                 <p className="text-xl font-black italic">LKR {globalStats.total.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//             <Card className="bg-green-600 text-white border-none shadow-md">
//               <CardContent className="p-4">
//                 <p className="text-[10px] uppercase opacity-50 font-bold">Collected</p>
//                 <p className="text-xl font-black italic">LKR {globalStats.paid.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//             <Card className="bg-red-500 text-white border-none shadow-md">
//               <CardContent className="p-4">
//                 <p className="text-[10px] uppercase opacity-50 font-bold">Owed</p>
//                 <p className="text-xl font-black italic">LKR {globalStats.due.toLocaleString()}</p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
//             <div className="xl:col-span-4">
//               <Card className="p-6 space-y-4 shadow-xl border-none bg-white font-bold">
//                 <Label className="text-xs uppercase text-slate-500 tracking-widest">Entry Panel</Label>
//                 <Input placeholder="Search Client..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//                 <Select onValueChange={setSelectedInvoiceId} value={selectedInvoiceId}>
//                   <SelectTrigger className="font-bold"><SelectValue placeholder="Select Account" /></SelectTrigger>
//                   <SelectContent>{filteredInvoices.map(inv => <SelectItem key={inv.id} value={inv.id.toString()}>{inv.client.name}</SelectItem>)}</SelectContent>
//                 </Select>
//                 {selectedInvoice && (selectedInvoice.total - selectedInvoice.amountPaid) <= 0 ? (
//                    <div className="p-4 text-center bg-green-50 rounded-lg border border-green-200">
//                       <CheckCircle2 size={24} className="mx-auto text-green-600 mb-1" />
//                       <p className="text-[10px] font-black uppercase text-green-800">Settled</p>
//                    </div>
//                 ) : (
//                   <>
//                     <Input type="number" placeholder="LKR Amount" className="h-12 text-lg font-bold" value={payAmount || ""} onChange={e => setPayAmount(Number(e.target.value))} />
//                     <Button className="w-full bg-slate-900 h-12" onClick={() => recordPaymentAction({ invoiceId: Number(selectedInvoiceId), amount: payAmount, method: 'Cash', paymentDate: new Date().toISOString() })}>Submit Payment</Button>
//                   </>
//                 )}
//               </Card>
//             </div>

//             <div className="xl:col-span-8 space-y-4">
//               {selectedInvoice && (
//                 <>
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
//                       <p className="text-[9px] font-bold text-slate-400 uppercase">Billed</p>
//                       <p className="text-sm font-black italic">LKR {selectedInvoice.total.toLocaleString()}</p>
//                     </div>
//                     <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
//                       <p className="text-[9px] font-bold text-slate-400 uppercase">Paid</p>
//                       <p className="text-sm font-black text-green-600 italic">LKR {selectedInvoice.amountPaid.toLocaleString()}</p>
//                     </div>
//                     <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
//                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Remaining</p>
//                       <p className="text-sm font-black text-red-600 italic">LKR {(selectedInvoice.total - selectedInvoice.amountPaid).toLocaleString()}</p>
//                     </div>
//                   </div>

//                   <Card className="shadow-xl border-none bg-white overflow-hidden">
//                     <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-slate-50 border-b">
//                       <CardTitle className="text-xs font-black uppercase text-slate-500 italic tracking-widest">History Ledger</CardTitle>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm" className="gap-2 h-8 font-bold" onClick={() => shareStatement(selectedInvoice, true)}>
//                           <Download size={14}/> Download
//                         </Button>
//                         <Button variant="outline" size="sm" className="gap-2 h-8 font-bold" onClick={() => shareStatement(selectedInvoice, false)}>
//                           <Mail size={14}/> Share All
//                         </Button>
//                         <Button variant="destructive" size="sm" className="gap-2 h-8 font-bold shadow-sm" onClick={handleBulkDelete}>
//                           <Trash2 size={14}/> Delete All
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-0">
//                       {selectedInvoice.payments.map((p: any) => (
//                         <div key={p.id} className="p-4 flex justify-between items-center border-b last:border-0 group hover:bg-slate-50">
//                           <div className="flex items-center gap-4">
//                             <Landmark size={18} className="text-slate-300"/>
//                             <div>
//                               <p className="font-black text-xs uppercase italic">Payment Received</p>
//                               <p className="text-[10px] text-slate-400">{new Date(p.paymentDate).toLocaleString()}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-6">
//                             <span className="font-black text-green-600 text-sm">+{p.amount.toLocaleString()}</span>
//                             <div className="flex gap-1 opacity-0 group-hover:opacity-100">
//                               <Button variant="ghost" size="icon" onClick={() => shareReceipt(p, selectedInvoice, true)}><Download size={14}/></Button>
//                               <Button variant="ghost" size="icon" className="text-blue-500" onClick={() => shareReceipt(p, selectedInvoice, false)}><Mail size={14}/></Button>
//                               <Button variant="ghost" size="icon" onClick={() => { setEditingPayment(p); setEditModalOpen(true); }}><Edit3 size={14}/></Button>
//                               <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeletePayment(p.id)}><Trash2 size={14}/></Button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* EDIT MODAL */}
//       <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
//         <DialogContent className="bg-white">
//           <DialogHeader><DialogTitle className="text-xs font-black uppercase">Edit Entry</DialogTitle></DialogHeader>
//           <div className="space-y-4 py-4">
//             <Input type="number" value={editingPayment?.amount || 0} onChange={e => setEditingPayment({...editingPayment, amount: Number(e.target.value)})} />
//             <Input type="datetime-local" value={editingPayment?.paymentDate ? new Date(editingPayment.paymentDate).toISOString().slice(0, 16) : ''} onChange={e => setEditingPayment({...editingPayment, paymentDate: new Date(e.target.value).toISOString()})} />
//           </div>
//           <DialogFooter>
//             <Button onClick={handleUpdatePayment} disabled={loading} className="bg-slate-900 w-full font-bold">Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }