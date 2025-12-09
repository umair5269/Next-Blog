import ManagerUsers from "./managerUsers";
import {requireManager} from "@/lib/auth"

export default async function ManagerUsersPage() {
  const user = await requireManager();

  return <ManagerUsers user={user} />;
}
