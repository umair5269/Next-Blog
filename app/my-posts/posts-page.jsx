"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import LoadingPage from "@/components/loadingPage";
import { handleDelete, handleEdit } from "@/lib/posts";

export default function MyPostsPage({ user }) {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = user?.role;
  const userId = user?._id || user?.id;

  // ✅ Fetch user's own posts
  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/my-posts", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };

    fetchMyPosts();
  }, []);

  // ✅ Handle Delete Post
  const handleDeleteClick = async (id) => {
    const success = await handleDelete(id);
    if (success) setPosts((prev) => prev.filter((post) => post._id !== id));
  };

  // ✅ Loading UI
  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">My Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-600">You haven’t created any posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
              >
                <div>
                  {/* ✅ Link to single post */}
                  <button
                    onClick={() => router.push(`/post/${post._id}`)}
                    className="text-blue-600 hover:underline text-left"
                  >
                    <h3
                      className="text-xl font-semibold text-blue-600 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.title),
                      }}
                    />
                  </button>

                  <p
                    className="text-gray-700 text-sm mb-3"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        post.content.length > 100
                          ? post.content.substring(0, 100) + "..."
                          : post.content
                      ),
                    }}
                  />

                  <p className="text-xs text-gray-500">
                    Status: {post.status} |{" "}
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* ✅ Edit/Delete Buttons (owner or admin only) */}
                {(userRole === "admin" || userId === post.author) && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(post._id, router)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
