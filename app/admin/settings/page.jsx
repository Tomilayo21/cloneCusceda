// 'use client';

// import React, { useState } from 'react';
// import { Tabs } from '@/components/ui/tabs'; // optional: use a tabs component or custom logic
// import {
//   Cog,
//   Palette,
//   Bell,
//   CreditCard,
//   Globe,
// } from 'lucide-react';

// import { AnimatePresence, motion } from 'framer-motion';
// import { ArrowLeft } from 'lucide-react';
// import AddProductPanel from '@/components/admin/settings/products/AddProductPanel';
// import ProductListPanel from '@/components/admin/settings/products/ProductListPanel';
// import ReviewPanel from '@/components/admin/settings/products/ReviewPanel';


// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState('general');

//   const tabs = [
//     { key: 'general', label: 'General', icon: <Cog className="w-4 h-4" /> },
//     { key: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
//     { key: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
//     { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
//     { key: 'localization', label: 'Localization', icon: <Globe className="w-4 h-4" /> },
//   ];

//   return (
//     <div className="max-w-5xl mx-auto p-4 space-y-6">
//       <h2 className="text-2xl font-semibold">Settings</h2>

//       {/* Tab Header */}
//       <div className="flex gap-2 overflow-x-auto border-b pb-2">
//         {tabs.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`flex items-center gap-2 px-4 py-2 rounded ${
//               activeTab === tab.key
//                 ? 'bg-orange-100 text-orange-600 font-medium'
//                 : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             {tab.icon}
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="bg-white rounded-lg p-6 shadow-sm border">
//         {activeTab === 'general' && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">General Settings</h3>
//             {/* Add input fields here */}
//             <div>
//               <label className="block mb-1 text-sm font-medium">Site Title</label>
//               <input type="text" className="w-full border rounded px-3 py-2" placeholder="Cusceda" />
//             </div>
//             <div>
//               <label className="block mb-1 text-sm font-medium">Contact Email</label>
//               <input type="email" className="w-full border rounded px-3 py-2" placeholder="support@cusceda.com" />
//             </div>
//           </div>
//         )}

//         {activeTab === 'appearance' && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Appearance Settings</h3>
//             {/* Theme options, color pickers */}
//             <p>Coming soon...</p>
//           </div>
//         )}

//         {activeTab === 'payments' && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Payment Settings</h3>
//             {/* Payment method toggles */}
//             <p>Enable/disable Stripe, PayPal, Bank Transfer...</p>
//           </div>
//         )}

//         {activeTab === 'notifications' && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Notification Preferences</h3>
//             <label className="flex items-center gap-2">
//               <input type="checkbox" className="accent-orange-600" defaultChecked />
//               Email me on new order
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="checkbox" className="accent-orange-600" />
//               Notify me when stock is low
//             </label>
//           </div>
//         )}

//         {activeTab === 'localization' && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Localization Settings</h3>
//             <label className="block mb-1 text-sm font-medium">Default Language</label>
//             <select className="w-full border rounded px-3 py-2">
//               <option>English</option>
//               <option>French</option>
//               <option>Spanish</option>
//             </select>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






































"use client"
import { useState } from 'react';
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
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
// import InviteAdminPanel from '@/components/admin/settings/users/InviteAdminPanel';
// import RolesPanel from '@/components/admin/settings/users/RolesPanel';
import ViewBroadcastButton from '@/components/admin/settings/users/ViewBroadcastButton';
import OrderPanel from '@/components/admin/settings/orders/OrderPanel';
import TransactionPanel from '@/components/admin/settings/orders/TransactionPanel';
import AddProductPanel from "@/components/admin/settings/products/AddProductPanel";
import ProductListPanel from "@/components/admin/settings/products/ProductListPanel";
import ReviewPanel from "@/components/admin/settings/products/ReviewPanel";
import UserListPanel from "@/components/admin/settings/users/UserListPanel";
import SubscribersPage from "@/components/admin/settings/users/SubscribersPage";

