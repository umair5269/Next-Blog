import { getUserFromCookies } from "@/lib/auth";
import CreatePostPage from "./createPost"

export default async function CreatePost() {
 const user = await getUserFromCookies();

    return <CreatePostPage user={user} />;
}
