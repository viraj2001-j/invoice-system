import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const email = formData.get("email") as string;
    const clientName = formData.get("clientName") as string;

    // 1. Validation Check
    if (!file || !email) {
      console.error("❌ Email API Error: Missing File or Email");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Transporter Setup
    // Use host/port for maximum compatibility with Gmail App Passwords
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // 16-character App Password
      },
    });

    // 3. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Send Email
    await transporter.sendMail({
      from: `"Lucifer Accounts" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Official Document - ${clientName}`,
      text: `Dear ${clientName},\n\nPlease find your payment document attached.\n\nThank you, \nLucifer Accounts Team`,
      attachments: [
        {
          filename: file.name || "document.pdf",
          content: buffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`✅ Email successfully dispatched to: ${email}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    // This detailed log will appear in your VS Code / Terminal console
    console.error("🚨 NODEMAILER SMTP ERROR:", error.message);
    
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}