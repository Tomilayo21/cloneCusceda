

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import axios from "axios";
// import { format, isToday, isYesterday, parseISO } from "date-fns";
// import { Send, Camera, Image, FileText } from "lucide-react";
// import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/solid";

// export default function ChatBox() {
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [adminStatus, setAdminStatus] = useState(null);
//   const [welcomeSent, setWelcomeSent] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const scrollContainerRef = useRef(null);
//   const [justSent, setJustSent] = useState(false);
//   const ref = useRef(null);
//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);


//   useEffect(() => {
//     const fetchStatus = async () => {
//       const res = await fetch("/api/admin-status");
//       const data = await res.json();
//       setAdminStatus(data.status);
//     };
//     fetchStatus();
//     const interval = setInterval(fetchStatus, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (!user?.id) return;

//     const eventSource = new EventSource(`/api/messages/stream?chatId=${user.id}`);

//     eventSource.onmessage = async (event) => {
//       try {
//         const allMessages = JSON.parse(event.data);

//         const undelivered = allMessages.filter(
//           (msg) => msg.isAdmin && msg.status !== "delivered"
//         );

//         if (undelivered.length > 0) {
//           await axios.post("/api/messages/deliver", {
//             ids: undelivered.map((msg) => msg._id),
//           });
//         }

//         const normalized = allMessages.map((msg) => ({
//           ...msg,
//           status: msg.status || "sent",
//         }));

//         setMessages(normalized);
//       } catch (err) {
//         console.error("Message parse error:", err);
//       }
//     };

//     eventSource.onerror = (err) => {
//       console.error("SSE connection error:", err);
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, [user?.id]); // ✅ watch user.id only

//   useEffect(() => {
//     const sendWelcomeIfNeeded = async () => {
//       if (!user) return;

//       try {
//         const res = await axios.get(`/api/user/${user.id}`);
//         const userData = res.data;

//         if (!userData.welcomeSent) {
//           await axios.post("/api/messages", {
//             content: "Welcome to Cusceda! Let us know how we can help you.",
//             senderName: "Admin",
//             isAdmin: true,
//             chatId: user.id,
//           });

//           await axios.put(`/api/user/${user.id}`, { welcomeSent: true });
//           setWelcomeSent(true);
//         }
//       } catch (err) {
//         console.error("Welcome error:", err);
//       }
//     };

//     sendWelcomeIfNeeded();
//   }, [user]);

//   useEffect(() => {
//     const handleFocus = async () => {
//       const unseen = messages.filter(
//         (msg) => msg.isAdmin && msg.status !== "seen"
//       );
//       if (unseen.length > 0) {
//         await axios.post("/api/messages/seen", {
//           ids: unseen.map((msg) => msg._id),
//         });
//       }
//     };

//     window.addEventListener("focus", handleFocus);
//     return () => window.removeEventListener("focus", handleFocus);
//   }, [messages]);

//   useEffect(() => {
//     if (!newMsg.trim()) return;
//     const timeout = setTimeout(() => {
//       fetch("/api/typing-status", {
//         method: "POST",
//         body: JSON.stringify({ chatId: user?.id, typing: true }),
//       });
//     }, 3000);
//     return () => clearTimeout(timeout);
//   }, [newMsg]);

//   useEffect(() => {
//     const poll = setInterval(async () => {
//       const res = await fetch("/api/typing-status");
//       const data = await res.json();
//       setIsTyping(data.typingUsers.includes("admin"));
//     }, 3000);
//     return () => clearInterval(poll);
//   }, []);

//   const sendMessage = async () => {
//     if (!newMsg.trim()) return;

//     await axios.post("/api/messages", {
//       content: newMsg,
//       senderName: user?.fullName,
//       isAdmin: false,
//       chatId: user.id,
//     });

//     setNewMsg("");
//     setJustSent(true);
//   };

//   const scrollToBottom = () => {
//     ref.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     const isNearBottom = () => {
//       if (!container) return false;
//       return container.scrollHeight - container.scrollTop - container.clientHeight < 50;
//     };

//     if (justSent || isNearBottom()) {
//       scrollToBottom();
//     }

//     setJustSent(false);
//   }, [messages]);

//   const groupedByDate = {};
//   messages.forEach((msg) => {
//     const dateKey = format(new Date(msg.createdAt), "yyyy-MM-dd");
//     if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
//     groupedByDate[dateKey].push(msg);
//   });

