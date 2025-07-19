"use client";
import React, {useState} from 'react'
import {
  Cog,
  ShieldCheck,
  Palette,
  Globe,
  Users,
  Bell,
  CreditCard,
  Box,
  FileText,
  CloudDownload,
  ArrowLeft,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AddProductPanel from "@/components/admin/settings/products/AddProductPanel";
import ProductListPanel from "@/components/admin/settings/products/ProductListPanel";
import ReviewPanel from "@/components/admin/settings/products/ReviewPanel";
import UserListPanel from "@/components/admin/settings/users/UserListPanel";
import SubscribersPage from "@/components/admin/settings/users/SubscribersPage";
import ViewBroadcastButton from "@/components/admin/settings/users/ViewBroadcastButton";
import OrderPanel from "@/components/admin/settings/orders/OrderPanel";
import TransactionPanel from "@/components/admin/settings/orders/TransactionPanel";

const settingsTabs = [
  { key: "general", label: "General", icon: <Cog className="w-4 h-4" /> },
  { key: "product", label: "Product", icon: <Box className="w-4 h-4" /> },
  { key: "users", label: "User & Subscribers", icon: <Users className="w-4 h-4" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { key: "orders", label: "Orders & Payments", icon: <CreditCard className="w-4 h-4" /> },
  { key: "localization", label: "Localization", icon: <Globe className="w-4 h-4" /> },
  { key: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
  { key: "security", label: "Security", icon: <ShieldCheck className="w-4 h-4" /> },
  { key: "legal", label: "Legal / Policy", icon: <FileText className="w-4 h-4" /> },
  { key: "backup", label: "Backup / Export", icon: <CloudDownload className="w-4 h-4" /> },
];

export default function AdminSettings({
  activeTab,
  setActiveTab,
  userPanel,
  setUserPanel,
  orderPanel,
  setOrderPanel,
  setActiveView,
}) {
  const [productPanel, setProductPanel] = useState(null);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
    <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <button
            onClick={() => setActiveView("dashboard")}
            className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded text-sm"
            >
            ← Back to Dashboard
        </button>

    </div>


      {/* Tab Header */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {settingsTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-orange-100 text-orange-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <div className="bg-white p-6 rounded shadow border">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">General Settings</h3>
            <input placeholder="Site Title" className="w-full p-2 border rounded" />
            <input placeholder="Support Email" className="w-full p-2 border rounded" />
          </div>
        )}

        {/* Product Tab */}
        {activeTab === "product" && (
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!productPanel && (
                <motion.div
                  key="product-main"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-lg">Product Settings</h3>
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => setProductPanel("add")} className="bg-orange-500 text-white px-4 py-2 rounded">
                      Add Product
                    </button>
                    <button onClick={() => setProductPanel("list")} className="bg-blue-500 text-white px-4 py-2 rounded">
                      Product List
                    </button>
                    <button onClick={() => setProductPanel("reviews")} className="bg-purple-500 text-white px-4 py-2 rounded">
                      Reviews
                    </button>
                  </div>
                </motion.div>
              )}
              {productPanel && (
                <motion.div
                  key="product-sub"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <button onClick={() => setProductPanel(null)} className="flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  {productPanel === "add" && <AddProductPanel />}
                  {productPanel === "list" && <ProductListPanel />}
                  {productPanel === "reviews" && <ReviewPanel />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* User Tab */}
        {activeTab === "users" && (
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {userPanel === "main" && (
                <motion.div
                  key="user-main"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-lg">Users & Subscribers</h3>
                  <p className="text-sm text-gray-600">
                    Role assignments, user lists, and subscriber communication tools.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setUserPanel("list")} className="bg-blue-600 text-white px-4 py-2 rounded">
                      View Users
                    </button>
                    <button onClick={() => setUserPanel("subscribers")} className="bg-green-600 text-white px-4 py-2 rounded">
                      Subscribers
                    </button>
                    <button onClick={() => setUserPanel("roles")} className="bg-purple-600 text-white px-4 py-2 rounded">
                      Roles & Permissions
                    </button>
                  </div>
                </motion.div>
              )}
              {userPanel === "list" && (
                <motion.div
                  key="user-list"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <button onClick={() => setUserPanel("main")} className="flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <UserListPanel />
                </motion.div>
              )}
              {userPanel === "subscribers" && (
                <motion.div
                  key="user-subscribers"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <button onClick={() => setUserPanel("main")} className="flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <button onClick={() => setUserPanel("broadcast")} className="bg-orange-600 text-white px-4 py-2 rounded">
                    View Broadcast History
                  </button>
                  <SubscribersPage />
                </motion.div>
              )}
              {userPanel === "broadcast" && (
                <motion.div
                  key="user-broadcast"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <button onClick={() => setUserPanel("subscribers")} className="flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <ViewBroadcastButton />
                </motion.div>
              )}
              {userPanel === "roles" && (
                <motion.div
                  key="user-subscribers"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <button onClick={() => setUserPanel("main")} className="flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <UserListPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!orderPanel && (
                <motion.div
                  key="orders-main"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-lg">Orders & Payments</h3>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-600" /> Enable Bank Transfer
                  </label>
                  <input
                    placeholder="Order auto-cancel after (minutes)"
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => setOrderPanel("orders")} className="bg-orange-500 text-white px-4 py-2 rounded">
                      View Orders
                    </button>
                    <button onClick={() => setOrderPanel("transactions")} className="bg-blue-500 text-white px-4 py-2 rounded">
                      View Transactions
                    </button>
                  </div>
                </motion.div>
              )}
              {orderPanel && (
                <motion.div
                  key="orders-sub"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <button onClick={() => setOrderPanel(null)} className="flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  {orderPanel === "orders" && <OrderPanel />}
                  {orderPanel === "transactions" && <TransactionPanel />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Remaining simple tabs */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-orange-600" defaultChecked /> Email on New Order
            </label>
          </div>
        )}
        {activeTab === "localization" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Localization</h3>
            <select className="w-full border p-2 rounded">
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
        )}
        {activeTab === "appearance" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Appearance / Theme</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-orange-600" /> Use Dark Mode by Default
            </label>
          </div>
        )}
        {activeTab === "security" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Security Settings</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-orange-600" /> Enable 2FA for Admins
            </label>
          </div>
        )}
        {activeTab === "legal" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Legal & Policy</h3>
            <textarea placeholder="Privacy Policy..." className="w-full border p-2 rounded" rows={4}></textarea>
          </div>
        )}
        {activeTab === "backup" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Backup & Export</h3>
            <button className="bg-orange-600 text-white px-4 py-2 rounded">Export Orders CSV</button>
          </div>
        )}
      </div>
    </div>
  );
}
