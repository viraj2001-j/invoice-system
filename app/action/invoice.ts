import { NextRequest, NextResponse } from "next/server";

// 🟢 FIX: Only export HTTP methods (GET, POST, etc.)
// 🟢 FIX: Params are now Promises in Next.js 16
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params; // MUST await params
  return NextResponse.json({ success: true, id });
}