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
    const { email, password } = await req.json();

    // ✅ Sanitize & clean inputs
    const cleanEmail = xss(sanitize(email?.trim().toLowerCase()));
    const cleanPassword = xss(sanitize(password?.trim()));

    // ✅ Validate email format
    if (!validator.isEmail(cleanEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ Find user safely using sanitized email
    const user = await User.findOne({ email: cleanEmail });

    // ✅ Verify password
    if (!user || !(await user.matchPassword(cleanPassword))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Generate token
    const token = generateToken(user._id, user.role);

    // ✅ Send response and secure cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

















// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/user";
// import { generateToken } from "@/lib/auth";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { email, password } = await req.json();
//     const user = await User.findOne({ email });

//     if (!user || !(await user.matchPassword(password))) {
//       return NextResponse.json(
//         { message: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     const token = generateToken(user._id, user.role);

//     const response = NextResponse.json(
//       {
//         message: "Login successful",
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       },
//       { status: 200 }
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
//     console.error("Login error:", err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
