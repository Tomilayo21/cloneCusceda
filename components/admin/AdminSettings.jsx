"use client";
import React, {useState, useEffect} from 'react'
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
  PlusCircle, 
  Mail,
  List, 
  Star,
  PackageSearch,
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
import { useUser } from '@clerk/nextjs';
import FormatDatabase from '@/components/admin/FormatDatabase';
import BackupModal from '@/components/admin/BackupModal';
import AdminRestore from '@/components/admin/AdminRestore';
import RestoreModal from '@/components/admin/RestoreModal';
import RegUsers from "@/components/admin/RegUsers";



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
    // const [activeTab, setActiveTab] = useState('general');
  const [productSubTab, setProductSubTab] = useState(null);
  const [productPanel, setProductPanel] = useState(null);
  // const [userPanel, setUserPanel] = useState(null);
  // const [orderPanel, setOrderPanel] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [footerDescription, setFooterDescription] = useState("");
  const [footerPhone, setFooterPhone] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [footerName, setFooterName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [settingsPanel, setSettingsPanel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);

  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setLogoPreview(data.logoUrl); // from MongoDB
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        const res = await fetch("/api/settings/metadata");
        const data = await res.json();

        setSiteTitle(data.siteTitle || "");
        setSiteDescription(data.siteDescription || "");
        setFooterDescription(data.footerDescription || "");
        setFooterPhone(data.footerPhone || "");
        setFooterEmail(data.footerEmail || "");
        setFooterName(data.footerName || "");
        setSupportEmail(data.supportEmail || "");
      } catch (error) {
        toast.error("Failed to load site settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSiteDetails();
  }, []);

  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     try {
  //       const res = await fetch("/api/settings/footerdetails");
  //       const data = await res.json();
  //       if (data) {
  //         setFooterDescription(data.footerDescription || "");
  //         setFooterPhone(data.footerPhone || "");
  //         setFooterEmail(data.footerEmail || "");
  //         setFooterName(data.footerName || "");
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch settings:", err);
  //     }
  //   };
  //   fetchSettings();
  // }, []);

   const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-logo", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setUploading(false);

    if (res.ok) {
      toast.success("Logo uploaded");
    } else {
      toast.error(result.error || "Upload failed");
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const res = await fetch("/api/settings/logo", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete logo");
      toast.success("Logo removed");
      setLogoPreview(null);
    } catch (err) {
      toast.error("Error removing logo");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading

    const payload = {
      siteTitle,
      siteDescription,
      footerDescription,
      footerPhone,
      footerEmail,
      footerName,
      supportEmail,
    };

    try {
      const res = await fetch("/api/settings/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Settings updated");
      } else {
        const data = await res.json();
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("Unexpected error");
    } finally {
      setIsSubmitting(false); // End loading
    }
  };


  const handleFormatDatabase = async () => {
    const confirmed = confirm("Are you sure? This will permanently delete ALL data.");
    if (!confirmed) return;

    try {
      const res = await fetch("/api/admin/format-database", {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Database wiped successfully.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to format database.");
      }
    } catch (err) {
      toast.error("Unexpected error occurred.");
    }
  };

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
        {activeTab === 'general' && (
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!settingsPanel && (
                <motion.div
                  key="general-main"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-lg">Site Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={() => setSettingsPanel('site')}
                      className="flex flex-col items-start bg-orange-100 hover:bg-orange-200 text-orange-800 p-4 rounded-xl shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Site Metadata</span>
                      </div>
                      <p className="text-xs text-left">
                        Edit your site’s title, description, support email and logo.
                      </p>
                    </button>

                    <button
                      onClick={() => setSettingsPanel('footer')}
                      className="flex flex-col items-start bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-xl shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Footer Settings</span>
                      </div>
                      <p className="text-xs text-left">
                        Customize footer content such as contact info and branding.
                      </p>
                    </button>
                  </div>
                </motion.div>
              )}

              {settingsPanel && (
                <motion.div
                  key="general-sub"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <button onClick={() => setSettingsPanel(null)} className="flex items-center text-sm text-gray-600 hover:text-black">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>

                  {settingsPanel === 'site' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="text-lg font-semibold">Site Settings</h3>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Site Title</label>
                        <input
                          type="text"
                          value={siteTitle}
                          onChange={(e) => setSiteTitle(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Site Description</label>
                        <textarea
                          value={siteDescription}
                          onChange={(e) => setSiteDescription(e.target.value)}
                          className="w-full p-2 border rounded"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Logo</label>
                        {logoPreview ? (
                          <div className="flex items-center gap-4">
                            <img src={logoPreview} alt="Logo" className="w-20 h-20 object-contain border rounded" />
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="text-red-500 text-sm hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="w-full p-2 border rounded bg-white text-gray-700"
                          />
                        )}
                      </div>

                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </form>
                  )}

                  {settingsPanel === 'footer' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="text-lg font-semibold">Footer Settings</h3>

                      <textarea
                        value={footerDescription}
                        onChange={(e) => setFooterDescription(e.target.value)}
                        placeholder="Footer Description"
                        className="w-full p-2 border rounded"
                      />

                      <input
                        value={footerPhone}
                        onChange={(e) => setFooterPhone(e.target.value)}
                        placeholder="Footer Phone"
                        className="w-full p-2 border rounded"
                      />

                      <input
                        value={footerEmail}
                        onChange={(e) => setFooterEmail(e.target.value)}
                        placeholder="Footer Email"
                        type="email"
                        className="w-full p-2 border rounded"
                      />

                      <input
                        value={footerName}
                        onChange={(e) => setFooterName(e.target.value)}
                        placeholder="Footer Name"
                        className="w-full p-2 border rounded"
                      />

                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>

                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <button
                        onClick={() => setProductPanel('add')}
                        className="flex flex-col items-start bg-orange-100 hover:bg-orange-200 text-orange-800 p-4 rounded-xl shadow"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <PlusCircle className="w-5 h-5" />
                          <span className="font-semibold">Add Product</span>
                        </div>
                        <p className="text-xs text-left">
                          Create a new product, upload images, set prices, and manage availability.
                      </p>
                      </button>
                      <button
                        onClick={() => setProductPanel('list')}
                        className="flex flex-col items-start bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-xl shadow"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <List className="w-5 h-5" />
                          <span className="font-semibold">Product List</span>
                        </div>
                      <p className="text-xs text-left">
                          View and manage your existing product catalog, edit or delete items.
                        </p>
                      </button>

                      <button
                        onClick={() => setProductPanel('reviews')}
                        className="flex flex-col items-start bg-purple-100 hover:bg-purple-200 text-purple-800 p-4 rounded-xl shadow"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-5 h-5" />
                          <span className="font-semibold">Reviews</span>
                        </div>
                        <p className="text-xs text-left">
                        Monitor and approve customer reviews and ratings on products.
                        </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <button
                      onClick={() => setUserPanel("list")}
                      className="flex flex-col items-start bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-xl shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">View Users</span>
                      </div>
                      <p className="text-xs text-left">
                        Browse and manage all registered users, including profile info and activity.
                      </p>
                    </button>

                     <button
                      onClick={() => setUserPanel("subscribers")}
                      className="flex flex-col items-start bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-xl shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-5 h-5" />
                        <span className="font-semibold">Subscribers</span>
                      </div>
                      <p className="text-xs text-left">
                        View and export newsletter subscribers and manage email outreach.
                      </p>
                    </button>

                    <button
                      onClick={() => setUserPanel("roles")}
                      className="flex flex-col items-start bg-purple-100 hover:bg-purple-200 text-purple-800 p-4 rounded-xl shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-semibold">Roles & Permissions</span>
                      </div>
                      <p className="text-xs text-left">
                        Assign roles to users, configure access levels, and manage permissions.
                      </p>
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
                  <RegUsers />
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

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                       <button
                        onClick={() => setOrderPanel('orders')}
                        className="flex flex-col items-start bg-orange-100 hover:bg-orange-200 text-orange-800 p-4 rounded-xl shadow"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <PackageSearch className="w-5 h-5" />
                          <span className="font-semibold">View Orders</span>
                        </div>
                        <p className="text-xs text-left">
                          Browse all placed orders, track delivery status, and update order stages.
                        </p>
                      </button>

                      <button
                        onClick={() => setOrderPanel('transactions')}
                        className="flex flex-col items-start bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-xl shadow"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="w-5 h-5" />
                          <span className="font-semibold">View Transactions</span>
                        </div>
                        <p className="text-xs text-left">
                          Monitor all payment records, verify receipts, and check transaction types.
                        </p>
                      </button>
                     </div> 
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                       <button
                        onClick={() => setOrderPanel('orders')}
                        className="flex flex-col items-start bg-orange-100 hover:bg-orange-200 text-orange-800 p-4 rounded-xl shadow transition"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <PackageSearch className="w-5 h-5" />
                          <span className="font-semibold">View Orders</span>
                        </div>
                        <p className="text-xs text-left">
                          Browse all placed orders, track delivery status, and update order stages.
                        </p>
                      </button>

                      <button
                        onClick={() => setOrderPanel('transactions')}
                        className="flex flex-col items-start bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-xl shadow transition"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="w-5 h-5" />
                          <span className="font-semibold">View Transactions</span>
                        </div>
                        <p className="text-xs text-left">
                          Monitor all payment records, verify receipts, and check transaction types.
                        </p>
                      </button>

                      {/* Placeholder for future section */}
                      <div className="flex flex-col items-start bg-gray-100 text-gray-500 p-4 rounded-xl shadow italic">
                        <span className="font-medium mb-1">More Coming Soon</span>
                        <p className="text-xs">
                          Stay tuned for additional features in this section.
                        </p>
                      </div>
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
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Backup & Export</h3>

            {/* Export Orders */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Download all order records in CSV format.</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                Export Orders CSV
              </button>
            </div>

            {/* Export Products */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Download product inventory as CSV.</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                Export Products CSV
              </button>
            </div>

            {/* Export Users */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Download user list in CSV format.</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                Export Users CSV
              </button>
            </div>

            {/* Database Backup */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Generate and download a full database backup.</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Database Backup
              </button>
              {showModal && <BackupModal onClose={() => setShowModal(false)} />}
            </div>

            {/* Restore From Backup */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Restore data from a backup file.</p>
              {/* <input type="file" className="block mb-2" /> */}
              <button
                onClick={() => setOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🛠 Restore Backup
              </button>

              {/* <RestoreModal isOpen={open} onClose={() => setOpen(false)}/> */}
              <RestoreModal isOpen={open} onClose={() => setOpen(false)} />
            </div>

            {/* Format (Wipe Database) */}
            <div className="pt-4 border-t border-red-200">
              <h4 className="text-red-600 font-semibold">Danger Zone</h4>
              <p className="text-sm text-gray-600 mb-2">
                This will permanently erase all data (orders, products, users, etc). This action cannot be undone.
              </p>
              <FormatDatabase
                onSuccess={() => {
                  // Optional: trigger refetch or redirect
                  console.log("Database cleared.");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
