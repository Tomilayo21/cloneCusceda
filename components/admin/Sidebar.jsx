"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, Settings, Package, Users, Database, LogOut } from "lucide-react";
import { UsersIcon, ChartPieIcon } from "@heroicons/react/24/outline";
import { RiMoneyDollarCircleLine, RiFeedbackLine } from "react-icons/ri";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import PasswordConfirmPopup from "./PasswordConfirmPopup";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Users Management", path: "/admin/users", icon: <UsersIcon className="w-5 h-5" /> },
  { name: "Products", path: "/admin/products", icon: <Package className="w-5 h-5" /> },
  { name: "Payments & Orders", path: "/admin/payments", icon: <RiMoneyDollarCircleLine className="w-5 h-5" /> },
  { name: "Messages & Feedback", path: "/admin/messages", icon: <RiFeedbackLine className="w-5 h-5" /> },
  { name: "Analytics", path: "/admin/analytics", icon: <ChartPieIcon className="w-5 h-5" /> },
  { name: "Notifications", path: "/admin/notifications", icon: <Bell className="w-5 h-5" />, badge: true },
  { name: "System Backup", path: "/admin/backup", icon: <Database className="w-5 h-5" /> },
  { name: "Settings", path: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Refs to track if user has read the current notifications/messages
  const readNotificationsRef = useRef(false);
  const readMessagesRef = useRef(false);

  // Helper to fetch and update state only if value changes
  const fetchUnreadNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.success) {
        const unread = data.data.filter(n => !n.isRead).length;

        // Only update state if count changes
        if (unread !== unreadNotifications) {
          setUnreadNotifications(unread);

          // If new notifications, reset read flag
          if (unread > unreadNotifications) readNotificationsRef.current = false;
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const res = await fetch("/api/contact/messages?view=unread");
      const data = await res.json();
      const unreadCount = Array.isArray(data) ? data.length : 0;

      // Only update state if count changes
      if (unreadCount !== unreadMessages) {
        setUnreadMessages(unreadCount);

        // If new messages, reset read flag
        if (unreadCount > unreadMessages) readMessagesRef.current = false;
      }
    } catch (err) {
      console.error("Failed to fetch unread messages", err);
    }
  };

  // Polling with 30s interval
  useEffect(() => {
    fetchUnreadNotifications();
    const interval1 = setInterval(fetchUnreadNotifications, 30000);

    fetchUnreadMessages();
    const interval2 = setInterval(fetchUnreadMessages, 30000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [unreadNotifications, unreadMessages]); // depends on counts

  const confirmLogout = (password) => {
    if (password === process.env.NEXT_PUBLIC_LOGOUT_PASSWORD) {
      signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } else {
      toast.error("Incorrect password");
    }
    setShowPopup(false);
  };

  const handleMenuClick = (itemName) => {
    if (itemName === "Notifications") readNotificationsRef.current = true;
    if (itemName === "Messages & Feedback") readMessagesRef.current = true;
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Admin Panel</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">System Management</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item, idx) => {
              const active = pathname === item.path;
              return (
                <li key={idx}>
                  <Link href={item.path} onClick={() => handleMenuClick(item.name)}>
                    <div
                      className={`flex items-center gap-3 px-5 py-3 text-sm rounded-md transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-orange-100 dark:bg-orange-900 text-orange-600 border-l-4 border-orange-600"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="relative">
                        {item.icon}

                        {/* Notification badge */}
                        {item.badge && unreadNotifications > 0 && !readNotificationsRef.current && pathname !== "/admin/notifications" && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                        )}

                        {/* Messages badge */}
                        {item.name === "Messages & Feedback" && unreadMessages > 0 && !readMessagesRef.current && pathname !== "/admin/messages" && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                        )}
                      </div>

                      {item.name}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / User Section */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 w-8 h-8 flex items-center justify-center font-semibold text-gray-700 dark:text-gray-200">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800 dark:text-gray-100">{session.user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 transition"
            >
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium">Sign In</span>
            </Link>
          )}

          {session?.user && (
            <button
              onClick={() => setShowPopup(true)}
              className="flex items-center gap-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 px-4 py-2 rounded-md transition w-full"
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
      </aside>

      {/* Mobile sidebar & button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-900 p-2 rounded shadow border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="bg-white dark:bg-black w-64 h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Admin Menu
            </h2>
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const active = pathname === item.path;
                return (
                  <li key={index}>
                    <Link href={item.path} onClick={() => handleMenuClick(item.name)}>
                      <div
                        className={`flex items-center gap-3 px-5 py-3 text-sm rounded-md transition-all duration-200 ${
                          active
                            ? "bg-orange-100 dark:bg-orange-900 text-orange-600 border-l-4 border-orange-600"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
