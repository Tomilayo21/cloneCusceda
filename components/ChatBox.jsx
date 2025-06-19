

"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { format, isToday, isYesterday, parseISO } from "date-fns";

export default function ChatBox() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [adminStatus, setAdminStatus] = useState(null);
  const [welcomeSent, setWelcomeSent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef(null);
  const [justSent, setJustSent] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("/api/admin-status");
      const data = await res.json();
      setAdminStatus(data.status);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (!user) return;
  //   const eventSource = new EventSource(`/api/messages/stream?chatId=${user.id}`);

  //   eventSource.onmessage = async (event) => {
  //     const allMessages = JSON.parse(event.data);

  //     const undelivered = allMessages.filter(
  //       (msg) => msg.isAdmin && msg.status !== "delivered"
  //     );
  //     if (undelivered.length > 0) {
  //       await axios.post("/api/messages/deliver", {
  //         ids: undelivered.map((msg) => msg._id),
  //       });
  //     }

  //     const normalized = allMessages.map((msg) => ({
  //       ...msg,
  //       status: msg.status || "sent",
  //     }));

  //     setMessages(normalized);
  //   };

  //   eventSource.onerror = (err) => {
  //     console.error("SSE Error:", err);
  //     eventSource.close();
  //   };

  //   return () => eventSource.close();
  // }, [user]);
  useEffect(() => {
    if (!user?.id) return;

    const eventSource = new EventSource(`/api/messages/stream?chatId=${user.id}`);

    eventSource.onmessage = async (event) => {
      try {
        const allMessages = JSON.parse(event.data);

        const undelivered = allMessages.filter(
          (msg) => msg.isAdmin && msg.status !== "delivered"
        );

        if (undelivered.length > 0) {
          await axios.post("/api/messages/deliver", {
            ids: undelivered.map((msg) => msg._id),
          });
        }

        const normalized = allMessages.map((msg) => ({
          ...msg,
          status: msg.status || "sent",
        }));

        setMessages(normalized);
      } catch (err) {
        console.error("Message parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user?.id]); // ✅ watch user.id only

  useEffect(() => {
    const sendWelcomeIfNeeded = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`/api/user/${user.id}`);
        const userData = res.data;

        if (!userData.welcomeSent) {
          await axios.post("/api/messages", {
            content: "Welcome to Cusceda! Let us know how we can help you.",
            senderName: "Admin",
            isAdmin: true,
            chatId: user.id,
          });

          await axios.put(`/api/user/${user.id}`, { welcomeSent: true });
          setWelcomeSent(true);
        }
      } catch (err) {
        console.error("Welcome error:", err);
      }
    };

    sendWelcomeIfNeeded();
  }, [user]);

  useEffect(() => {
    const handleFocus = async () => {
      const unseen = messages.filter(
        (msg) => msg.isAdmin && msg.status !== "seen"
      );
      if (unseen.length > 0) {
        await axios.post("/api/messages/seen", {
          ids: unseen.map((msg) => msg._id),
        });
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [messages]);

  useEffect(() => {
    if (!newMsg.trim()) return;
    const timeout = setTimeout(() => {
      fetch("/api/typing-status", {
        method: "POST",
        body: JSON.stringify({ chatId: user?.id, typing: true }),
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [newMsg]);

  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await fetch("/api/typing-status");
      const data = await res.json();
      setIsTyping(data.typingUsers.includes("admin"));
    }, 2000);
    return () => clearInterval(poll);
  }, []);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    await axios.post("/api/messages", {
      content: newMsg,
      senderName: user?.fullName,
      isAdmin: false,
      chatId: user.id,
    });

    setNewMsg("");
    setJustSent(true);
  };

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const isNearBottom = () => {
      if (!container) return false;
      return container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    };

    if (justSent || isNearBottom()) {
      scrollToBottom();
    }

    setJustSent(false);
  }, [messages]);

  const groupedByDate = {};
  messages.forEach((msg) => {
    const dateKey = format(new Date(msg.createdAt), "yyyy-MM-dd");
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(msg);
  });

  return (
    <div className="border bg-gray-400 rounded-lg p-4 w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold">Admin Status:</span>
        <span
          className={`px-3 py-1 rounded text-sm capitalize border ${
            adminStatus === "online"
              ? "bg-green-200 text-green-800"
              : adminStatus === "away"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          {adminStatus || "offline"}
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        className="h-64 mt-3 overflow-y-auto bg-gray-50 p-2 rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      >
        {Object.entries(groupedByDate).map(([dateKey, dateMsgs]) => {
          const date = parseISO(dateKey + "T00:00:00Z");
          let label = format(date, "MMMM d, yyyy");
          if (isToday(date)) label = "Today";
          else if (isYesterday(date)) label = "Yesterday";

          return (
            <div key={dateKey}>
              <div className="text-center text-xs text-gray-500 my-2">{label}</div>
              {dateMsgs.map((msg) => (
                <div
                  key={msg._id}
                  className={`my-2 p-2 rounded text-sm max-w-[75%] ${
                    msg.senderName === user?.fullName
                      ? "bg-blue-100 ml-auto"
                      : "bg-gray-200"
                  }`}
                >
                  <strong>{msg.senderName}</strong>
                  <div className="flex items-center justify-between gap-2">
                    <span>{msg.content}</span>
                    <div className="flex flex-col items-end">
                      {msg.senderName === user?.fullName && (
                        <span className="text-xs text-gray-500">
                          {msg.status === "seen"
                            ? "✓✓ Seen"
                            : msg.status === "delivered"
                            ? "✓✓"
                            : "✓"}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 mt-1">
                        {format(new Date(msg.createdAt), "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        <div ref={ref}></div>
      </div>

      {isTyping && (
        <p className="text-sm text-gray-500 italic mt-1 text-left">
          Admin is typing...
        </p>
      )}

      <div className="flex mt-2 gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}











