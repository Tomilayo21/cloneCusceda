"use client";

import Link from "next/link";
import { Search, FileDown, Shield, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';



interface ClerkUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: { email_address: string; id: string }[];
  profile_image_url: string;
  public_metadata?: { role?: "admin" | "user" };
  created_at: number;
  updated_at: number;
  last_sign_in_at: number | null;
  external_accounts: { provider: string }[];
  username: string | null;
}

export default function UserList() {
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  
  dayjs.extend(relativeTime);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);


  const logActivity = async (action: string, detail: string) => {
    await fetch("/api/activity-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, detail }),
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/clerk-users");
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateRole = async (userId: string, selectedRole: "admin" | "user") => {
    try {
      const res = await fetch(`/api/clerk-users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      toast.success(`Role changed to ${selectedRole.toUpperCase()}`);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, public_metadata: { role: selectedRole } } : user
        )
      );
      await logActivity("Role Change", `Changed role of user ${userId} to ${selectedRole}`);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/clerk-users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User deleted");
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      await logActivity("User Deletion", `Deleted user ${userId}`);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };


  const exportToCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Username",
      "Signup Method",
    ];

    const rows = users.map((user) => [
      user.first_name ?? "N/A",
      user.last_name ?? "N/A",
      user.email_addresses[0]?.email_address ?? "N/A",
      user.username ?? "N/A",
      user.external_accounts?.[0]?.provider === "oauth_google" ? "Google" : "Email",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "users.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exported to CSV");
    logActivity("Export", "Exported user data to CSV");
  };

  const filteredUsers = users.filter((user) => {
    const name = user.first_name?.toLowerCase() ?? "";
    const email = user.email_addresses?.[0]?.email_address?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });


  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const roleA = a.public_metadata?.role ?? "user";
    const roleB = b.public_metadata?.role ?? "user";
    return roleA === "admin" && roleB !== "admin" ? -1 : roleA !== "admin" && roleB === "admin" ? 1 : 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );


  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) return <p className="p-4">Loading users...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    // <div className="p-2 max-w-4xl flex-1  flex flex-col mx-4 mt-4">
    //   <h2 className="text-xl md:text-2xl font-bold mb-4">Users</h2>

    //   {/* Search + Export */}
    //   <div className="mb-4 flex flex-col md:flex-row justify-between gap-2">
    //     <input
    //       type="text"
    //       placeholder="Search by name, email..."
    //       className="px-4 py-2 border rounded w-full md:w-1/3"
    //       value={searchTerm}
    //       onChange={(e) => {
    //         setSearchTerm(e.target.value);
    //         setCurrentPage(1);
    //       }}
    //     />
    //     <button
    //       onClick={exportToCSV}
    //       className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-black transition"
    //     >
    //       Export to CSV
    //     </button>
    //   </div>

    //   {/* === Table View === */}
    //   <div className="hidden md:block overflow-x-auto rounded border">
    //     {/* Admins Section */}
    //     {/* <h3 className="text-lg font-semibold bg-gray-100 px-4 py-2">Admins</h3> */}
    //     <table className="min-w-full table-auto text-sm">
    //       <thead className="bg-gray-100 text-xs md:text-sm">
    //         <tr>
    //           <th className="px-2 py-2 border">Photo</th>
    //           <th className="px-2 py-2 border">First Name</th>
    //           <th className="px-2 py-2 border">Email</th>
    //           <th className="px-2 py-2 border">Signed Up With</th>
    //           <th className="px-2 py-2 border">Username</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {paginatedUsers
    //           .filter((user) => (user.public_metadata?.role ?? "user"))
    //           .map((user) => {
    //             const role = user.public_metadata?.role ?? "user";
    //             const signupMethod =
    //               user.external_accounts?.[0]?.provider === "oauth_google" ? "Google" : "Email";
    //             return (
    //               <tr key={user.id} className="border-t hover:bg-gray-50">
    //                 <td className="px-2 py-2 border">
    //                   <img src={user.profile_image_url} alt="profile" className="w-10 h-10 rounded-full object-cover" />
    //                 </td>
    //                 <td className="px-2 py-2 border font-medium">{user.first_name ?? "N/A"}</td>
    //                 <td className="px-2 py-2 border text-xs">{user.email_addresses[0]?.email_address}</td>
    //                 <td className="px-2 py-2 border">{signupMethod}</td>
    //                 <td className="px-2 py-2 border text-xs">{user.username ?? "N/A"}</td>
    //               </tr>
    //             );
    //           })}
    //       </tbody>
    //     </table>

    //   </div>

    //   {/* === Mobile Cards === */}
    //   <div className="md:hidden space-y-4">
    //     {/* <h3 className="text-lg font-semibold mt-6">Admins</h3> */}
    //     {paginatedUsers
    //       .filter((user) => (user.public_metadata?.role ?? "user"))
    //       .map((user) => {
    //         const role = user.public_metadata?.role ?? "user";
    //         const signupMethod =
    //           user.external_accounts?.[0]?.provider === "oauth_google" ? "Google" : "Email";
    //         return (
    //           <div key={user.id} className="border rounded p-4 shadow-sm">
    //             <div className="flex items-center gap-3 mb-3">
    //               <img src={user.profile_image_url} alt="profile" className="w-10 h-10 rounded-full object-cover" />
    //               <div>
    //                 <p className="font-semibold">{user.first_name ?? "N/A"}</p>
    //                 <p className="text-xs text-gray-600">{user.email_addresses[0]?.email_address}</p>
    //               </div>
    //             </div>
    //             <p className="text-xs"><span className="font-medium">Username:</span> {user.username ?? "N/A"}</p>
    //             <p className="text-xs"><span className="font-medium">Signed Up With:</span> {signupMethod}</p>
    //           </div>
    //         );
    //       })}
    //   </div>

    //   {/* === Pagination and Footer === */}
    //   <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 mb-8">
    //     <div className="flex items-center gap-2 flex-wrap">
    //       <button
    //         onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    //         disabled={currentPage === 1}
    //         className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    //       >
    //         Prev
    //       </button>

    //       {(() => {
    //         const range = [];
    //         const start = Math.max(1, currentPage - 2);
    //         const end = Math.min(totalPages, currentPage + 2);

    //         if (start > 1) {
    //           range.push(1);
    //           if (start > 2) range.push("ellipsis-start");
    //         }

    //         for (let i = start; i <= end; i++) {
    //           range.push(i);
    //         }

    //         if (end < totalPages) {
    //           if (end < totalPages - 1) range.push("ellipsis-end");
    //           range.push(totalPages);
    //         }

    //         return range.map((item, index) =>
    //           typeof item === "string" ? (
    //             <span key={index} className="text-sm px-1">...</span>
    //           ) : (
    //             <button
    //               key={item}
    //               onClick={() => setCurrentPage(item)}
    //               className={`px-3 py-1 rounded text-sm ${
    //                 currentPage === item ? "bg-black text-white" : "bg-gray-200"
    //               }`}
    //             >
    //               {item}
    //             </button>
    //           )
    //         );
    //       })()}

    //       <button
    //         onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
    //         disabled={currentPage === totalPages}
    //         className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    //       >
    //         Next
    //       </button>
    //     </div>

    //     <Link href="/activity-log" className="text-orange hover:underline text-sm">
    //       View Activity Log
    //     </Link>
    //   </div>

    // </div>


<div className="p-4 md:p-6 max-w-6xl flex-1 flex flex-col mx-auto">
  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Users</h2>

  {/* Search + Export */}
  <div className="mb-6 flex flex-col md:flex-row justify-between gap-3">
    <div className="relative w-full md:w-1/3">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search by name, email..."
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>

    <button
      onClick={exportToCSV}
      className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-sm"
    >
      <FileDown className="w-4 h-4" />
      Export CSV
    </button>
  </div>

  {/* === Table View (Desktop) === */}
  <div className="hidden md:block overflow-x-auto bg-white rounded-xl border shadow-sm">
    <table className="min-w-full table-auto text-sm text-gray-700">
      <thead className="bg-gray-50 text-xs uppercase text-gray-600">
        <tr>
          <th className="px-4 py-3 text-left font-medium">Photo</th>
          <th className="px-4 py-3 text-left font-medium">First Name</th>
          <th className="px-4 py-3 text-left font-medium">Email</th>
          <th className="px-4 py-3 text-left font-medium">Signed Up With</th>
          <th className="px-4 py-3 text-left font-medium">Username</th>
        </tr>
      </thead>
      <tbody>
        {paginatedUsers.map((user) => {
          const signupMethod =
            user.external_accounts?.[0]?.provider === "oauth_google"
              ? "Google"
              : "Email";
          return (
            <tr
              key={user.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3">
                <img
                  src={user.profile_image_url}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="px-4 py-3 font-medium">{user.first_name ?? "N/A"}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{user.email_addresses[0]?.email_address}</td>
              <td className="px-4 py-3">{signupMethod}</td>
              <td className="px-4 py-3 text-xs">{user.username ?? "N/A"}</td>
              {/* <td className="px-4 py-3 flex items-center gap-2">
                <span>{user.name}</span>
                {user.role === "admin" ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                    <Shield size={14} />
                    Admin
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    <UserIcon size={14} />
                    User
                  </span>
                )}
              </td> */}

            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  {/* === Mobile Cards === */}
  <div className="md:hidden space-y-4">
    {paginatedUsers.map((user) => {
      const signupMethod =
        user.external_accounts?.[0]?.provider === "oauth_google"
          ? "Google"
          : "Email";
      return (
        <div
          key={user.id}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user.profile_image_url}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {user.first_name ?? "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                {user.email_addresses[0]?.email_address}
              </p>
            </div>
          </div>
          <p className="text-xs">
            <span className="font-medium text-gray-700">Username:</span>{" "}
            {user.username ?? "N/A"}
          </p>
          <p className="text-xs">
            <span className="font-medium text-gray-700">Signed Up With:</span>{" "}
            {signupMethod}
          </p>
        </div>
      );
    })}
  </div>

  {/* === Pagination and Footer === */}
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
    {/* Pagination */}
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>

      {(() => {
        const range = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        if (start > 1) {
          range.push(1);
          if (start > 2) range.push("ellipsis-start");
        }

        for (let i = start; i <= end; i++) range.push(i);

        if (end < totalPages) {
          if (end < totalPages - 1) range.push("ellipsis-end");
          range.push(totalPages);
        }

        return range.map((item, index) =>
          typeof item === "string" ? (
            <span key={index} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={item}
              onClick={() => setCurrentPage(item)}
              className={`px-3 py-1.5 rounded-md text-sm transition ${
                currentPage === item
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          )
        );
      })()}

      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    {/* Activity Log */}
    <Link
      href="/activity-log"
      className="text-orange-600 hover:underline text-sm font-medium"
    >
      View Activity Log
    </Link>
  </div>
</div>

);

}
