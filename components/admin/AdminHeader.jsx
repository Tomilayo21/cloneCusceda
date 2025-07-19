'use client';
import React, { useEffect, useState } from 'react';
import { Gauge } from "lucide-react";

const AdminHeader = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      console.log('Time updated:', formattedTime); // ✅ debug

      setDate(formattedDate);
      setTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-black to-orange-600 text-white rounded-xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <Gauge className="w-6 h-6 text-white-600" />
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-sm text-gray-200">Welcome back! Here's whats happening on your platform today.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <span className="bg-black text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
          📅 <span>{date}</span>
        </span>
        <span className="bg-black text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
          🕒 <span>{time}</span>
        </span>
      </div>
    </div>
  );
};

export default AdminHeader;
