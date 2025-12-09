import { NextResponse } from "next/server";
import { protect } from "@/lib/middleware";

export async function GET(req) {
  const user = await protect(req);
  if (!user) return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  return NextResponse.json(user);
}
