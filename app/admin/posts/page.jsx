import AdminPosts from "./adminPosts";
import {requireAdmin} from "@/lib/auth"

export default async function AdminPostsPage() {
  const user = await requireAdmin();

  return <AdminPosts user={user} />;
}
