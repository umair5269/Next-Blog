import { NextResponse } from "next/server";
import { managerOnly } from "@/lib/middleware";

export async function GET(req) {
  const user = await managerOnly(req);
  if (!user) return NextResponse.json({ message: "Access denied" }, { status: 403 });
  return NextResponse.json({ message: "Welcome Manager!", role: user.role });
}
