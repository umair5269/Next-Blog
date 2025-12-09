"use client";

import DOMPurify from "isomorphic-dompurify";

export default function Data({user}) {

    console.log("User data in profile page:", user);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-50 text-gray-500 px-4 py-6 rounded-lg shadow text-center">
          Loading user info...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8">User Dashboard</h2>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
          Welcome, {DOMPurify.sanitize(user.name)}!
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Name:</span>
            <span className="text-gray-800">{DOMPurify.sanitize(user.name)}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Email:</span>
            <span className="text-gray-800">{DOMPurify.sanitize(user.email)}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Role:</span>
            <span className="capitalize text-gray-800">
              {DOMPurify.sanitize(user.role)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
