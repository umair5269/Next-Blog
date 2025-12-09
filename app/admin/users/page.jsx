import AdminUsers from "./adminUsers";
import {requireAdmin} from "@/lib/auth"

export default async function AdminUsersPage() {
  const user = await requireAdmin();

  return <AdminUsers user={user} />;
}
