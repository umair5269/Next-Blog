"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProtectedLinks({ user }) {
  const router = useRouter();
  const isLoggedIn = !!user;

  const handleClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <>
      <Link
        href="/profile"
        onClick={(e) => handleClick(e, "/profile")}
        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        Profile
      </Link>
      <Link
        href="/my-posts"
        onClick={(e) => handleClick(e, "/my-posts")}
        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        Posts
      </Link>
      <Link
        href="/create-post"
        onClick={(e) => handleClick(e, "/create-post")}
        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        Create Posts
      </Link>
    </>
  );
}
