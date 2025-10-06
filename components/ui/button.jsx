import React from "react";

export function Button({ children, variant = "default", size = "md", ...props }) {
  const base = "rounded-xl font-medium transition focus:outline-none";
  const variants = {
    default: "bg-orange-500 hover:bg-orange-600 text-white",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-800",
  };
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}
