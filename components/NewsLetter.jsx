"use client";

import React, { useState } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

   const handleSubscribe = async () => {
    setLoading(true);
    setMessage("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.alreadySubscribed) {
          setMessage("You're already subscribed to our newsletter.");
        } else {
          setMessage("Subscribed successfully! Check your email for confirmation.");
          setEmail("");
        }
      } else {
        setMessage(data.error || "Subscription failed.");
      }
    } catch (err) {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };


  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium text-black dark:text-white">
        Subscribe now & get 20% off
      </h1>
      <p className="md:text-base text-gray-500/80 dark:text-gray-300 pb-8">
        Join our newsletter to receive exclusive discounts, product updates, and early access to new arrivals—starting with 20% off your first order!
      </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubscribe();
          }}
          className="flex  items-center justify-between max-w-2xl w-full md:h-14 h-12"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
            required
          />
          <button
            type="submit"
            className="md:px-12 px-8 py-3 text-white bg-orange-600 rounded-md rounded-l-none disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{message}</p>
      )}
    </div>
  );
};

export default NewsLetter;
