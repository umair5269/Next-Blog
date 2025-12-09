import { getUserFromCookies } from "@/lib/auth";
import Data from "./data"
 
export default async function MyPosts() {
 const user = await getUserFromCookies();

    return <Data user={user} />;
}