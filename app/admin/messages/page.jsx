"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Footer from "@/components/admin/Footer";

dayjs.extend(relativeTime);

const AdminMessagesDashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("inbox");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMessage, setOpenMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
      toast.error("Failed to fetch messages.");
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
    try {
      for (const id of selectedIds) {
        let body = {};
        if (type === "archive") body = { archived: true };
        else if (type === "unarchive") body = { archived: false };
        else if (type === "read") body = { read: true };
        else if (type === "unread") body = { read: false };
        else if (type === "delete") body = { deleted: true };
        else continue;

        await fetch(`/api/contact/messages/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      toast.success(`Selected messages ${type}d.`);
    } catch {
      toast.error("Bulk action failed.");
    } finally {
      setSelectedIds([]);
      fetchMessages();
    }
  };

  const handleMarkAsRead = async (msg) => {
    if (!msg.read) {
      await fetch(`/api/contact/messages/${msg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      fetchMessages();
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Subject", "Message", "Created At"];
    const rows = filteredMessages.map((msg) => [
      msg.name,
      msg.email,
      msg.subject,
      msg.message.replace(/\n/g, " "),
      new Date(msg.createdAt).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "messages.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMessages = messages
    .filter((msg) => {
      if (view === "inbox") return !msg.archived && !msg.deleted;
      if (view === "unread") return !msg.read && !msg.archived && !msg.deleted;
      if (view === "archived") return msg.archived && !msg.deleted;
      if (view === "deleted") return msg.deleted;
      return false;
    })
    .filter((msg) =>
      [msg.name, msg.email, msg.subject, msg.message]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const unreadCount = messages.filter(
    (msg) => !msg.read && !msg.archived && !msg.deleted
  ).length;
  const inboxCount = messages.filter(
    (msg) => !msg.archived && !msg.deleted
  ).length;
  const archivedCount = messages.filter(
    (msg) => msg.archived && !msg.deleted
  ).length;
  const deletedCount = messages.filter((msg) => msg.deleted).length;

  const totalPages = Math.ceil(filteredMessages.length / pageSize);

  const handleSelectAll = () => {
    const idsOnPage = paginatedMessages.map((msg) => msg._id);
    const allSelected = idsOnPage.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !idsOnPage.includes(id)) : [...new Set([...prev, ...idsOnPage])]
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Messages Dashboard</h1>
      {/* View Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        {["inbox", "unread", "archived", "deleted"].map((v) => (
          <button
            key={v}
            onClick={() => {
              setView(v);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded text-sm sm:text-base ${
              view === v ? "bg-black text-white" : "border"
            }`}
          >
            {v[0].toUpperCase() + v.slice(1)} (
              {({
                inbox: inboxCount,
                unread: unreadCount,
                archived: archivedCount,
                deleted: deletedCount,
              }[v])}
            )
          </button>
        ))}
      </div>

      {/* Tools */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded text-sm"
        />
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
        >
          {paginatedMessages.every((msg) => selectedIds.includes(msg._id))
            ? "Unselect All"
            : "Select All"}
        </button>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-gray-700 text-white rounded text-sm"
        >
          Export CSV
        </button>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => bulkAction("read")}
          disabled={!selectedIds.length}
          className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50"
        >
          Mark as Read
        </button>
        <button
          onClick={() => bulkAction("unread")}
          disabled={!selectedIds.length}
          className="px-4 py-2 bg-yellow-600 text-white rounded text-sm disabled:opacity-50"
        >
          Mark as Unread
        </button>
        <button
          onClick={() => bulkAction("archive")}
          disabled={!selectedIds.length}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
        >
          Archive Selected
        </button>
        <button
          onClick={() => bulkAction("delete")}
          disabled={!selectedIds.length}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm disabled:opacity-50"
        >
          Delete Selected
        </button>
      </div>

      {/* Message List */}
      {loading ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : paginatedMessages.length ? (
        <div className="space-y-4">
          {paginatedMessages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => {
                setOpenMessage(msg);
                handleMarkAsRead(msg);
              }}
              className={`p-4 border rounded shadow flex flex-col sm:flex-row justify-between gap-4 cursor-pointer ${
                !msg.read ? "bg-yellow-50" : ""
              }`}
            >
              <div className="w-full max-w-md mx-auto bg-white p-4 rounded-md shadow space-y-1 text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(msg._id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelect(msg._id);
                  }}
                  className="mt-1"
                />
                <div className="space-y-1 text-sm sm:text-base">
                  <p>
                    <strong>Name:</strong> {msg.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {msg.email}
                  </p>
                  <p>
                    <strong>Subject:</strong> {msg.subject}
                  </p>
                  <p className="text-gray-700 whitespace-pre-line line-clamp-2">{msg.message}</p>
                  <p className="text-xs text-gray-500">
                    Sent: {dayjs(msg.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col items-start">
                {view !== "deleted" && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await fetch(`/api/contact/messages/${msg._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ archived: !msg.archived }),
                      });
                      toast.success(
                        msg.archived ? "Message unarchived." : "Message archived."
                      );
                      fetchMessages();
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {msg.archived ? "Unarchive" : "Archive"}
                  </button>
                )}
                {view === "deleted" ? (
                  <>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await fetch(`/api/contact/messages/${msg._id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ deleted: false }),
                        });
                        toast.success("Message restored.");
                        fetchMessages();
                      }}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Restore
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await fetch(`/api/contact/messages/${msg._id}?force=true`, {
                          method: "DELETE",
                        });
                        toast.success("Message permanently deleted.");
                        fetchMessages();
                      }}
                      className="text-sm text-red-700 hover:underline"
                    >
                      Delete Permanently
                    </button>
                  </>
                ) : (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await fetch(`/api/contact/messages/${msg._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ deleted: true }),
                      });
                      toast.success("Message deleted.");
                      fetchMessages();
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No messages found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Message Modal */}
      {openMessage && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-xl">
            <button
              onClick={() => setOpenMessage(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-2">{openMessage.subject}</h2>
            <p className="text-sm text-gray-500 mb-1">
              From: {openMessage.name} ({openMessage.email})
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Sent {dayjs(openMessage.createdAt).fromNow()}
            </p>
            <p className="text-base whitespace-pre-line">
              {openMessage.message}
            </p>
          </div>
        </div>
      )}

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AdminMessagesDashboard;
