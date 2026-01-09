import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/db";

// app/api/send-message/route.ts
export async function POST(req: Request) {
  try {
    const { to, subject, message, clientId } = await req.json();
    
    // 🔍 DEBUG: Check the terminal to see if 'to' is correct
    console.log("Attempting to send email to:", to);

    if (!to || !to.includes("@")) {
       return NextResponse.json({ error: "Invalid recipient email" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Lucifer Accounts" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      text: message,
    });

    console.log("Message sent: %s", info.messageId); // Log success

    await prisma.message.create({
      data: { subject, body: message, clientId: Number(clientId) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Nodemailer Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// app/api/send-message/route.ts

// ... keep your existing POST function here ...

export async function GET() {
  try {
    const history = await prisma.message.findMany({
      include: { 
        client: {
          select: { name: true, email: true }
        } 
      },
      orderBy: { sentAt: 'desc' }
    });

    // 🟢 Crucial: Always return a JSON array, even if empty
    return NextResponse.json(history || []);
  } catch (error: any) {
    console.error("GET_HISTORY_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}