// app/dashboard/page.tsx
import { getServerSession } from "next-auth"


import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route";

// --- TYPES & INTERFACES ---
interface DashboardStats {
  totalRevenue: number;
  totalInvoices: number;
  activeClients: number;
  pendingAmount: number;
  revenueGrowth: number;
  invoiceGrowth: number;
  clientGrowth: number;
  overdueCount: number;
}

interface InvoiceStatus {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; 
}

interface RevenueChartData {
  month: string;
  revenue: number;
  invoices: number;
}

interface RecentInvoice {
  id: string;
  client: string;
  amount: number;
  status: string;
  date: string;
}

interface TopClient {
  name: string;
  revenue: number;
  invoices: number;
}

// 🟢 THIS IS THE ONE MISSING
interface DashboardData {
  stats: DashboardStats;
  invoicesByStatus: InvoiceStatus[];
  revenueChart: RevenueChartData[];
  recentInvoices: RecentInvoice[];
  topClients: TopClient[];
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/login")

  // ⚡ Final Dispatch Logic
  if (session.user.role === "SUPERADMIN") redirect("/superadmin")
  if (session.user.role === "ADMIN") redirect("/admin")
  
  redirect("/login")
}