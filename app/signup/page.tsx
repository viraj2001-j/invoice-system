"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Sidebar from "@/components/sidebar" // 🟢 Import your Sidebar
import { Loader2, UserPlus } from "lucide-react"

export default function SignupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "", role: "ADMIN" as any })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 🛡️ 1. Automatic Redirect if not Super Admin
  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== "SUPERADMIN") {
      router.push("/login")
    }
  }, [status, session, router])

  async function handleSubmit() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then(r => r.json())
      
      if (res.error) {
        setError(res.error)
        setLoading(false)
      } else {
        toast.success("User Provisioned Successfully")
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Network error occurred")
      setLoading(false)
    }
  }

  if (status === "loading" || session?.user?.role !== "SUPERADMIN") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="text-red-600 animate-spin" size={40} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-950">
      {/* 🟢 Added Sidebar here */}
      <Sidebar />

      {/* 🟢 Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 bg-slate-900 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-600/20">
              <UserPlus className="text-blue-400" size={30} />
            </div>
            <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
              Create User<span className="text-blue-600">.</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Provision New Node Access</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              <p className="text-[10px] text-red-500 font-black uppercase italic text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Username</label>
              <Input 
                  placeholder="USERNAME" 
                  onChange={e => setForm({...form, username: e.target.value})} 
                  className="bg-slate-800 border-none h-12 rounded-xl text-white font-bold placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Password</label>
              <Input 
                  type="password" 
                  placeholder="••••••••" 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  className="bg-slate-800 border-none h-12 rounded-xl text-white font-bold placeholder:text-slate-600"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Access Level</label>
              <select 
                  className="w-full bg-slate-800 p-3 rounded-xl text-xs font-black uppercase italic outline-none text-white border-none h-12 appearance-none"
                  onChange={e => setForm({...form, role: e.target.value})}
                  value={form.role}
              >
                <option value="ADMIN">ADMINISTRATOR</option>
                <option value="SUPERADMIN">SUPER ADMIN</option>
              </select>
            </div>

            <Button 
              className="w-full h-14 bg-white text-slate-950 font-black uppercase italic rounded-xl hover:bg-slate-200 transition-all active:scale-95 mt-4" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "PROVISION ACCESS"}
            </Button>
          </div>
          
          <p className="text-center text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            Security Protocol LUCIFER-01 Active
          </p>
        </div>
      </div>
    </div>
  )
}