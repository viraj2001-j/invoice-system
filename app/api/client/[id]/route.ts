import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 🟢 PATCH: Update existing client details
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Update type to Promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Await the params to unwrap the ID
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    
    const body = await req.json();

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        website: body.website,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 🟢 DELETE: Remove a client node
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Update type to Promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Await the params to unwrap the ID
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    // Check if client has existing invoices to prevent database errors
    const clientInvoices = await prisma.invoice.count({ where: { clientId: id } });
    if (clientInvoices > 0) {
      return NextResponse.json(
        { error: "Cannot delete client with existing invoices" },
        { status: 400 }
      );
    }

    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete operation failed" }, { status: 500 });
  }
}