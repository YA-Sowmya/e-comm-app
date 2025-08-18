import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import HydrateUser from "@/components/HydrateUser";
import Sidebar from "@/components/AdminSidebar";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="bg-accent h-screen">
      <HydrateUser user={session.user} />
      <AdminNavbar />
      <div className="flex ">
        <Sidebar />

        <main className="flex flex-col bg-accent w-full ">{children}</main>
      </div>
    </div>
  );
}
