"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminOtpVerification from "@/components/admin/AdminOtpVerification";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  const [isVerified, setIsVerified] = useState(false);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("general");
  const [userPanel, setUserPanel] = useState("main");
  const [orderPanel, setOrderPanel] = useState(null);

  // ✅ OTP Verification logic
  useEffect(() => {
    if (status === "loading") return;

    const otpVerified = sessionStorage.getItem("adminOtpVerified");
    if (!otpVerified) {
      setShowOtpPrompt(true);
    } else {
      setIsVerified(true);
    }
  }, [status]);

  const handleOtpSuccess = () => {
    sessionStorage.setItem("adminOtpVerified", "true");
    setIsVerified(true);
    setShowOtpPrompt(false);
  };

  // ✅ Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading admin session...
      </div>
    );
  }

  // ✅ Show OTP modal
  if (showOtpPrompt) {
    if (!userEmail) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 flex items-center justify-center">
        <AdminOtpVerification
          email={userEmail}
          onCancel={() => {}}
          onSuccess={handleOtpSuccess}
        />
      </div>
    );
  }

  // ✅ Only render dashboard after verification
  if (!isVerified) return null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {activeView === "dashboard" && (
        <AdminDashboard
          setActiveView={setActiveView}
          setActiveTab={setActiveTab}
          setUserPanel={setUserPanel}
          setOrderPanel={setOrderPanel}
        />
      )}

      {activeView === "settings" && (
        <AdminSettings
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userPanel={userPanel}
          setUserPanel={setUserPanel}
          orderPanel={orderPanel}
          setOrderPanel={setOrderPanel}
          setActiveView={setActiveView}
        />
      )}
    </main>
  );
}
