"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { z } from "zod"

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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Enter your credentials to access your dashboard
        </p>

        {errors.general && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <Input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  )
}
