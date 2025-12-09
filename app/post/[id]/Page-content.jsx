"use client";

import { useEffect, useState} from "react";
import { useParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import LoadingPage from "@/components/loadingPage";
import {handleDelete, handleEdit} from "@/lib/posts"

export default function SinglePostPage({user}) {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the single post
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  // Helpers
  const getAuthorId = () => post?.author?._id ?? post?.author ?? null;
  const getUserId = () => user?._id ?? user?.id ?? "";

  const authorId = String(getAuthorId() ?? "");
  const userId = String(getUserId() ?? "");
  const authorRole = post?.author?.role;

  const canEdit =
    user?.role === "admin" ||
    (user?.role === "manager" && authorRole !== "admin") ||
    authorId === userId;

  const canDelete = user?.role === "admin" || authorId === userId;
 

//   handler
const handleDeleteClick = async () => {
  const success = await handleDelete(id);
  if (success) router.back(); 
};

  if (loading) return <LoadingPage />;
  if (!post) return <p className="text-center mt-12 text-lg">Post not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="rounded-xl shadow-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {DOMPurify.sanitize(post.title)}
          </h1>
          <p className="mt-2 text-sm opacity-95">
            By{" "}
            <span className="font-semibold">
              {DOMPurify.sanitize(post.author?.name || "Unknown")}
            </span>{" "}
            • {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="prose prose-lg max-w-none text-gray-800">
            {DOMPurify.sanitize(post.content)}
          </div>

          <div className="mt-6 flex items-center gap-3">
            {canEdit && (
              <button
                onClick={()=>handleEdit(id, router)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
              >
                ✏ Edit
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
              >
                🗑 Delete
              </button>
            )}

            <button
              onClick={() => router.back()}
              className="ml-auto text-blue-600 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
