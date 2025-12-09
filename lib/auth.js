import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/user";
import { redirect } from "next/navigation"

export function generateToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export const getUserFromCookies = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    if (!decoded?.id) return null;

    const userDoc = await User.findById(decoded.id).select("name role email");
    if (!userDoc) return null;

    return {
      _id: userDoc._id.toString(),
      name: userDoc.name,
      role: userDoc.role,
      email: userDoc.email,
    };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};


export async function requireAdmin() {
  const user = await getUserFromCookies();
  if (!user || user.role !== "admin") redirect("/");
  return user;
}
export async function requireManager() {
  const user = await getUserFromCookies();
  if (!user || user.role !== "manager") redirect("/");
  return user;
}
