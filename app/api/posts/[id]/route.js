import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { protect } from "@/lib/middleware";
import sanitize from "mongo-sanitize";
import xss from "xss";
import validator from "validator";

/* ================================
   GET SINGLE POST
================================ */
export async function GET(req, { params }) {
  try {
    await connectDB();

    // 🧹 Sanitize and validate the post ID
    const { id } = await params;
    const cleanId = sanitize(id);
    if (!validator.isMongoId(cleanId)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    const post = await Post.findById(cleanId).populate(
      "author",
      "name email _id role"
    );
    if (!post)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (err) {
    console.error("Get post error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ================================
   UPDATE POST (PATCH)
================================ */
export async function PATCH(req, context) {
  try {
    await connectDB();

    const { params } = context;
    const resolvedParams = (await params) || {};
    const postId = sanitize(resolvedParams.id);

    if (!validator.isMongoId(postId)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    const user = await protect(req);
    if (!user)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });

    // ✅ Only author or admin can edit
    if (
      post.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 🧹 Sanitize & validate incoming data
    const { title, content, status } = await req.json();

    const cleanTitle = title ? xss(sanitize(title.trim())) : post.title;
    const cleanContent = content ? xss(sanitize(content.trim())) : post.content;
    const cleanStatus = status ? xss(sanitize(status.trim())) : post.status;

    if (title && !validator.isLength(cleanTitle, { min: 3, max: 150 })) {
      return NextResponse.json(
        { message: "Title must be between 3 and 150 characters" },
        { status: 400 }
      );
    }

    if (content && !validator.isLength(cleanContent, { min: 10, max: 5000 })) {
      return NextResponse.json(
        { message: "Content must be between 10 and 5000 characters" },
        { status: 400 }
      );
    }

    post.title = cleanTitle;
    post.content = cleanContent;
    post.status = cleanStatus;

    await post.save();

    return NextResponse.json(post);
  } catch (err) {
    console.error("Update post error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ================================
   DELETE POST
================================ */
export async function DELETE(req, context) {
  try {
    await connectDB();

    const { params } = context;
    const resolvedParams = (await params) || {};
    const postId = sanitize(resolvedParams.id);

    if (!validator.isMongoId(postId)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    const user = await protect(req);
    if (!user)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });

    // ✅ Only author or admin can delete
    if (
      post.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await post.deleteOne();
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}




// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Post from "@/models/post";
// import { protect } from "@/lib/middleware";


// // get single post
// export async function GET(req, { params }) {
//   await connectDB();
//   try {
//     const post = await Post.findById(params.id).populate(
//       "author",
//       "name email _id role"
//     );
//     if (!post)
//       return NextResponse.json({ message: "Post not found" }, { status: 404 });
//     return NextResponse.json(post);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }


// // update post or edit post
// export async function PATCH(req, context) {
//   await connectDB();
//   const { params } = context;
//   const resolvedParams = (await params) || {};
//   const postId = resolvedParams.id;

//   const user = await protect(req);
//   if (!user)
//     return NextResponse.json({ message: "Not authorized" }, { status: 401 });

//   try {
//     const post = await Post.findById(postId);
//     if (!post)
//       return NextResponse.json({ message: "Post not found" }, { status: 404 });

//     // Only author or admin can edit
//     if (
//       post.author.toString() !== user._id.toString() &&
//       user.role !== "admin"
//     ) {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     const { title, content, status } = await req.json();
//     if (title) post.title = title;
//     if (content) post.content = content;
//     if (status) post.status = status;

//     await post.save();
//     return NextResponse.json(post);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }


// // delete post
// export async function DELETE(req, context) {
//   await connectDB();
//   const { params } = context;
//   const resolvedParams = (await params) || {};
//   const postId = resolvedParams.id;

//   const user = await protect(req);
//   if (!user)
//     return NextResponse.json({ message: "Not authorized" }, { status: 401 });

//   try {
//     const post = await Post.findById(postId);
//     if (!post)
//       return NextResponse.json({ message: "Post not found" }, { status: 404 });

//     // Only author or admin can delete
//     if (
//       post.author.toString() !== user._id.toString() &&
//       user.role !== "admin"
//     ) {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     await post.deleteOne();
//     return NextResponse.json({ message: "Post deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
