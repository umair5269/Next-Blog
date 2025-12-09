
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { protect } from "@/lib/middleware";
import sanitize from "mongo-sanitize";
import xss from "xss";
import validator from "validator";


// ✅ CREATE POST
export async function POST(req) {
  try {
    await connectDB();
    const user = await protect(req);
    if (!user)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const { title, content, status } = await req.json();

    // ✅ Sanitize inputs
    const cleanTitle = xss(sanitize(title?.trim()));
    const cleanContent = xss(sanitize(content?.trim()));
    const cleanStatus = xss(sanitize(status?.trim() || "Published"));

    // ✅ Validate inputs
    if (!cleanTitle || !cleanContent) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    // ✅ Optional: Validate length (prevents spam / XSS payloads)
    if (!validator.isLength(cleanTitle, { min: 3, max: 150 })) {
      return NextResponse.json(
        { message: "Title must be between 3 and 150 characters" },
        { status: 400 }
      );
    }

    if (!validator.isLength(cleanContent, { min: 10, max: 5000 })) {
      return NextResponse.json(
        { message: "Content must be between 10 and 5000 characters" },
        { status: 400 }
      );
    }

    // ✅ Create post
    const post = await Post.create({
      title: cleanTitle,
      content: cleanContent,
      status: cleanStatus,
      author: user._id,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("Create post error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// ✅ GET POSTS (with search/filter)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      { $sort: { createdAt: -1 } },
    ];

    if (q) {
      // ✅ Sanitize and validate query param
      const cleanQ = xss(sanitize(q.trim()));
      const regex = new RegExp(cleanQ, "i");
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: regex } },
            { content: { $regex: regex } },
            { "author.name": { $regex: regex } },
          ],
        },
      });
    }

    const posts = await Post.aggregate(pipeline);
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}










// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Post from "@/models/post";
// import { protect } from "@/lib/middleware";


// // create  a post
// export async function POST(req) {
//   await connectDB();
//   const user = await protect(req);
//   if (!user) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

//   const { title, content, status } = await req.json();

//    const cleanTitle = xss(sanitize(title));
//     const cleanContent = xss(sanitize(content));

//     if (!cleanTitle || !cleanContent) {
//       return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
//     }

// //   if (!title || !content)
// //     return NextResponse.json({ message: "Title and content are required" }, { status: 400 });

//   try {
//     const post = await Post.create({
//       title : cleanTitle,
//       content: cleanContent,
//       status: status || "Published",
//       author: user._id,
//     });
//     return NextResponse.json(post, { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }


// // get all posts with search and filter
// export async function GET(req) {
//   await connectDB();
//   try {
//     const { searchParams } = new URL(req.url);
//     const q = searchParams.get("q");

//     let pipeline = [
//       { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } },
//       { $unwind: "$author" },
//       { $sort: { createdAt: -1 } },
//     ];

//     if (q) {
//       const regex = new RegExp(q, "i");
//       pipeline.push({
//         $match: {
//           $or: [
//             { title: { $regex: regex } },
//             { content: { $regex: regex } },
//             { "author.name": { $regex: regex } },
//           ],
//         },
//       });
//     }

//     const posts = await Post.aggregate(pipeline);
//     return NextResponse.json(posts);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
