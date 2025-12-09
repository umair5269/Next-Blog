// app/api/admin/posts/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { adminOnly } from "@/lib/middleware";
import Post from "@/models/post";


// get all posts
export async function GET(req) {
  await connectDB();

  const admin = await adminOnly(req);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
