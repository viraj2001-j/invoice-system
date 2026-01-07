

// import  prisma  from "@/lib/db"
// import { NextResponse } from "next/server"
// import bcrypt from "bcrypt"
// import { z } from "zod"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { getServerSession } from "next-auth"

// export async function POST(req: Request) {
//   try {
//     // 1. Double-Check Security on the Server
//     const session = await getServerSession(authOptions);

//     if (!session || (session.user as any).role !== "SUPERADMIN") {
//       return NextResponse.json(
//         { error: "Unauthorized: Superadmin privileges required" },
//         { status: 403 }
//       );
//     }

//     // 2. Parse the request body
//     const { username, password, role } = await req.json();

//     if (!username || !password || !role) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // 3. Check if user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { username },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Username is already taken" },
//         { status: 400 }
//       );
//     }

//     // 4. Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 5. Create the new user
//     await prisma.user.create({
//       data: {
//         username,
//         password: hashedPassword,
//         role: role.toUpperCase(), // Ensure consistency
//       },
//     });

//     return NextResponse.json({ message: "User created successfully" }, { status: 201 });

//   } catch (error: any) {
//     console.error("SIGNUP_ERROR:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only SUPERADMIN can provision new nodes
    if (!session || (session.user as any).role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden: Root access required" }, { status: 403 });
    }

    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: "Node name already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role || "ADMIN",
        // createdAt defaults to @default(now()) in schema
      },
    });

    return NextResponse.json({ success: true, id: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("PROVISION_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}