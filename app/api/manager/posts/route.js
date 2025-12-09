import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { protect, managerOnly } from "@/lib/middleware";

export async function GET(req) {
  await connectDB();

  const isManager = await managerOnly(req);
  if (!isManager) {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }

  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
