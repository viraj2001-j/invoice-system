"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Users,
  BarChart3,
  Menu as MenuIcon,
  X,
  Fingerprint,
  CreditCard,
  ShieldCheck,
  MessageSquareShare,
  LogOut
} from "lucide-react"

type MenuItem = {
  label: string
  href: string
  icon: React.ReactNode
  superAdminOnly?: boolean
}

const menu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Create Invoice", href: "/dashboard/invoices/new", icon: <FilePlus size={20} /> },
  { label: "View Invoices", href: "/dashboard/invoices/view", icon: <FileText size={20} /> },
  { label: "Clients", href: "/dashboard/clients", icon: <Users size={20} /> },
  { label: "Reports & Analytics", href: "/dashboard/invoices/reports", icon: <BarChart3 size={20} /> },
  { label: "Signature", href: "/dashboard/invoices/addsignature", icon: <Fingerprint size={20} />, superAdminOnly: true },
  { label: "Payment(CRUD)", href: "/dashboard/invoices/payment", icon: <CreditCard size={20} /> },
  { label: "Admin Settings", href: "/superadmin/createadmin", icon: <ShieldCheck size={20} />, superAdminOnly: true },
  { label: "Send Message", href: "/settings", icon: <MessageSquareShare size={20} /> },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const userName = useMemo(() => (session?.user as any)?.username || "User", [session])
  const userRole = (session?.user as any)?.role || "ADMIN"
  const isSuperAdmin = userRole === "SUPERADMIN"

  return (
    <>
      {/* --- MOBILE TOP NAVIGATIONBAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] bg-blue-950 text-white flex items-center justify-between p-4 shadow-md">
        <div className="flex flex-col">
          <span className="font-black text-sm tracking-tighter uppercase italic leading-none">
            LUCIFER<span className="text-blue-400">.</span>
          </span>
          <span className="text-[8px] text-blue-300 font-bold uppercase tracking-widest">
            {userRole}
          </span>
        </div>
        <button 
          onClick={() => setMobileOpen(true)} 
          className="p-2 hover:bg-blue-900 rounded-lg transition-colors"
          aria-label="Open Menu"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[70] md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* --- SIDEBAR ASIDE --- */}
      <aside
        className={`fixed md:sticky top-0 z-[80] h-screen bg-blue-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl
        ${collapsed ? "md:w-20" : "md:w-64"} 
        w-[280px] 
        ${mobileOpen ? "left-0" : "-left-full"}
        md:left-0`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800/50">
          <div className={`flex flex-col ${collapsed ? "md:hidden" : "block"}`}>
            <span className="font-black text-xl tracking-tighter uppercase italic leading-none">
              LUCIFER<span className="text-blue-400">.</span>
            </span>
            <span className="text-[9px] text-blue-300 font-black uppercase tracking-[0.2em] mt-1">
              {isSuperAdmin ? "Root Access" : "Admin Node"}
            </span>
          </div>

          {/* Desktop Collapse Toggle */}
          <button 
            className="p-1 hover:bg-blue-800 rounded transition-colors hidden md:block" 
            onClick={() => setCollapsed(!collapsed)}
          >
            <MenuIcon size={20} />
          </button>

          {/* Mobile Close Button */}
          <button 
            className="p-1 hover:bg-blue-800 rounded transition-colors md:hidden" 
            onClick={() => setMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          {menu.map((item) => {
            if (item.superAdminOnly && !isSuperAdmin) return null
            const active = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-black uppercase tracking-tight transition-all
                ${active 
                  ? "bg-white text-blue-950 shadow-xl" 
                  : "text-blue-100 hover:bg-blue-800 hover:translate-x-1"
                }`}
                onClick={() => setMobileOpen(false)} // Closes menu when link clicked
              >
                <span className={`${active ? "text-red-600" : "text-blue-400"}`}>
                  {item.icon}
                </span>
                <span className={`${collapsed ? "md:hidden" : "block"}`}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* FOOTER / USER PROFILE */}
        <div className="p-4 border-t border-blue-800/50 bg-blue-950/40">
          <div className={`flex items-center gap-3 px-2 py-3 mb-2 bg-blue-900/50 rounded-2xl border border-white/5 ${collapsed ? "md:justify-center" : ""}`}>
            <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-black text-xs text-white shadow-lg">
              {userName[0]?.toUpperCase()}
            </div>
            <div className={`flex flex-col overflow-hidden ${collapsed ? "md:hidden" : "block"}`}>
              <span className="text-[10px] font-black uppercase italic truncate">{userName}</span>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] text-blue-400 uppercase font-black tracking-widest">Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[10px] font-black uppercase italic text-red-400 hover:bg-red-600 hover:text-white transition-all ${collapsed ? "md:justify-center" : ""}`}
          >
            <LogOut size={18} />
            <span className={`${collapsed ? "md:hidden" : "block"}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}