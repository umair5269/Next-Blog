"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import LoadingPage from "@/components/loadingPage";

export default function ManagerUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  //   const token = localStorage.getItem('token');
  //   const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/manager/users`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 403) {
          alert("Access denied");
          router.push("/");
          return;
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [router]);

  // if (loading) return <p className="text-center mt-10">Loading users...</p>;
  if (loading) return <LoadingPage />;

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-5700 uppercase">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 text-gray-500">
                    {DOMPurify.sanitize(user.name)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {DOMPurify.sanitize(user.email)}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-right"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
