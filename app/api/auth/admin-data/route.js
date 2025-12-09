import { NextResponse } from "next/server";
import { adminOnly } from "@/lib/middleware";

export async function GET(req) {
  const user = await adminOnly(req);
  if (!user) return NextResponse.json({ message: "Access denied" }, { status: 403 });
  return NextResponse.json({ message: "Welcome Admin!", role: user.role });
}
