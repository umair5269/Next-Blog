import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { generateToken } from "@/lib/auth";
import validator from "validator";
import sanitize from "mongo-sanitize";
import xss from "xss";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();

    // ✅ Sanitize input
    const cleanName = xss(sanitize(name?.trim()));
    const cleanEmail = xss(sanitize(email?.trim().toLowerCase()));
    const cleanPassword = xss(sanitize(password?.trim()));

    // ✅ Validate email
    if (!validator.isEmail(cleanEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ Check existing user
    const existing = await User.findOne({ email: cleanEmail });
    if (existing)
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );

    // ✅ Create new user with sanitized data
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: role || undefined,
    });

    // ✅ Generate token
    const token = generateToken(user._id, user.role);

    // ✅ Send response with cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // httpOnly: true,
    // secure: true,
    // sameSite: "none",
    // path: "/",
    // maxAge: 24 * 60 * 60, // 1 day
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // false on localhost
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "lax" works for dev
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/user";
// import { generateToken } from "@/lib/auth";
// import validator from "validator";
// import sanitize from "mongo-sanitize";
// import xss from "xss";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { name, email, password, role } = await req.json();

//     const existing = await User.findOne({ email });
//     if (existing)
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 400 }
//       );

// const cleanName = xss(sanitize(name.trim()));
// const cleanEmail = xss(sanitize(email.trim().toLowerCase()));
// const cleanPassword = xss(sanitize(password?.trim()));

// if (!validator.isEmail(cleanEmail)) {
//   return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
// }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || undefined,
//     });

//     const token = generateToken(user._id, user.role);

//     const response = NextResponse.json(
//       {
//         message: "User registered successfully",
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       },
//       { status: 201 }
//     );

//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       path: "/",
//       maxAge: 24 * 60 * 60,
//     });

//     return response;
//   } catch (err) {
//     console.error("Signup error:", err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
