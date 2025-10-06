// "use client";
// import { useState } from "react";
// import AdminDashboard from "@/components/admin/AdminDashboard";
// import AdminSettings from "@/components/admin/AdminSettings";

// export default function AdminPage() {
//   const [activeView, setActiveView] = useState("dashboard");
//   const [activeTab, setActiveTab] = useState("general");
//   const [userPanel, setUserPanel] = useState("main");
//   const [orderPanel, setOrderPanel] = useState(null);

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
//           setActiveView={setActiveView} // optional if you want to go back to dashboard
//         />
//       )}
//     </>
//   );
// }




































// "use client";

// import { useEffect, useState } from "react";
// import AdminDashboard from "@/components/admin/AdminDashboard";
// import AdminSettings from "@/components/admin/AdminSettings";
// import AdminOtpVerification from "@/components/admin/AdminOtpVerification"; // Make sure path is correct
// import { useUser } from "@clerk/nextjs";

// export default function AdminPage() {
//   const { user } = useUser();

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
//           email={user?.emailAddresses[0]?.emailAddress}
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
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminOtpVerification from "@/components/admin/AdminOtpVerification";
import { useAppContext } from "@/context/AppContext"; // 🔥 custom auth

export default function AdminPage() {
  const { currentUser } = useAppContext(); // instead of Clerk’s useUser

  const [isVerified, setIsVerified] = useState(false);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);

  const [activeView, setActiveView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("general");
  const [userPanel, setUserPanel] = useState("main");
  const [orderPanel, setOrderPanel] = useState(null);

  useEffect(() => {
    const otpVerified = sessionStorage.getItem("adminOtpVerified");
    if (!otpVerified) {
      setShowOtpPrompt(true);
    } else {
      setIsVerified(true);
    }
  }, []);

  const handleOtpSuccess = () => {
    sessionStorage.setItem("adminOtpVerified", "true");
    setIsVerified(true);
    setShowOtpPrompt(false);
  };

  if (showOtpPrompt) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <AdminOtpVerification
          email={currentUser?.email} // now comes from your custom user
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