//   const handleFileUpload = async (e, chatId) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     const formData = new FormData();
//     files.forEach((file) => formData.append("files", file));
//     formData.append("chatId", chatId);

//     try {
//       const res = await fetch("/api/messages", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       console.log("Uploaded files:", data);
//       // optionally, update your chat UI with the uploaded message(s)
//     } catch (err) {
//       console.error("File upload error:", err);
//     }
//   };


//   return (
//     <div className="border bg-gray-400 rounded-lg p-4 w-full max-w-md mx-auto">
//       <div className="flex items-center gap-2 mb-4">
//         <span className="font-semibold">Admin Status:</span>
//         <span
//           className={`px-3 py-1 rounded text-sm capitalize border ${
//             adminStatus === "online"
//               ? "bg-green-200 text-green-800"
//               : adminStatus === "away"
//               ? "bg-yellow-200 text-yellow-800"
//               : "bg-gray-300 text-gray-800"
//           }`}
//         >
//           {adminStatus || "offline"}
//         </span>
//       </div>

//       <div
//         ref={scrollContainerRef}
//         className="h-64 mt-3 overflow-y-auto bg-gray-50 p-2 rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
//       >
//         {Object.entries(groupedByDate).map(([dateKey, dateMsgs]) => {
//           const date = parseISO(dateKey + "T00:00:00Z");
//           let label = format(date, "MMMM d, yyyy");
//           if (isToday(date)) label = "Today";
//           else if (isYesterday(date)) label = "Yesterday";

//           return (
//             <div key={dateKey}>
//               <div className="text-center text-xs text-gray-500 my-2">{label}</div>
//               {dateMsgs.map((msg) => (
//                 <div
//                   key={msg._id}
//                   className={`my-2 p-2 rounded text-sm max-w-[75%] ${
//                     msg.senderName === user?.fullName
//                       ? "bg-blue-100 ml-auto"
//                       : "bg-gray-200"
//                   }`}
//                 >
//                   <strong>{msg.senderName}</strong>
//                   <div className="flex items-center justify-between gap-2">
//                     <span>{msg.content}</span>
//                     <div className="flex flex-col items-end">
//                       {msg.senderName === user?.fullName && (
//                         <span className="text-xs text-gray-500">
//                           {msg.status === "seen"
//                             ? "✓✓ Seen"
//                             : msg.status === "delivered"
//                             ? "✓✓"
//                             : "✓"}
//                         </span>
//                       )}
//                       <span className="text-[10px] text-gray-400 mt-1">
//                         {format(new Date(msg.createdAt), "h:mm a")}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           );
//         })}
//         <div ref={ref}></div>
//       </div>

//       {isTyping && (
//         <p className="text-sm text-gray-500 italic mt-1 text-left">
//           Admin is typing...
//         </p>
//       )}


//       <div className="relative"> 
//         <div className="flex mt-2 gap-2">
//           <input
//             type="text"
//             value={newMsg}
//             onChange={(e) => {
//               setNewMsg(e.target.value);

//               // Hide attachment menu when typing
//               if (e.target.value.trim().length > 0 && showAttachmentMenu) {
//                 setShowAttachmentMenu(false);
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 sendMessage();
//               }
//             }}
//             className="flex-1 p-2 border rounded"
//             placeholder="Type a message..."
//           />

//           <button
//             onClick={() => {
//               if (newMsg.trim().length > 0) {
//                 sendMessage();
//               } else {
//                 setShowAttachmentMenu((prev) => !prev);
//               }
//             }}
//             className="bg-orange-600 p-3 rounded-full text-white hover:bg-orange-700 transition-colors"
//           >
//             {newMsg.trim().length > 0 ? (
//               <PaperAirplaneIcon className="h-5 w-5" />
//             ) : (
//               <PaperClipIcon className="h-5 w-5" />
//             )}
//           </button>
//         </div>

//         {showAttachmentMenu && (
//           <div className="absolute bottom-14 right-0 bg-white shadow-lg rounded-lg p-2 w-40 animate-fadeIn">
//             <label className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
//               <Camera className="w-5 h-5" /> Camera
//               <input
//                 type="file"
//                 accept="image/*"
//                 capture="environment" // forces camera on mobile devices
//                 className="hidden"
//                 onChange={(e) => handleFileUpload(e, chatId)}
//               />
//             </label>

