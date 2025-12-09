import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "Database connected successfully" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
