'use client';
import React from "react";
import RegUsers from "@/components/admin/RegUsers";

const Users = () => {
  return (
      <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
          <RegUsers />
      </div>
  );
};

export default Users;