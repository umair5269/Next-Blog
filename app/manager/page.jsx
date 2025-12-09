import ManagerDashboard from "./managerDashboard";
import {requireManager} from "@/lib/auth"

export default async function ManagerPage() {
  const user = await requireManager();

  return <ManagerDashboard user={user} />;
}
