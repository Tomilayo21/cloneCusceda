"use client";
import { useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSettings from "@/components/admin/AdminSettings";

export default function AdminPage() {
  const [activeView, setActiveView] = useState("dashboard"); // or 'settings'
  const [activeTab, setActiveTab] = useState("general");
  const [userPanel, setUserPanel] = useState("main");
  const [orderPanel, setOrderPanel] = useState(null);

  return (
    <>
      {activeView === "dashboard" && (
        <AdminDashboard
          setActiveView={setActiveView} // 👈 pass view switcher
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
          setActiveView={setActiveView} // optional if you want to go back to dashboard
        />
      )}
    </>
  );
}
