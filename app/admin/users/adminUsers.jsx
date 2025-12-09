"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import LoadingPage from "@/components/loadingPage";
import { FaRegTrashAlt } from "react-icons/fa";
import { handleDelete } from "@/lib/posts";

export default function AdminUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete user using shared handleDelete
  const onDelete = async (id) => {
    const success = await handleDelete(id);
    if (success) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    }
  };

  // Update role
  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Change role to "${newRole}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update role");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 text-gray-500">{DOMPurify.sanitize(user.name)}</td>
                  <td className="px-6 py-4 text-gray-500">{DOMPurify.sanitize(user.email)}</td>
                  <td className="px-6 py-4 capitalize">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border rounded px-2 py-1 text-gray-500"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(user._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FaRegTrashAlt className="inline h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
