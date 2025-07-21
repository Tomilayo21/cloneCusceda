// "use client";

// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function FormatDatabaseModal({ onSuccess }) {
//   const [open, setOpen] = useState(false);
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFormat = async () => {
//     if (!password) return toast.error("Password is required");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/admin/format-database", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ password }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success(data.message);
//         setOpen(false);
//         setPassword("");
//         onSuccess?.();
//       } else {
//         toast.error(data.error || "Failed to format database.");
//       }
//     } catch (err) {
//       toast.error("Unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => {
//           const confirmDelete = confirm("Are you sure? This will delete EVERYTHING.");
//           if (confirmDelete) setOpen(true);
//         }}
//         className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//       >
//         Format Database
//       </button>

//       {open && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
//             <h2 className="text-lg font-semibold">Enter Admin Password</h2>
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setOpen(false)}
//                 className="px-4 py-2 border rounded text-gray-700"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleFormat}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                 disabled={loading}
//               >
//                 {loading ? "Wiping..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }













'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function FormatDatabaseButton() {
  const { user, isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkAdminRole = async () => {
      const res = await fetch("/api/current-user");
      const data = await res.json();
      setIsAdmin(data?.role === "admin");
    };
    if (isSignedIn) checkAdminRole();
  }, [isSignedIn]);

  const handleFormat = async () => {
    const res = await fetch("/api/admin/format-database", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      toast.success("Database wiped. Non-admin users logged out.");
      setShowModal(false);
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed");
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={() => setShowModal(true)}
      >
        Format Database
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Enter Password to Confirm</h2>
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
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleFormat}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
