import Sidebar from "@/components/sidebar"; // Adjust path to your Sidebar file
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Server-side Protection: Check session before even showing the sidebar
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* 🟢 PERSISTENT SIDEBAR 
          This stays mounted and does NOT re-render when you click links */}
      <Sidebar />

      {/* 🟢 MAIN CONTENT AREA
          Only this part updates when you navigate */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar">
        <div className="py-6 px-4 sm:px-6 md:px-8">
          {children}
          <Footer/>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}