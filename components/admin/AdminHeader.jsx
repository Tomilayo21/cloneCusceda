'use client';
import React, { useEffect, useState } from 'react';
import { Users, Gauge } from "lucide-react";
import { useClerk, useUser, UserButton } from '@clerk/nextjs';


const AdminHeader = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { user } = useUser();


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
      {/*<div className="flex items-center gap-4 mb-4 md:mb-0">
        <Gauge className="w-6 h-6 text-white-600" />
        <div>
          <h2 className="text-2xl font-bold">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-200">
            Platform Metrics Summary: Here's what's happening today.
          </p>
          {user ? (
            <div className="mt-1 text-sm text-white font-medium">
              Welcome, {user.fullName || user.primaryEmailAddress?.emailAddress}
            </div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className="mt-2 flex items-center gap-2 text-white hover:bg-white/10 px-3 py-1 rounded-md border border-white/30"
            >
              <Users className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>*/}

      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <Gauge className="w-6 h-6 text-white-600" />
        <div>
          {user ? (
            <>
              <h2 className="text-2xl font-bold">
                <span className="font-semibold">{user.fullName || user.primaryEmailAddress?.emailAddress}</span>'s Dashboard
              </h2>
              <p className="text-sm text-gray-200 mt-1">
                Platform Metrics Summary: Here's what's happening today.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <button
                onClick={() => openSignIn()}
                className="mt-2 flex items-center gap-2 text-white hover:bg-white/10 px-3 py-1 rounded-md border border-white/30"
              >
                <Users className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </>
          )}
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
