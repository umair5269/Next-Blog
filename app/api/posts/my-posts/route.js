import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { protect } from "@/lib/middleware";


// get my posts for specific user
export async function GET(req) {
  await connectDB();
  const user = await protect(req);
  if (!user) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  try {
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