//             <label className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
//               <Image className="w-5 h-5" /> Gallery
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 multiple
//                 onChange={(e) => handleFileUpload(e, chatId)}
//               />
//             </label>

//             <label className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
//               <FileText className="w-5 h-5" /> Document
//               <input
//                 type="file"
//                 className="hidden"
//                 multiple
//                 onChange={(e) => handleFileUpload(e, chatId)}
//               />
//             </label>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }
















"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { Camera, Image, FileText } from "lucide-react";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/solid";

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
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // --- NEW: selected files + preview ---
  const [selectedFiles, setSelectedFiles] = useState([]);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const canSend = newMsg.trim().length > 0 || selectedFiles.length > 0;

  const addFiles = (filesArray) => {
    const items = filesArray.map((file) => ({
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      kind: file.type?.startsWith("image/") ? "image" : "file",
      name: file.name,
      type: file.type || "file",
      size: file.size || 0,
    }));
    setSelectedFiles((prev) => [...prev, ...items]);
    setShowAttachmentMenu(false);
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) addFiles(files);
    e.target.value = ""; // allow same file re-pick
  };

  const removeSelectedFile = (id) => {
    setSelectedFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  useEffect(() => {
    return () => {
      // revoke any preview URLs on unmount
      selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Existing effects ---
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
  }, [user?.id]);

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
    }, 3000);
    return () => clearTimeout(timeout);
  }, [newMsg, user?.id]);

  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await fetch("/api/typing-status");
      const data = await res.json();
      setIsTyping(data.typingUsers.includes("admin"));
    }, 3000);
    return () => clearInterval(poll);
  }, []);

  const sendMessage = async () => {
    if (!canSend) return;

    try {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((f) => formData.append("files", f.file));
        formData.append("senderName", user?.fullName || "You");
        formData.append("isAdmin", "false");
        formData.append("chatId", user.id);
        if (newMsg.trim()) formData.append("content", newMsg.trim());

        await fetch("/api/messages", { method: "POST", body: formData });

        // clear previews and text after successful send
        selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        setSelectedFiles([]);
        setNewMsg("");
        setShowAttachmentMenu(false);
        setJustSent(true);
      } else {
        await axios.post("/api/messages", {
          content: newMsg,
          senderName: user?.fullName,
          isAdmin: false,
          chatId: user.id,
        });
        setNewMsg("");
        setJustSent(true);
      }
    } catch (e) {
      console.error("Send error:", e);
    }
  };

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const isNearBottom = () => {
      if (!container) return false;
      return (
        container.scrollHeight - container.scrollTop - container.clientHeight <
        50
      );
    };

    if (justSent || isNearBottom()) {
      scrollToBottom();
    }

    setJustSent(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <div className="text-center text-xs text-gray-500 my-2">
                {label}
              </div>
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

                  {/* Text content (if any) */}
                  {msg.content && (
                    <div className="mt-1 text-gray-800">{msg.content}</div>
                  )}

                  {/* Attachments (if backend returns them) */}
                  {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.attachments.map((att, idx) =>
                        att.mimeType?.startsWith("image/") ? (
                          <img
                            key={idx}
                            src={att.url}
                            alt={att.name || "image"}
                            className="h-24 w-24 object-cover rounded"
                          />
                        ) : (
                          <a
                            key={idx}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-2 py-1 bg-white rounded border text-xs"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="truncate max-w-[8rem]">
                              {att.name || "document"}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="sr-only">spacer</span>
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

        {/* --- PREVIEW BUBBLE: shows inside the message box before sending --- */}
        {selectedFiles.length > 0 && (
          <div className="my-2 p-2 rounded text-sm max-w-[75%] bg-blue-50 ml-auto border border-dashed">
            <div className="text-xs text-gray-500 mb-2">Preview (not sent)</div>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((f) =>
                f.kind === "image" ? (
                  <div key={f.id} className="relative">
                    <img
                      src={f.previewUrl}
                      alt={f.name}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <button
                      onClick={() => removeSelectedFile(f.id)}
                      className="absolute -top-2 -right-2 bg-white border rounded-full w-6 h-6 text-xs"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    key={f.id}
                    className="relative flex items-center gap-2 px-2 py-1 bg-white rounded border"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="truncate max-w-[8rem]">{f.name}</span>
                    <button
                      onClick={() => removeSelectedFile(f.id)}
                      className="ml-1 bg-gray-100 border rounded-full w-5 h-5 text-[10px]"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div ref={ref}></div>
      </div>

      {isTyping && (
        <p className="text-sm text-gray-500 italic mt-1 text-left">
          Admin is typing...
        </p>
      )}

      {/* INPUT + ATTACHMENT MENU */}
      <div className="relative">
        <div className="flex mt-2 gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => {
              setNewMsg(e.target.value);
              if (e.target.value.trim().length > 0 && showAttachmentMenu) {
                setShowAttachmentMenu(false);
              }
            }}
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
            onClick={() => {
              if (canSend) {
                sendMessage();
              } else {
                setShowAttachmentMenu((prev) => !prev);
              }
            }}
            className="bg-orange-600 p-3 rounded-full text-white hover:bg-orange-700 transition-colors"
          >
            {canSend ? (
              <PaperAirplaneIcon className="h-5 w-5" />
            ) : (
              <PaperClipIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {showAttachmentMenu && (
          <div className="absolute bottom-14 right-0 bg-white shadow-lg rounded-lg p-2 w-40 animate-fadeIn z-10">
            <button
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-5 h-5" /> Camera
            </button>
            <button
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
              onClick={() => galleryInputRef.current?.click()}
            >
              <Image className="w-5 h-5" /> Gallery
            </button>
            <button
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
              onClick={() => documentInputRef.current?.click()}
            >
              <FileText className="w-5 h-5" /> Document
            </button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        <input
          ref={documentInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}






// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { format, isToday, isYesterday, parseISO } from "date-fns";
// import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/solid";
// import { Camera, Image, FileText } from "lucide-react";

// export default function ChatBox() {
//   const [adminStatus, setAdminStatus] = useState("online");
//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

//   // Selected files (for preview before sending)
//   const [selectedFiles, setSelectedFiles] = useState([]); // [{ id, file, url, type, name }]
//   const idCounterRef = useRef(0);

//   const scrollContainerRef = useRef(null);
//   const bottomRef = useRef(null);

//   // Hidden inputs for Camera / Gallery / Document
//   const cameraInputRef = useRef(null);
//   const galleryInputRef = useRef(null);
//   const documentInputRef = useRef(null);

//   // Fake "user" name for rendering—replace with your auth user if you have it
//   const user = { fullName: "You" };

//   // Fetch existing messages
//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch("/api/messages");
//       const data = await res.json();
//       setMessages(data || []);
//       scrollToBottom();
//     };
//     load();
//   }, []);

//   // Scroll to bottom whenever messages or previews change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, selectedFiles.length]);

//   const scrollToBottom = () => {
//     requestAnimationFrame(() => {
//       bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
//     });
//   };

//   // Group messages by date
//   const groupedByDate = useMemo(() => {
//     const groups = {};
//     for (const msg of messages) {
//       const d = new Date(msg.createdAt || Date.now());
//       const key = format(d, "yyyy-MM-dd");
//       if (!groups[key]) groups[key] = [];
//       groups[key].push(msg);
//     }
//     return groups;
//   }, [messages]);

//   // Handle file picking
//   const addFiles = (fileList) => {
//     const files = Array.from(fileList || []);
//     if (!files.length) return;

//     const additions = files.map((file) => {
//       const id = `${Date.now()}-${idCounterRef.current++}`;
//       return {
//         id,
//         file,
//         url: URL.createObjectURL(file),
//         type: file.type || "application/octet-stream",
//         name: file.name || "file",
//       };
//     });

//     setSelectedFiles((prev) => [...prev, ...additions]);
//     setShowAttachmentMenu(false); // hide menu after choosing
//   };

//   const handleCameraPick = () => cameraInputRef.current?.click();
//   const handleGalleryPick = () => galleryInputRef.current?.click();
//   const handleDocumentPick = () => documentInputRef.current?.click();

//   const removeSelectedFile = (id) => {
//     setSelectedFiles((prev) => {
//       const toRemove = prev.find((f) => f.id === id);
//       if (toRemove?.url) URL.revokeObjectURL(toRemove.url);
//       return prev.filter((f) => f.id !== id);
//     });
//   };

//   const clearAllSelected = () => {
//     setSelectedFiles((prev) => {
//       prev.forEach((f) => f.url && URL.revokeObjectURL(f.url));
//       return [];
//     });
//   };

//   // Send message (text and/or files)
//   const sendMessage = async () => {
//     const hasText = newMsg.trim().length > 0;
//     const hasFiles = selectedFiles.length > 0;
//     if (!hasText && !hasFiles) return;

//     try {
//       let created;

//       if (hasFiles) {
//         const form = new FormData();
//         form.append("content", newMsg.trim());
//         form.append("isAdmin", "false"); // adjust if needed
//         selectedFiles.forEach((f) => form.append("attachments", f.file));

//         const res = await fetch("/api/messages", {
//           method: "POST",
//           body: form,
//         });
//         created = await res.json();
//       } else {
//         const res = await fetch("/api/messages", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             content: newMsg.trim(),
//             isAdmin: false,
//           }),
//         });
//         created = await res.json();
//       }

//       // Append to UI
//       if (Array.isArray(created)) {
//         // in case API returns an array
//         setMessages((prev) => [...prev, ...created]);
//       } else if (created) {
//         setMessages((prev) => [...prev, created]);
//       }

//       // Reset input & previews
//       setNewMsg("");
//       clearAllSelected();
//       setShowAttachmentMenu(false);
//       scrollToBottom();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const showSendIcon = newMsg.trim().length > 0 || selectedFiles.length > 0;

//   return (
//     <div className="border bg-gray-400 rounded-lg p-4 w-full max-w-md mx-auto">
//       <div className="flex items-center gap-2 mb-4">
//         <span className="font-semibold">Admin Status:</span>
//         <span
//           className={`px-3 py-1 rounded text-sm capitalize border ${
//             adminStatus === "online"
//               ? "bg-green-200 text-green-800"
//               : adminStatus === "away"
//               ? "bg-yellow-200 text-yellow-800"
//               : "bg-gray-300 text-gray-800"
//           }`}
//         >
//           {adminStatus || "offline"}
//         </span>
//       </div>

//       <div
//         ref={scrollContainerRef}
//         className="h-64 mt-3 overflow-y-auto bg-gray-50 p-2 rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
//       >
//         {Object.entries(groupedByDate).map(([dateKey, dateMsgs]) => {
//           const date = parseISO(dateKey + "T00:00:00Z");
//           let label = format(date, "MMMM d, yyyy");
//           if (isToday(date)) label = "Today";
//           else if (isYesterday(date)) label = "Yesterday";

//           return (
//             <div key={dateKey}>
//               <div className="text-center text-xs text-gray-500 my-2">{label}</div>
//               {dateMsgs.map((msg) => {
//                 const mine = msg.senderName === user?.fullName || msg.isAdmin; // adjust as needed
//                 const attachments = msg.attachments || msg.attachmentUrls || [];

//                 return (
//                   <div
//                     key={msg._id || msg.id}
//                     className={`my-2 p-2 rounded text-sm max-w-[75%] ${
//                       mine ? "bg-blue-100 ml-auto" : "bg-gray-200"
//                     }`}
//                   >
//                     <strong>{msg.senderName || (mine ? "You" : "User")}</strong>

//                     {/* Text */}
//                     {msg.content ? (
//                       <div className="mt-1 whitespace-pre-wrap break-words">{msg.content}</div>
//                     ) : null}

//                     {/* Attachments from server */}
//                     {Array.isArray(attachments) && attachments.length > 0 && (
//                       <div className="mt-2 space-y-2">
//                         {attachments.map((att, i) => {
//                           const url = typeof att === "string" ? att : att.url;
//                           const type = typeof att === "string" ? "" : att.type || "";
//                           const name = typeof att === "string" ? "file" : att.name || "file";

//                           const isImage = type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(url || "");
//                           return (
//                             <div key={i} className="rounded overflow-hidden">
//                               {isImage ? (
//                                 <img
//                                   src={url}
//                                   alt={name}
//                                   className="max-h-40 rounded object-contain bg-white"
//                                 />
//                               ) : (
//                                 <a
//                                   href={url}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                   className="flex items-center gap-2 p-2 bg-white rounded"
//                                 >
//                                   <FileText className="w-5 h-5" />
//                                   <span className="truncate">{name}</span>
//                                 </a>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}

//                     <div className="flex justify-end items-center gap-2 mt-1">
//                       {mine && (
//                         <span className="text-xs text-gray-500">
//                           {msg.status === "seen"
//                             ? "✓✓ Seen"
//                             : msg.status === "delivered"
//                             ? "✓✓"
//                             : "✓"}
//                         </span>
//                       )}
//                       <span className="text-[10px] text-gray-400">
//                         {format(new Date(msg.createdAt || Date.now()), "h:mm a")}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })}

//         {/* Preview bubble for NOT-YET-SENT files */}
//         {selectedFiles.length > 0 && (
//           <div className="my-2 p-2 rounded text-sm max-w-[75%] bg-blue-50 ml-auto border border-blue-200">
//             <strong className="text-blue-800">You</strong>
//             <div className="mt-2 grid grid-cols-2 gap-2">
//               {selectedFiles.map((f) => {
//                 const isImage = f.type.startsWith("image/");
//                 return (
//                   <div key={f.id} className="relative rounded overflow-hidden bg-white p-1">
//                     {/* Remove button */}
//                     <button
//                       onClick={() => removeSelectedFile(f.id)}
//                       className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
//                       aria-label="Remove"
//                     >
//                       <XMarkIcon className="w-4 h-4" />
//                     </button>

//                     {isImage ? (
//                       <img src={f.url} alt={f.name} className="max-h-36 w-full object-contain" />
//                     ) : (
//                       <div className="flex items-center gap-2 p-2">
//                         <FileText className="w-5 h-5" />
//                         <span className="text-xs break-all">{f.name}</span>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Optional: clear all */}
//             <div className="flex justify-end mt-2">
//               <button
//                 onClick={clearAllSelected}
//                 className="text-xs text-red-600 hover:underline"
//               >
//                 Remove all
//               </button>
//             </div>
//           </div>
//         )}

//         <div ref={bottomRef} />
//       </div>

//       {isTyping && (
//         <p className="text-sm text-gray-500 italic mt-1 text-left">Admin is typing...</p>
//       )}

//       {/* Composer */}
//       <div className="relative">
//         <div className="flex mt-2 gap-2">
//           <input
//             type="text"
//             value={newMsg}
//             onChange={(e) => {
//               setNewMsg(e.target.value);
//               if (e.target.value.trim().length > 0 && showAttachmentMenu) {
//                 setShowAttachmentMenu(false);
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 sendMessage();
//               }
//             }}
//             className="flex-1 p-2 border rounded"
//             placeholder="Type a message..."
//           />

//           <button
//             onClick={() => {
//               if (showSendIcon) {
//                 sendMessage();
//               } else {
//                 setShowAttachmentMenu((prev) => !prev);
//               }
//             }}
//             className="bg-orange-600 p-3 rounded-full text-white hover:bg-orange-700 transition-colors"
//           >
//             {showSendIcon ? (
//               <PaperAirplaneIcon className="h-5 w-5" />
//             ) : (
//               <PaperClipIcon className="h-5 w-5" />
//             )}
//           </button>
//         </div>

//         {showAttachmentMenu && (
//           <div className="absolute bottom-14 right-0 bg-white shadow-lg rounded-lg p-2 w-44 animate-fadeIn">
//             <button
//               className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
//               onClick={handleCameraPick}
//               type="button"
//             >
//               <Camera className="w-5 h-5" /> Camera
//             </button>
//             <button
//               className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
//               onClick={handleGalleryPick}
//               type="button"
//             >
//               <Image className="w-5 h-5" /> Gallery
//             </button>
//             <button
//               className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
//               onClick={handleDocumentPick}
//               type="button"
//             >
//               <FileText className="w-5 h-5" /> Document
//             </button>
//           </div>
//         )}

//         {/* Hidden inputs */}
//         <input
//           ref={cameraInputRef}
//           type="file"
//           accept="image/*"
//           capture="environment"
//           className="hidden"
//           onChange={(e) => addFiles(e.target.files)}
//         />
//         <input
//           ref={galleryInputRef}
//           type="file"
//           accept="image/*"
//           multiple
//           className="hidden"
//           onChange={(e) => addFiles(e.target.files)}
//         />
//         <input
//           ref={documentInputRef}
//           type="file"
//           multiple
//           className="hidden"
//           onChange={(e) => addFiles(e.target.files)}
//         />
//       </div>
//     </div>
//   );
// }
