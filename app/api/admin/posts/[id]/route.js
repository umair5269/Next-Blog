// app/api/admin/posts/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { adminOnly } from "@/lib/middleware";


// delete posts by admin
export async function DELETE(req, context) {
  await connectDB();

  const admin = await adminOnly(req);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  const { params } = context;
  const resolved = await params;
  const postId = resolved.id;

  try {
    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });

    await post.deleteOne();

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
