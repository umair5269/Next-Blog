import ManagerPosts from "./managerPosts";
import {requireManager} from "@/lib/auth"

export default async function ManagerPostsPage() {
  const user = await requireManager();

  return <ManagerPosts user={user} />;
}
