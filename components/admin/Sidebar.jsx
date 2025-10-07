"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Settings,
  Home,
  Menu,
  Monitor,
  Inbox,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import PasswordConfirmPopup from "./PasswordConfirmPopup";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Users", path: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { name: "Transactions", path: "/admin/payments", icon: <CreditCard className="w-5 h-5" /> },
  { name: "Contacts & Feedbacks", path: "/admin/messages", icon: <Inbox className="w-5 h-5" /> },
  { name: "Activity Logs", path: "/admin/activity-logs", icon: <FileText className="w-5 h-5" /> },
  { name: "Settings", path: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const confirmLogout = (enteredPassword) => {
    if (enteredPassword === process.env.NEXT_PUBLIC_LOGOUT_PASSWORD) {
      signOut({ callbackUrl: "/" });
      toast.success("You've been signed out");
    } else {
      toast.error("Incorrect password");
    }
    setShowPopup(false);
  };

  const SidebarContent = (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-md">
            <Monitor className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Admin Panel</h2>
        </div>
        <p className="text-xs text-gray-500 ml-1 mt-1">System Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <li key={item.name}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                      active
                        ? "bg-orange-50 text-orange-700 border-l-4 border-orange-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Section */}
      <div className="px-4 py-4 border-t space-y-3">
        {session?.user ? (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center font-semibold text-gray-700">
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-800">{session.user.name}</p>
              <p className="text-xs text-gray-500">Signed in</p>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 w-full px-4 py-2 rounded-md border border-gray-200 transition"
          >
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Sign In</span>
          </Link>
        )}

        <Link
          href="/"
          className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md transition"
        >
          <Home className="w-5 h-5 text-gray-500" />
          <span>Home</span>
        </Link>

        {session?.user && (
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}

        {showPopup && (
          <PasswordConfirmPopup
            onClose={() => setShowPopup(false)}
            onConfirm={confirmLogout}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block fixed top-0 left-0 h-screen z-30">
        {SidebarContent}
      </aside>

      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white border rounded-full shadow"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="bg-white w-64 h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
