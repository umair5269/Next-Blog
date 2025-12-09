import { getUserFromCookies } from "@/lib/auth";
import MyPostsPage from "./posts-page"

export default async function MyPosts() {
 const user = await getUserFromCookies();

    return <MyPostsPage user={user} />;
}
