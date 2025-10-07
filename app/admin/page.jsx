
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
  const userEmail = session?.user?.email;

  const [isVerified, setIsVerified] = useState(false);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);

  const [activeView, setActiveView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("general");
  const [userPanel, setUserPanel] = useState("main");
  const [orderPanel, setOrderPanel] = useState(null);

  // ✅ Wait for NextAuth session to load
  useEffect(() => {
    if (status === "loading") return; // don't run yet

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

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
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
    <>
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
    </>
  );
}
