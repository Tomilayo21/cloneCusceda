
// 'use client';

// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";

// export default function FormatDatabaseButton() {
//   const { user, isSignedIn } = useUser();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [password, setPassword] = useState("");


//   useEffect(() => {
//     const checkAdminRole = async () => {
//       try {
//         const res = await fetch("/api/admin/current-user" , {
//         method: "GET",
//         credentials: "include", // ✅ IMPORTANT
//         });

//         const data = await res.json();
//         if (res.ok) {
//           setIsAdmin(data.role === "admin");
//         }
//       } catch (err) {
//         console.error("Error checking admin role", err);
//       }
//     };

//     if (isSignedIn) checkAdminRole();
//   }, [isSignedIn]);

//   const handleFormat = async () => {
//     const res = await fetch("/api/admin/format-database", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ password }),
//     });

//     if (res.ok) {
//       toast.success("Database wiped. Non-admin users logged out.");
//       setShowModal(false);
//     } else {
//       const err = await res.json();
//       toast.error(err.error || "Failed");
//     }
//   };

//   // if (!isAdmin) return null;

//   return (
//     <>
//       <button
//         className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//         onClick={() => setShowModal(true)}
//       >
//         Format Database
//       </button>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow w-full max-w-sm">
//             <h2 className="text-lg font-semibold mb-4">Enter Password to Confirm</h2>
//             <input
//               type="password"
//               placeholder="Enter Admin Password"
//               className="w-full border p-2 mb-4 rounded"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//                 onClick={handleFormat}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }










































"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function FormatDatabaseButton() {
  const { isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const res = await fetch("/api/admin/current-user", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setIsAdmin(data.role === "admin");
        }
      } catch (err) {
        console.error("Error checking admin role", err);
      }
    };
    if (isSignedIn) checkAdminRole();
  }, [isSignedIn]);

  // Step 1: Check password validity only
  const verifyPassword = async () => {
    const res = await fetch("/api/admin/format-database/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setShowPasswordModal(false);
      setShowConfirmModal(true);
    } else {
      const err = await res.json();
      toast.error(err.error || "Invalid password");
    }
  };

  // Step 2: Actually wipe DB
  const handleFormat = async () => {
    const res = await fetch("/api/admin/format-database", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include", // ✅ sends Clerk cookies so auth() works
    });


    if (res.ok) {
      toast.success("Database wiped. Non-admin users logged out.");
      setShowConfirmModal(false);
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed");
    }
  };

  // if (!isAdmin) return null;

  return (
    <>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={() => setShowPasswordModal(true)}
      >
        Format Database
      </button>

      {/* STEP 1: Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Enter Password to Continue</h2>
            <input
              type="password"
              placeholder="Enter Admin Password"
              className="w-full border p-2 mb-4 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded"
                onClick={verifyPassword}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Final Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-lg font-semibold text-red-600">
              Are you sure you want to delete? This is irreversible!
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              This action will completely wipe the database and log out all non-admin users.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleFormat}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}





























// Yess add it. There are other models such as  : About.js, ActivityLog.js, Address.js, Broadcast, contact, faq, GeneralSettings, Message, Notification, Order, Otp, Partner, Privacy, ReturnPolicy, Review, Settings.ts, Subscriber, Team, Tearms, Transaction, User, UserSettings.js. and this is the component.(
// 'use client';

// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";

// export default function FormatDatabaseButton() {
//   const { user, isSignedIn } = useUser();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [password, setPassword] = useState("");


//   useEffect(() => {
//     const checkAdminRole = async () => {
//       try {
//         const res = await fetch("/api/admin/current-user" , {
//         method: "GET",
//         credentials: "include", // ✅ IMPORTANT
//         });

//         const data = await res.json();
//         if (res.ok) {
//           setIsAdmin(data.role === "admin");
//         }
//       } catch (err) {
//         console.error("Error checking admin role", err);
//       }
//     };

//     if (isSignedIn) checkAdminRole();
//   }, [isSignedIn]);

//   const handleFormat = async () => {
//     const res = await fetch("/api/admin/format-database", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ password }),
//     });

//     if (res.ok) {
//       toast.success("Database wiped. Non-admin users logged out.");
//       setShowModal(false);
//     } else {
//       const err = await res.json();
//       toast.error(err.error || "Failed");
//     }
//   };

//   // if (!isAdmin) return null;

//   return (
//     <>
//       <button
//         className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//         onClick={() => setShowModal(true)}
//       >
//         Format Database
//       </button>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow w-full max-w-sm">
//             <h2 className="text-lg font-semibold mb-4">Enter Password to Confirm</h2>
//             <input
//               type="password"
//               placeholder="Enter Admin Password"
//               className="w-full border p-2 mb-4 rounded"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//                 onClick={handleFormat}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
// )