'use client';
import React, { useEffect, useState } from 'react';
import { Users, Gauge } from "lucide-react";
import { useClerk, useUser, UserButton } from '@clerk/nextjs';
import { Calendar, Clock } from "lucide-react";


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
    // <div className="bg-gradient-to-r from-black to-orange-600 text-white rounded-xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
    //   {/* Left Section */}

    //   <div className="flex items-center gap-4 mb-4 md:mb-0">
    //     <Gauge className="w-6 h-6 text-white-600" />
    //     <div>
    //       {user ? (
    //         <>
    //           <h2 className="text-2xl font-bold">
    //             <span className="font-semibold">{user.fullName || user.primaryEmailAddress?.emailAddress}</span>'s Dashboard
    //           </h2>
    //           <p className="text-sm text-gray-200 mt-1">
    //             Platform Metrics Summary: Here's what's happening today.
    //           </p>
    //         </>
    //       ) : (
    //         <>
    //           <h2 className="text-2xl font-bold">Admin Dashboard</h2>
    //           <button
    //             onClick={() => openSignIn()}
    //             className="mt-2 flex items-center gap-2 text-white hover:bg-white/10 px-3 py-1 rounded-md border border-white/30"
    //           >
    //             <Users className="w-4 h-4" />
    //             <span>Sign In</span>
    //           </button>
    //         </>
    //       )}
    //     </div>
    //   </div>



    //   {/* Right Section */}

    //   <div className="flex items-center gap-4">
    //     <span className="flex items-center gap-1 animate-pulse">
    //       📅 <span className="text-white font-medium">{date}</span>
    //     </span>
    //     <span className="flex items-center gap-1 animate-pulse">
    //       🕒 <span className="text-white font-medium">{time}</span>
    //     </span>
    //   </div>

    // </div>
<div className="bg-gradient-to-r from-gray-900 via-black to-orange-600 text-white rounded-2xl p-6 mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between">
  {/* Left Section */}
  <div className="flex items-center gap-4 mb-4 md:mb-0">
    <div className="p-3 bg-white/10 rounded-full">
      <Gauge className="w-6 h-6 text-white" />
    </div>
    <div>
      {user ? (
        <>
          <h2 className="text-2xl font-extrabold tracking-tight">
            <span className="font-semibold">{user.fullName || user.primaryEmailAddress?.emailAddress}</span>'s Dashboard
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Platform Metrics Summary — here’s what’s happening today.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-extrabold tracking-tight">Admin Dashboard</h2>
          <button
            onClick={() => openSignIn()}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-sm font-medium transition"
          >
            <Users className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </>
      )}
    </div>
  </div>

  {/* Right Section */}
  {/* <div className="flex items-center gap-6 text-sm font-medium">
    <span className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-white/80" />
      <span className="text-white/90">{date}</span>
    </span>
    <span className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-white/80" />
      <span className="text-white/90">{time}</span>
    </span>
  </div> */}
  <div className="flex items-center gap-6 text-sm font-medium">
  <span className="flex items-center gap-2">
    <Calendar className="w-4 h-4 text-white/80" />
    <span className="text-white/90">{date}</span>
  </span>
  <span className="flex items-center gap-2">
    <Clock className="w-4 h-4 text-white/80 animate-spin-slow" />
    <span className="text-white/90">{time}</span>
  </span>
</div>
</div>

  );
};

export default AdminHeader;
