// // pages/admin/notifications.jsx
// 'use client'
// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// let socket;

// export default function AdminNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function fetchNotifications() {
//     setLoading(true);
//     const res = await fetch("/api/admin/notifications");
//     const data = await res.json();
//     if (data.success) setNotifications(data.data);
//     setLoading(false);
//   }

//   useEffect(() => {
//     fetchNotifications();

//     // Connect socket.io client
//     socket = io();

//     socket.on("connect", () => {
//       console.log("Connected to Socket.IO server");
//     });

//     // Listen for new notifications
//     socket.on("new-notification", (notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   async function markAsRead(id) {
//     await fetch(`/api/admin/notifications/${id}/read`, {
//       method: "PATCH",
//     });
//     // Refresh notifications list or update state directly
//     setNotifications((prev) =>
//       prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//     );
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
//       <h1>Admin Notifications</h1>
//       {loading ? (
//         <p>Loading notifications...</p>
//       ) : notifications.length === 0 ? (
//         <p>No notifications</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {notifications.map((notif) => (
//             <li
//               key={notif._id}
//               style={{
//                 backgroundColor: notif.isRead ? "#f0f0f0" : "#d4eaff",
//                 padding: 10,
//                 marginBottom: 8,
//                 borderRadius: 5,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div>
//                 <strong>{notif.type.toUpperCase()}</strong> — {notif.message}
//                 <br />
//                 <small>{new Date(notif.createdAt).toLocaleString()}</small>
//               </div>
//               {!notif.isRead && (
//                 <button onClick={() => markAsRead(notif._id)}>Mark as read</button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

















































































// "use client";
// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// let socket = io({
//   path: "/api/socket", // Match exactly what the server used
// });

// export default function AdminNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function fetchNotifications() {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/admin/notifications");
//       const data = await res.json();
//       if (data.success) setNotifications(data.data);
//     } catch (error) {
//       console.error("Failed to fetch notifications", error);
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     fetchNotifications();
//     socket = io();

//     socket.on("connect", () => {
//       console.log("Connected to socket server");
//     });

//     socket.on("new-notification", (notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   async function markAsRead(id) {
//     await fetch(`/api/admin/notifications/${id}/read`, {
//       method: "PATCH",
//     });

//     setNotifications((prev) =>
//       prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//     );
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
//       <h1>Admin Notifications</h1>
//       {loading ? (
//         <p>Loading notifications...</p>
//       ) : notifications.length === 0 ? (
//         <p>No notifications</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {notifications.map((notif) => (
//             <li
//               key={notif._id}
//               style={{
//                 backgroundColor: notif.isRead ? "#f0f0f0" : "#d4eaff",
//                 padding: 10,
//                 marginBottom: 8,
//                 borderRadius: 5,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div>
//                 <strong>{notif.type.toUpperCase()}</strong> — {notif.message}
//                 <br />
//                 <small>{new Date(notif.createdAt).toLocaleString()}</small>
//               </div>
//               {!notif.isRead && (
//                 <button onClick={() => markAsRead(notif._id)}>
//                   Mark as read
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }































































'use client';

import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

const POLL_INTERVAL = 30000; // 30 seconds

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastNotificationIds = useRef(new Set());

  async function fetchNotifications(showToast = false) {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();

      if (data.success) {
        const currentIds = new Set(data.data.map(n => n._id));
        const newIds = [...currentIds].filter(id => !lastNotificationIds.current.has(id));

        if (showToast && newIds.length > 0) {
          toast.success(`You have ${newIds.length} new notification(s)!`);
        }

        lastNotificationIds.current = currentIds;
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  async function markAsRead(id) {
    try {
      await fetch(`/api/admin/notifications?id=${id}`, {
        method: "PATCH",
      });

      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Admin Notifications</h1>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((notif) => (
            <li
              key={notif._id}
              style={{
                backgroundColor: notif.isRead ? "#f0f0f0" : "#d4eaff",
                padding: 10,
                marginBottom: 8,
                borderRadius: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{notif.type.toUpperCase()}</strong> — {notif.message}
                <br />
                <small>{new Date(notif.createdAt).toLocaleString()}</small>
              </div>
              {!notif.isRead && (
                <button onClick={() => markAsRead(notif._id)}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
