import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
 
export async function protect(req) {
  await connectDB();
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenCookie = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="));

  const token = tokenCookie?.split("=")[1];
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await User.findById(decoded.id).select("-password");
  return user;
}

export async function adminOnly(req) {
  const user = await protect(req);
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function managerOnly(req) {
  const user = await protect(req);
  if (!user || user.role !== "manager") return null;
  return user;
}
