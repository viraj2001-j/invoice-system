import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Security Shield: Only Superadmins can view the node list
    if (!session || (session.user as any).role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        // Password is excluded for security
      }
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("ADMIN_LIST_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 });
  }
}