"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/loadingPage";
import DOMPurify from "dompurify";
import { handleEdit } from "@/lib/posts";

export default function ManagerPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/manager/posts`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching manager posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">All Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-600">
                <a href={`/post/${post._id}`}>
                  {DOMPurify.sanitize(post.title)}
                </a>
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
                {/* Managers cannot delete posts, so delete button is removed */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
