// proxy.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // 1. Unauthenticated users go to login
  if (!token) {
    if (pathname === "/login" || pathname.startsWith("/public")) return NextResponse.next()
    return NextResponse.redirect(`${origin}/login`)
  }

  const role = token.role as string

  // 2. Protect Superadmin routes
  if (pathname.startsWith("/superadmin") && role !== "SUPERADMIN") {
    return NextResponse.redirect(`${origin}/admin`) // Redirect to their own dashboard
  }

  // 3. Protect Admin routes
  if (pathname.startsWith("/admin") && role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.redirect(`${origin}/login`)
  }

  // 4. Prevent logged-in users from hitting login page
  if (pathname === "/login") {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*", "/dashboard/:path*", "/login"],
}