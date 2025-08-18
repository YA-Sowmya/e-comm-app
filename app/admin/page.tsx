import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Bottombar from "@/components/AdminBottombar";
export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="text-2xl bg-white text-cherry font-heading rounded-lg p-4 h-full m-2 font-semibold">
      <h1>Dashboard</h1>
      <p>Welcome back, admin!</p>

      <Bottombar />
    </div>
  );
}
