<<<<<<< HEAD
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
=======

// "use client";

// import { useEffect, useState } from "react";
// import AdminDashboard from "@/components/admin/AdminDashboard";
// import AdminSettings from "@/components/admin/AdminSettings";
// import AdminOtpVerification from "@/components/admin/AdminOtpVerification";
// import { useAppContext } from "@/context/AppContext"; // 🔥 custom auth

// export default function AdminPage() {
//   const { currentUser } = useAppContext(); // instead of Clerk’s useUser

//   const [isVerified, setIsVerified] = useState(false);
//   const [showOtpPrompt, setShowOtpPrompt] = useState(false);

//   const [activeView, setActiveView] = useState("dashboard");
//   const [activeTab, setActiveTab] = useState("general");
//   const [userPanel, setUserPanel] = useState("main");
//   const [orderPanel, setOrderPanel] = useState(null);

//   useEffect(() => {
//     const otpVerified = sessionStorage.getItem("adminOtpVerified");
//     if (!otpVerified) {
//       setShowOtpPrompt(true);
//     } else {
//       setIsVerified(true);
//     }
//   }, []);

//   const handleOtpSuccess = () => {
//     sessionStorage.setItem("adminOtpVerified", "true");
//     setIsVerified(true);
//     setShowOtpPrompt(false);
//   };

//   if (showOtpPrompt) {
//     return (
//       <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
//         <AdminOtpVerification
//           email={currentUser?.email} // now comes from your custom user
//           onCancel={() => {}}
//           onSuccess={handleOtpSuccess}
//         />
//       </div>
//     );
//   }

//   if (!isVerified) return null;

//   return (
//     <>
//       {activeView === "dashboard" && (
//         <AdminDashboard
//           setActiveView={setActiveView}
//           setActiveTab={setActiveTab}
//           setUserPanel={setUserPanel}
//           setOrderPanel={setOrderPanel}
//         />
//       )}

//       {activeView === "settings" && (
//         <AdminSettings
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           userPanel={userPanel}
//           setUserPanel={setUserPanel}
//           orderPanel={orderPanel}
//           setOrderPanel={setOrderPanel}
//           setActiveView={setActiveView}
//         />
//       )}
//     </>
//   );
// }

























"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // ✅ from NextAuth
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminOtpVerification from "@/components/admin/AdminOtpVerification";

export default function AdminPage() {
  const { data: session, status } = useSession();
>>>>>>> f23d42968812f4ec46450c8a372451adaf757c70
  const userEmail = session?.user?.email;

  const [isVerified, setIsVerified] = useState(false);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);

  const [activeView, setActiveView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("general");
  const [userPanel, setUserPanel] = useState("main");
  const [orderPanel, setOrderPanel] = useState(null);

<<<<<<< HEAD

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
=======
  // ✅ Wait for NextAuth session to load
  useEffect(() => {
    if (status === "loading") return; // don't run yet

    const otpVerified = sessionStorage.getItem("adminOtpVerified");

    if (!otpVerified) {
      setShowOtpPrompt(true);
    } else {
      setIsVerified(true);
    }
>>>>>>> f23d42968812f4ec46450c8a372451adaf757c70
  }, [status]);

  const handleOtpSuccess = () => {
    sessionStorage.setItem("adminOtpVerified", "true");
    setIsVerified(true);
    setShowOtpPrompt(false);
  };

<<<<<<< HEAD
  if (status === "loading") {
=======
  // ✅ Don't render anything until session is ready
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading admin session...
      </div>
    );
  }

  // ✅ Show OTP modal only when email is available
  if (showOtpPrompt) {
    if (!userEmail) return null; // Wait for session to have an email

>>>>>>> f23d42968812f4ec46450c8a372451adaf757c70
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
