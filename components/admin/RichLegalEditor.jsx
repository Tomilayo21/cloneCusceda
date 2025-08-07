"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export function RichLegalEditor() {
  const [privacy, setPrivacy] = useState("");
  const [terms, setTerms] = useState("");
  const [returns, setReturns] = useState("");
  const [cookies, setCookies] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!privacy || !terms || !returns || !cookies) {
      toast.error("All fields must be filled.");
      return;
    }

    setLoading(true);
    try {
      // Replace this with your API call
      await new Promise((res) => setTimeout(res, 1000));

      toast.success("Policies saved successfully!");
    } catch (error) {
      toast.error("Failed to save policies.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block mb-1 font-medium">Privacy Policy (Markdown supported)</label>
        <ReactQuill value={privacy} onChange={setPrivacy} theme="snow" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Terms & Conditions (Markdown supported)</label>
        <ReactQuill value={terms} onChange={setTerms} theme="snow" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Return/Refund Policy (Markdown supported)</label>
        <ReactQuill value={returns} onChange={setReturns} theme="snow" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Cookies Policy (Markdown supported)</label>
        <ReactQuill value={cookies} onChange={setCookies} theme="snow" />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Policies"}
      </button>
    </div>
  );
}
