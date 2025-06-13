"use client";

import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