const settingsTabs = [
  { key: 'general', label: 'General', icon: <Cog className="w-4 h-4" /> },
  { key: 'product', label: 'Product', icon: <Box className="w-4 h-4" /> },
  { key: 'users', label: 'User & Roles', icon: <Users className="w-4 h-4" /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { key: 'orders', label: 'Orders & Payments', icon: <CreditCard className="w-4 h-4" /> },
  { key: 'localization', label: 'Localization', icon: <Globe className="w-4 h-4" /> },
  { key: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
  { key: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
  { key: 'legal', label: 'Legal / Policy', icon: <FileText className="w-4 h-4" /> },
  { key: 'backup', label: 'Backup / Export', icon: <CloudDownload className="w-4 h-4" /> },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [productSubTab, setProductSubTab] = useState(null);
  const [productPanel, setProductPanel] = useState(null);
  const [userPanel, setUserPanel] = useState(null);
  const [orderPanel, setOrderPanel] = useState(null);



  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      {/* Tab Header */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {settingsTabs.map((tab) => (
            <button
                key={tab.key}
                onClick={() => {
                setActiveTab(tab.key);
                setProductSubTab(null);
                if (tab.key === "product") setProductPanel(null);
                if (tab.key === "users") setUserPanel("main"); // ✅ Fix here
                if (tab.key === "orders") setOrderPanel(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all ${
                activeTab === tab.key
                    ? 'bg-orange-100 text-orange-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                {tab.icon}
                {tab.label}
            </button>
        ))}

      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded shadow border">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">General Settings</h3>
            <input placeholder="Site Title" className="w-full p-2 border rounded" />
            <input placeholder="Support Email" className="w-full p-2 border rounded" />
          </div>
        )}

        {activeTab === 'product' && (
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
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="accent-orange-600" /> Enable Product Reviews
                    </label>
                    <input
                        type="number"
                        placeholder="Low-stock alert threshold"
                        className="w-full p-2 border rounded"
                    />

                    <div className="flex gap-2 mt-6">
                        <button onClick={() => setProductPanel('add')} className="bg-orange-500 text-white px-4 py-2 rounded">
                        Add Product
                        </button>
                        <button onClick={() => setProductPanel('list')} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Product List
                        </button>
                        <button onClick={() => setProductPanel('reviews')} className="bg-purple-500 text-white px-4 py-2 rounded">
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

                    {productPanel === 'add' && <AddProductPanel />}
                    {productPanel === 'list' && <ProductListPanel />}
                    {productPanel === 'reviews' && <ReviewPanel />}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        )}


        {/* Other settings remain unchanged */}
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
            </AnimatePresence>
          </div>
        )}


        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-orange-600" /> Email on New Order
            </label>
          </div>
        )}

        {activeTab === 'orders' && (
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
                        <button
                        onClick={() => setOrderPanel('orders')}
                        className="bg-orange-500 text-white px-4 py-2 rounded"
                        >
                        View Orders
                        </button>
                        <button
                        onClick={() => setOrderPanel('transactions')}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
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
                    <button
                        onClick={() => setOrderPanel(null)}
                        className="flex items-center text-sm text-gray-600 hover:text-black"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </button>

                    {orderPanel === 'orders' && <OrderPanel />}
                    {orderPanel === 'transactions' && <TransactionPanel />}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        )}


        {activeTab === 'localization' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Localization</h3>
            <select className="w-full border p-2 rounded">
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Appearance / Theme</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-orange-600" /> Use Dark Mode by Default
            </label>
          </div>
        )}

        {/* {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Security Settings</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-orange-600" /> Enable 2FA for Admins
            </label>
          </div>
        )} */}
        {activeTab === 'security' && (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Security Settings</h3>

    {/* Enable 2FA */}
    <label className="flex items-center gap-2">
      <input type="checkbox" className="accent-orange-600" />
      Enable 2FA for Admins
    </label>

    {/* Session Timeout */}
    <div className="flex flex-col gap-1">
      <label className="font-medium">Session Timeout (minutes)</label>
      <input
        type="number"
        min="1"
        className="border px-3 py-1 rounded w-32"
        placeholder="e.g. 30"
      />
    </div>

    {/* Login Alerts */}
    <label className="flex items-center gap-2">
      <input type="checkbox" className="accent-orange-600" />
      Email me on new device login
    </label>

    {/* Password Expiry */}
    <label className="flex items-center gap-2">
      <input type="checkbox" className="accent-orange-600" />
      Force password change every 90 days
    </label>

    {/* Restrict Login IP */}
    <div className="flex flex-col gap-1">
      <label className="font-medium">Restrict Login by IP</label>
      <input
        type="text"
        className="border px-3 py-1 rounded w-full"
        placeholder="e.g. 192.168.0.1, 10.0.0.0/24"
      />
    </div>

    {/* Save button */}
    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      Save Security Settings
    </button>
  </div>
)}


        {activeTab === 'legal' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Legal & Policy</h3>
            <textarea placeholder="Privacy Policy..." className="w-full border p-2 rounded" rows={4}></textarea>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Backup & Export</h3>
            <button className="bg-orange-600 text-white px-4 py-2 rounded">Export Orders CSV</button>
          </div>
        )}
      </div>
    </div>
  );
}
