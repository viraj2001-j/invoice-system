"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Beaker, Zap, ArrowLeft } from "lucide-react" // 🟢 Added ArrowLeft
import { toast } from "sonner"
import { useRouter } from "next/navigation" // 🟢 Added useRouter

// Component Imports
import ClientInformationCard from "@/app/dashboard/invoices/new/components/ClientInformationCard"
import Company from "@/app/dashboard/invoices/new/components/Company"
import InvoiceDetailsCard from "@/app/dashboard/invoices/new/components/InvoiceDetailsCard"
import InvoiceItemsCard from "@/app/dashboard/invoices/new/components/InvoiceItemsCard"
import SummaryCard from "@/app/dashboard/invoices/new/components/SummaryCard"
import NotesTermsCard from "@/app/dashboard/invoices/new/components/NotesTermsCard"

const initialState = {
  company: { name: "", project: "", phone: "", email: "", address: "" },
  client: { name: "", email: "", phone: "", website: "", address: "" },
  details: { 
    invoiceNumber: "DEMO-001", 
    invoiceDate: new Date().toISOString().split('T')[0], 
    dueDate: "", 
    currency: "LKR", 
    category: "" 
  },
  items: [{ description: "", qty: 1, rate: 0 }],
  summary: { subtotal: 0, taxRate: 0, taxAmount: 0, discountType: "Amount", discountValue: 0, total: 0 },
  notes: { note: "", terms: "" }
};

export default function CreateInvoiceUI() {
  const router = useRouter(); // 🟢 Initialize router
  const [invoiceData, setInvoiceData] = useState(initialState)

  const fillSampleData = () => {
    setInvoiceData({
      company: { 
        name: "LUCIFER Digital Solutions", 
        project: "Cloud Infrastructure", 
        phone: "+94 11 200 3000", 
        email: "hq@lucifer.io", 
        address: "666 Nebula Tower, Colombo 01" 
      },
      client: { 
        name: "Acme Corporation", 
        email: "billing@acme.com", 
        phone: "+94 77 555 4433", 
        website: "www.acme.com", 
        address: "78 Industrial Zone, Kandy" 
      },
      details: {
        invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: "2026-02-01",
        currency: "LKR",
        category: "Software License"
      },
      items: [
        { description: "Database Optimization", qty: 1, rate: 45000 },
        { description: "API Integration (Modules)", qty: 3, rate: 12500 },
        { description: "Security Audit", qty: 1, rate: 30000 }
      ],
      summary: { ...initialState.summary, taxRate: 15 },
      notes: { 
        note: "This is a pre-filled demo invoice.", 
        terms: "Strictly for testing UI layouts and component responsiveness." 
      }
    });
    toast.success("Sample Data Injected Successfully");
  };

  useEffect(() => {
    const subtotal = invoiceData.items.reduce((sum, i) => sum + (i.qty * i.rate), 0)
    const taxAmount = subtotal * (invoiceData.summary.taxRate / 100)
    let discount = invoiceData.summary.discountValue
    if (invoiceData.summary.discountType === "Percentage") discount = subtotal * (discount / 100)
    const total = subtotal + taxAmount - discount

    setInvoiceData(prev => ({
      ...prev, 
      summary: { ...prev.summary, subtotal, taxAmount, total }
    }))
  }, [invoiceData.items, invoiceData.summary.taxRate, invoiceData.summary.discountType, invoiceData.summary.discountValue])

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-5xl mx-auto py-12 px-6">
        
        {/* TOP CONTROL BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-8 rounded-[2rem] shadow-2xl mb-12 border border-white/10">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3 justify-center md:justify-start">
              <Zap className="text-blue-500 fill-blue-500" /> 
              Visualizer Mode
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">
              Preview
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {/* 🟢 NEW BACK BUTTON */}
            <Button 
              variant="ghost" 
              onClick={() => router.push("/login")} 
              className="rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-bold px-4"
            >
              <ArrowLeft size={16} className="mr-2"/> Back to Login
            </Button>

            <Button 
              variant="outline" 
              onClick={() => setInvoiceData(initialState)} 
              className="rounded-2xl border-slate-700 text-slate-300 hover:bg-slate-800 font-bold px-6"
            >
              <RotateCcw size={16} className="mr-2"/> Reset
            </Button>

            <Button 
              onClick={fillSampleData} 
              className="bg-blue-600 hover:bg-blue-500 rounded-2xl font-black italic uppercase tracking-widest text-white px-8 h-12 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Beaker size={18} className="mr-2"/> Sample Data
            </Button>
          </div>
        </div>

        {/* INVOICE FORM SECTIONS */}
        <div className="space-y-10 opacity-95">
          <Company data={invoiceData.company} update={(f) => setInvoiceData({...invoiceData, company: {...invoiceData.company, ...f}})} />
          <ClientInformationCard data={invoiceData.client} update={(f) => setInvoiceData({...invoiceData, client: {...invoiceData.client, ...f}})} />
          <InvoiceDetailsCard data={invoiceData.details} update={(f) => setInvoiceData({...invoiceData, details: {...invoiceData.details, ...f}})} />
          <InvoiceItemsCard items={invoiceData.items} update={(ni) => setInvoiceData({...invoiceData, items: ni})} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <SummaryCard 
              currency={invoiceData.details.currency} 
              summary={invoiceData.summary} 
              update={(f) => setInvoiceData({...invoiceData, summary: {...invoiceData.summary, ...f}})} 
            />
            <NotesTermsCard notes={invoiceData.notes} update={(f) => setInvoiceData({...invoiceData, notes: {...invoiceData.notes, ...f}})} />
          </div>
        </div>

        {/* FOOTER NOTICE */}
        <div className="mt-16 text-center border-t border-slate-200 pt-8">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
             LUCIFER. Visualizer Engine &copy; 2026
           </p>
        </div>
      </main>
    </div>
  )
}