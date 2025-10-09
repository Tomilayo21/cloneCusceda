"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminOtpVerification from "@/components/admin/AdminOtpVerification";
import { useAppContext } from "@/context/AppContext";

export default function AdminPage() {
  const { data: session, status } = useSession();
  // const { theme, setTheme, systemTheme } = useTheme();
  const { themeMode, setThemeMode } = useAppContext();
  const userEmail = session?.user?.email;

  const [isVerified, setIsVerified] = useState(false);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);

  const [activeView, setActiveView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("general");
  const [userPanel, setUserPanel] = useState("main");
  const [orderPanel, setOrderPanel] = useState(null);


  useEffect(() => {
    // Check if the user prefers dark mode (system setting)
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    // Detect system theme
    const systemTheme = mq.matches ? "dark" : "light";

    // Decide what theme to apply
    const currentTheme = themeMode === "system" ? systemTheme : themeMode;

    // Apply it to <html>
    document.documentElement.classList.toggle("dark", currentTheme === "dark");

    // Listen for system theme changes when mode = system
    if (themeMode === "system") {
      const handleChange = () => {
        const newSystemTheme = mq.matches ? "dark" : "light";
        document.documentElement.classList.toggle("dark", newSystemTheme === "dark");
      };
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    }
  }, [themeMode]);


  // ✅ OTP Verification logic
  useEffect(() => {
    if (status === "loading") return;

    const otpVerified = sessionStorage.getItem("adminOtpVerified");
    if (!otpVerified) setShowOtpPrompt(true);
    else setIsVerified(true);
  }, [status]);

  const handleOtpSuccess = () => {
    sessionStorage.setItem("adminOtpVerified", "true");
    setIsVerified(true);
    setShowOtpPrompt(false);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-200">
        Loading admin session...
      </div>
    );
  }

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
