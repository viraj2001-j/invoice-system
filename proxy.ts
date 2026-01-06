// proxy.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  // 1. PUBLIC ROUTE EXCEPTION
  if (pathname.startsWith('/public')) {
    return NextResponse.next()
  }

  // 2. CHECK FOR AUTHENTICATION
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 3. REDIRECT TO LOGIN IF NO TOKEN
  if (!token) {
    // 🟢 Using origin ensures the redirect is absolute and clean
    return NextResponse.redirect(`${origin}/login`)
  }

  // 4. SUPERADMIN PROTECTION
  if (pathname.startsWith("/superadmin") && token.role !== "SUPERADMIN") {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // 5. ADMIN PROTECTION
  if (pathname.startsWith("/admin")) {
    const isAuthorized = token.role === "ADMIN" || token.role === "SUPERADMIN"
    if (!isAuthorized) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/superadmin/:path*", 
    "/dashboard/:path*",
    // "/public/:path*" // 🟢 Note: You can actually remove this from matcher if 
                        // you want to skip proxy execution for public routes entirely
  ],
}