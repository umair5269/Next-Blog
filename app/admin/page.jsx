import AdminDashboard from "./adminDashboard";
import {requireAdmin} from "@/lib/auth"

export default async function AdminPage() {
  const user = await requireAdmin();

  return <AdminDashboard user={user} />;
}
