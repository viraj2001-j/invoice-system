"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { z } from "zod"
import { FileText, Lock, User, Loader2, AlertCircle, ArrowRight, FlaskConical } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/* ---------------- Zod Schema ---------------- */
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

/* ---------------- Component ---------------- */
export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  })

  const [errors, setErrors] = useState<Partial<LoginForm & { general: string }>>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // 1️⃣ Validate form
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<LoginForm> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof LoginForm] = issue.message
      })
      return setErrors(fieldErrors)
    }

    // 2️⃣ Sign in
    setLoading(true)
    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    })
    setLoading(false)

    // 3️⃣ Handle result
    if (res?.error) {
      setErrors({ general: "Invalid username or password" })
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="relative z-10 text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
              <FileText className="w-20 h-20 text-white" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl font-black text-white tracking-tight">
            LUCIFER
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 font-light max-w-md">
            Professional Invoice Management System
          </p>
          
          {/* Features */}
          <div className="mt-12 space-y-4 text-left max-w-md">
            {[
              "Create & manage invoices effortlessly",
              "Track payments & client data",
              "Generate professional reports",
              "Secure & reliable platform"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-xl">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </div>
          
          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your invoice dashboard
              </p>
            </div>

            {/* Error Alert */}
            {errors.general && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Authentication Failed</p>
                  <p className="text-sm text-red-600 mt-1">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className={`pl-10 h-12 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-blue-600"}`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`pl-10 h-12 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-blue-600"}`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button 
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

<Button
                type="button"
                variant="outline"
                onClick={() => router.push("/test-invoice")}
                className="w-full h-12 border-2 border-slate-100 hover:bg-slate-50 text-slate-600 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <FlaskConical className="w-5 h-5 text-blue-600" />
                Test Invoice Mode
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  support@lucifer.com
                </a>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}