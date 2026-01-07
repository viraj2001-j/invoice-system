"use client"

import { useState, useMemo } from "react" // Added useMemo for performance
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Fingerprint, // Better for Signature
  CreditCard,  // Better for Payment
  ShieldCheck, // Better for Admin Settings
  MessageSquareShare // Better for Send Message
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
  { label: "Reports & Analytics", href: "/dashboard/invoices/reports", icon: <BarChart3 size={20} />},
  { label: "Signature", href: "/dashboard/invoices/addsignature", icon: <Fingerprint size={20} />, superAdminOnly: true},
  { label: "Payment(CRUD)", href: "/dashboard/invoices/payment", icon: <CreditCard size={20} /> },
  { label: "Admin Settings", href: "/superadmin/settings", icon: <ShieldCheck size={20} />, superAdminOnly: true },
  { label: "Send Message", href: "/settings", icon: <MessageSquareShare size={20} /> },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const userName = useMemo(() => (session?.user as any)?.username || "User", [session])
  const userRole = (session?.user as any)?.role || "ADMIN"
  const isSuperAdmin = userRole === "SUPERADMIN"

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-blue-950 text-white flex items-center justify-between p-4">
        <span className="font-bold tracking-tight uppercase text-[10px] italic">
          <span className="text-blue-400">.</span> {userRole}
        </span>
        <button onClick={() => setMobileOpen(true)} className="p-1"><MenuIcon /></button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-blue-900 text-white transition-all duration-300 flex flex-col shadow-2xl
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "left-0" : "-left-full"}
        md:left-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-blue-800/50">
          {!collapsed && (
            <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter uppercase italic leading-none">
                    LUCIFER<span className="text-blue-400">.</span>
                </span>
                <span className="text-[9px] text-blue-300 font-black uppercase tracking-[0.2em] mt-1">
                    {isSuperAdmin ? "Root Access" : "Admin Node"}
                </span>
            </div>
          )}
          <button className="p-1 hover:bg-blue-800 rounded transition-colors hidden md:block" onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          {menu.map((item) => {
            if (item.superAdminOnly && !isSuperAdmin) return null
            const active = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true} // 🟢 FIX: Prefetches the page in background for speed
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-black uppercase tracking-tight transition-all
                ${active 
                  ? "bg-white text-blue-950 shadow-xl" 
                  : "text-blue-100 hover:bg-blue-800 hover:translate-x-1"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <span className={`${active ? "text-red-600" : "text-blue-400"}`}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-800/50 bg-blue-950/40">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-3 mb-2 bg-blue-900/50 rounded-2xl border border-white/5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-black text-xs text-white shadow-lg">
                {userName[0].toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-black uppercase italic truncate">{userName}</span>
                <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] text-blue-400 uppercase font-black tracking-widest">Active</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[10px] font-black uppercase italic text-red-400 hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={18} />
            {!collapsed && <span>Terminate Session</span>}
          </button>
        </div>
      </aside>
    </>
  )
}