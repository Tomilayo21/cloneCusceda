import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
