import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 🟢 GET: Fetch all clients with their company details
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      include: {
        company: true, // Joins the Company table
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("CLIENT_FETCH_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🟢 POST: Register a new client
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, address, website } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        website,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("CLIENT_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Could not create client" }, { status: 500 });
  }
}