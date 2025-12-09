import { getUserFromCookies } from "@/lib/auth";
import SinglePostPage from "./Page-content"

export default async function SinglePost() {
 const user = await getUserFromCookies();

    return <SinglePostPage user={user} />;
}
