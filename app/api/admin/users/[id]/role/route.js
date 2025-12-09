// app/api/admin/users/[id]/role/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { adminOnly } from "@/lib/middleware";


// change role of user
export async function PATCH(req, context) {
  await connectDB();

  const admin = await adminOnly(req);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  const { params } = context;
  const resolved = await params;
  const userId = resolved.id;

  try {
    const { role } = await req.json();

    if (!["user", "manager"].includes(role))
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Prevent admin demoting themselves
    if (user._id.toString() === admin._id.toString() && role !== "admin") {
      return NextResponse.json(
        { message: "You cannot remove your own admin role" },
        { status: 403 }
      );
    }

    // Max 4 managers rule
    if (role === "manager" && user.role !== "manager") {
      const count = await User.countDocuments({ role: "manager" });
      if (count >= 4)
        return NextResponse.json(
          {
            message:
              "Only 4 managers allowed. Remove a manager before adding a new one.",
          },
          { status: 400 }
        );
    }

    user.role = role;
    await user.save();

    return NextResponse.json({
      message: "Role updated successfully",
      user,
    });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
