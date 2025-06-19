"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import { MessageCircle } from "lucide-react";

const ContactPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Submission failed");

      setResponse({ type: "success", message: "Message sent successfully!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setResponse({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center px-6 md:px-16 lg:px-32 pt-8 mb-24">
        <div className="text-center mt-8 mb-8">
          <p className="text-3xl font-medium">
            Contact <span className="text-orange-600">Us</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full px-4 py-2 border rounded"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            className="w-full px-4 py-2 border rounded"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
          {response && (
            <p
              className={`mt-3 text-sm ${
                response.type === "error" ? "text-red-500" : "text-green-600"
              }`}
            >
              {response.message}
            </p>
          )}
        </form>
      </div>

      {/* Floating Chat Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* ChatBox Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[90%] max-w-sm">
          <ChatBox />
        </div>
      )}

      <Footer />
    </>
  );
};

export default ContactPage;
