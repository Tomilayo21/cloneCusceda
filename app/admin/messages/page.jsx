"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const AdminMessagesDashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [viewArchived, setViewArchived] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.publicMetadata?.role !== "admin") {
      router.push("/");
    } else {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const bulkAction = async (type) => {
    for (const id of selectedIds) {
      await fetch(`/api/contact/messages/${id}`, {
        method: type === "delete" ? "DELETE" : "PATCH",
        body:
          type === "archive"
            ? JSON.stringify({ archived: true })
            : type === "unarchive"
            ? JSON.stringify({ archived: false })
            : undefined,
      });
    }
    setSelectedIds([]);
    fetchMessages();
  };

  const filteredMessages = viewArchived
    ? messages.filter((msg) => msg.archived)
    : messages.filter((msg) => !msg.archived);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 sm:mb-6">Admin Messages Dashboard</h1>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => setViewArchived(!viewArchived)}
          className="px-4 py-2 border rounded shadow text-sm sm:text-base"
        >
          {viewArchived ? "View Active" : "View Archived"}
        </button>

        <button
          onClick={() => bulkAction("archive")}
          disabled={!selectedIds.length}
          className="px-4 py-2 bg-yellow-500 text-white rounded text-sm sm:text-base disabled:opacity-50"
        >
          Archive Selected
        </button>
        <button
          onClick={() => bulkAction("unarchive")}
          disabled={!selectedIds.length}
          className="px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-base disabled:opacity-50"
        >
          Unarchive Selected
        </button>
        <button
          onClick={() => bulkAction("delete")}
          disabled={!selectedIds.length}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm sm:text-base disabled:opacity-50"
        >
          Delete Selected
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : (
        <div className="space-y-4">
          {filteredMessages.length ? (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className="p-4 border rounded shadow flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(msg._id)}
                    onChange={() => toggleSelect(msg._id)}
                    className="mt-1"
                  />
                  <div className="space-y-1 text-sm sm:text-base">
                    <p><strong>Name:</strong> {msg.name}</p>
                    <p><strong>Email:</strong> {msg.email}</p>
                    <p><strong>Subject:</strong> {msg.subject}</p>
                    <p className="text-gray-700">{msg.message}</p>
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col items-start">
                  <button
                    onClick={async () => {
                      await fetch(`/api/contact/messages/${msg._id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ archived: !msg.archived }),
                      });
                      fetchMessages();
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {msg.archived ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    onClick={async () => {
                      await fetch(`/api/contact/messages/${msg._id}`, {
                        method: "DELETE",
                      });
                      fetchMessages();
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMessagesDashboard;
