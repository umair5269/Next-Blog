"use client";

import { useState } from "react";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";

export default function CreatePostPage({user}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft"); // draft or published
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Sanitize inputs
    const cleanTitle = DOMPurify.sanitize(title);
    const cleanContent = DOMPurify.sanitize(content);

    const postData = {
      title: cleanTitle,
      content: cleanContent,
      status,
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      const data = await res.json();
      alert("✅ Post created successfully!");

      // Reset form
      setTitle("");
      setContent("");
      setStatus("draft");

      // Optionally navigate to dashboard or homepage
    //   router.push("/");
    } catch (err) {
      console.error("❌ Error creating post:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow text-gray-500">
        <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              rows="6"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </>
  );
}
