"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
import { useRouter, useSearchParams } from "next/navigation";


export default function HomePage() {
  // ------------------------------
  // 🧠 STATE VARIABLES
  // ------------------------------
  const [activeIndex, setActiveIndex] = useState(-1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // ------------------------------
  // 🔍 INITIALIZE SEARCH FROM URL
  // ------------------------------
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
    setDebouncedSearch(q);
  }, [searchParams]);

  // ------------------------------
  // ⏱️ DEBOUNCE SEARCH INPUT
  // ------------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);

      if (search) {
        router.push(`/?q=${encodeURIComponent(search)}`);
      } else {
        router.push(`/`);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [search, router]);

  // ------------------------------
  // 📡 FETCH POSTS FROM API
  // ------------------------------
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts?q=${debouncedSearch}`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, [debouncedSearch]);

  // ------------------------------
  // ⌨️ KEYBOARD NAVIGATION
  // ------------------------------
  const results = posts;
  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      router.push(`/post/${results[activeIndex]._id}`);
    } else if (e.key === "Escape") {
      setSearch("");
      setActiveIndex(-1);
    }
  };

  // ------------------------------
  // ✨ TEXT HIGHLIGHT COMPONENT
  // ------------------------------
  function HighlightText({ text = "", query = "" }) {
    if (!query) {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
        />
      );
    }

    const q = String(query).slice(0, 100).trim();
    if (!q) {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
        />
      );
    }

    const parts = q
      .split(/\s+/)
      .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .filter(Boolean);

    if (!parts.length) {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
        />
      );
    }

    const regex = new RegExp(`(${parts.join("|")})`, "giu");
    const highlighted = String(text).replace(regex, "<mark>$1</mark>");

    const clean = DOMPurify.sanitize(highlighted, {
      ALLOWED_TAGS: ["mark", "b", "i", "em", "strong", "a"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });

    return <span dangerouslySetInnerHTML={{ __html: clean }} />;
  }

  // ------------------------------
  // 📰 SPLIT POSTS INTO SECTIONS
  // ------------------------------
  const featuredPosts = posts.slice(0, 3);
  const otherPosts = posts.slice(3);

  // ------------------------------
  // 🧱 RENDER UI
  // ------------------------------
  return (
    <>
 

      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <header className="w-full bg-blue-600 text-white py-8 text-center shadow">
          <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
          <p className="mt-2 text-lg">Stay updated with the latest posts</p>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
          {/* Search Input */}
          <div className="w-full mx-auto">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mb-5 text-gray-600"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Conditional Rendering */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-700 text-lg">Loading posts...</p>
            </div>
          ) : !posts.length ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-700 text-lg">No posts available yet.</p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-blue-700">
                  Featured Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredPosts.map((post, i) => {
                    const globalIndex = i;
                    return (
                      <div
                        key={post._id}
                        className={`bg-white rounded-lg shadow transition p-5 ${
                          globalIndex === activeIndex
                            ? "ring-2 ring-blue-400"
                            : ""
                        }`}
                      >
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">
                          <Link href={`/post/${post._id}`}>
                            <HighlightText text={post.title} query={search} />
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          By:{" "}
                          <HighlightText
                            text={post.author?.name || "Unknown"}
                            query={search}
                          />
                        </p>
                        <p className="text-gray-700 text-sm">
                          <HighlightText
                            text={
                              post.content.length > 100
                                ? post.content.substring(0, 100) + "..."
                                : post.content
                            }
                            query={search}
                          />
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Other Posts */}
              {otherPosts.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-bold mb-6 text-blue-700">
                    All Posts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherPosts.map((post, i) => {
                      const globalIndex = i + featuredPosts.length;
                      return (
                        <div
                          key={post._id}
                          className={`bg-white rounded-lg shadow transition p-5 ${
                            globalIndex === activeIndex
                              ? "ring-2 ring-blue-400"
                              : ""
                          }`}
                        >
                          <h3 className="text-lg font-semibold text-blue-600 mb-2">
                            <Link href={`/post/${post._id}`}>
                              <HighlightText text={post.title} query={search} />
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            By:{" "}
                            <HighlightText
                              text={post.author?.name || "Unknown"}
                              query={search}
                            />
                          </p>
                          <p className="text-gray-700 text-sm">
                            <HighlightText
                              text={
                                post.content.length > 100
                                  ? post.content.substring(0, 100) + "..."
                                  : post.content
                              }
                              query={search}
                            />
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full bg-white py-4 text-center text-sm text-gray-500 border-t">
          &copy; {new Date().getFullYear()} My Next.js Blog
        </footer>
      </div>
    </>
  );
}
