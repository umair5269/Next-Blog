// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { adminOnly } from "@/lib/middleware";


// get all users except admins
export async function GET(req) {
  await connectDB();

  const admin = await adminOnly(req);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
