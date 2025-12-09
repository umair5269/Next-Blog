"use client";

import { useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

export default function AdminDashboard({ user }) {
  const router = useRouter();

  return (
    <>

      <div className="min-h-screen bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Manage Users Card */}
            <div
              onClick={() => router.push("/admin/users")}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FaUsers className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Manage Users
              </h2>
              <p className="text-gray-500 text-center">
                View, edit, and remove users from the system.
              </p>
            </div>

            {/* Manage Posts Card */}
            <div
              onClick={() => router.push("/admin/posts")}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
            >
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FiFileText className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Manage Posts
              </h2>
              <p className="text-gray-500 text-center">
                Review, edit, or delete posts from all authors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
