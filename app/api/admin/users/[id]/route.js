// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { adminOnly } from "@/lib/middleware";


// delete user
export async function DELETE(req, context) {
  await connectDB();

  const admin = await adminOnly(req);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  const { params } = context;
  const resolved = await params;
  const userId = resolved.id;

  try {
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    await user.deleteOne();
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
