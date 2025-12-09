"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import LoadingPage from "@/components/loadingPage";
import { handleDelete, handleEdit } from "@/lib/posts";

export default function AdminPosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/posts", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle delete using imported helper
  const handleDeleteClick = async (id) => {
    const success = await handleDelete(id);
    if (success) {
      setPosts((prev) => prev.filter((post) => post._id !== id));
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">All Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">
                {DOMPurify.sanitize(post.title)}
              </h2>
              <p className="text-gray-500 mb-2">
                By {DOMPurify.sanitize(post.author?.name || "Unknown")}
              </p>
              <p className="text-gray-700 mb-4">
                {DOMPurify.sanitize(post.content.slice(0, 100))}...
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post._id, router)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(post._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
