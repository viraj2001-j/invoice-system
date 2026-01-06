import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import MaintenanceTrigger from "@/app/dashboard/invoices/view/MaintenanceTrigger";

export default async function DashboardRedirect() {

  // ⚡ This runs on EVERY page change within the dashboard
  await MaintenanceTrigger();

  const session = await getServerSession(authOptions)

  console.log("Session:", session)
  if (!session?.user.name) redirect("/login")

  if (session.user.role === "SUPERADMIN") {
    redirect("/superadmin")
  }

  redirect("/admin")
}
