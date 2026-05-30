import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decryptSession } from "@/lib/session";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  const session = sessionCookie ? await decryptSession(sessionCookie) : null;

  if (!session || !session.authenticated || session.role !== "admin") {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
