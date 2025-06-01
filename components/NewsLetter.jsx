// "use client";

// import React, { useState } from "react";

// const NewsLetter = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSubscribe = async () => {
//     setLoading(true);
//     setMessage("");

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setMessage("Please enter a valid email address.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("Subscribed successfully! Check your email for confirmation.");
//         setEmail("");
//       } else {
//         setMessage(data.error || "Subscription failed.");
//       }
//     } catch (err) {
//       setMessage("Something went wrong.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
//       <h1 className="md:text-4xl text-2xl font-medium">
//         Subscribe now & get 20% off
//       </h1>
//       <p className="md:text-base text-gray-500/80 pb-8">
//         Join our newsletter to receive exclusive discounts, product updates, and early access to new arrivals—starting with 20% off your first order!
//       </p>
//       <div className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12">
//         <input
//           className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button
//           onClick={handleSubscribe}
//           className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none"
//           disabled={loading}
//         >
//           {loading ? "Subscribing..." : "Subscribe"}
//         </button>
//       </div>
//       {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
//     </div>
//   );
// };

// export default NewsLetter;

































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
        setMessage("Subscribed successfully! Check your email for confirmation.");
        setEmail("");
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
      <h1 className="md:text-4xl text-2xl font-medium">
        Subscribe now & get 20% off
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8">
        Join our newsletter to receive exclusive discounts, product updates, and early access to new arrivals—starting with 20% off your first order!
      </p>
      <div className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12">
        <input
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSubscribe}
          className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none"
          disabled={loading}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
    </div>
  );
};

export default NewsLetter;
