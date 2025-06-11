"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

const ContactPage = () => {
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
        <div className="flex flex-col items-center items-start px-6 md:px-16 lg:px-32 pt-8 mb-12">
            <div className="flex flex-col items-center mt-8 mb-8">
              <p className="text-3xl font-medium">
                Contact <span className="text-orange-600">Us</span>
              </p>
              <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
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
            <p className={`mt-3 text-sm ${response.type === "error" ? "text-red-500" : "text-green-600"}`}>
                {response.message}
            </p>
            )}
        </form>
        </div>
        <Footer />
    </>
  );
};

export default ContactPage;













































// "use client";

// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import React, { useState } from "react";
// import emailjs from "emailjs-com";

// const ContactPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResponse(null);

//     try {
//       // 1. Send email with EmailJS
//       await emailjs.send(
//         "service_xaps0fh",      // ✅ Replace with your EmailJS Service ID
//         "template_6uxopbv",     // ✅ Replace with your EmailJS Template ID
//         {
//           name: formData.name,
//           email: formData.email,
//           subject: formData.subject,
//           message: formData.message,
//         },
//         "public_ax74Vx98AH3x-vJi0"       // ✅ Replace with your EmailJS Public Key
//       );

//       // 2. Post data to your MongoDB API
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Submission failed");

//       setResponse({ type: "success", message: "Message sent and saved!" });
//       setFormData({ name: "", email: "", subject: "", message: "" });
//     } catch (err) {
//       console.error(err);
//       setResponse({ type: "error", message: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-center items-start px-6 md:px-16 lg:px-32 pt-8 mb-12">
//         <div className="flex flex-col items-center mt-8 mb-8">
//           <p className="text-3xl font-medium">
//             Contact <span className="text-orange-600">Us</span>
//           </p>
//           <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//         </div>

//         <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             className="w-full px-4 py-2 border rounded"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             className="w-full px-4 py-2 border rounded"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="subject"
//             placeholder="Subject"
//             className="w-full px-4 py-2 border rounded"
//             value={formData.subject}
//             onChange={handleChange}
//             required
//           />
//           <textarea
//             name="message"
//             placeholder="Your Message"
//             rows={5}
//             className="w-full px-4 py-2 border rounded"
//             value={formData.message}
//             onChange={handleChange}
//             required
//           />
//           <button
//             type="submit"
//             className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send Message"}
//           </button>
//           {response && (
//             <p
//               className={`mt-3 text-sm ${
//                 response.type === "error" ? "text-red-500" : "text-green-600"
//               }`}
//             >
//               {response.message}
//             </p>
//           )}
//         </form>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ContactPage;



































































// "use client";

// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import React, { useState, useEffect } from "react";
// import emailjs from "@emailjs/browser"; // ✅ Use updated package

// const ContactPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);

//   useEffect(() => {
//     emailjs.init("public_x7s8ZwS4vam4s73ql"); // ✅ Initialize once
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResponse(null);

//     try {
//       // Send email
//       await emailjs.send(
//         "service_xaps0fh",
//         "template_6uxopbv",
//         {
//           name: formData.name,
//           email: formData.email,
//           subject: formData.subject,
//           message: formData.message,
//         }
//       );

//       // Save to database
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Submission failed");

//       setResponse({ type: "success", message: "Message sent and saved!" });
//       setFormData({ name: "", email: "", subject: "", message: "" });
//     } catch (err) {
//       console.error("EmailJS Error:", err);
//       const errorMsg = err?.text || err?.message || JSON.stringify(err) || "Unknown error";
//       setResponse({ type: "error", message: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-center items-start px-6 md:px-16 lg:px-32 pt-8 mb-12">
//         <div className="flex flex-col items-center mt-8 mb-8">
//           <p className="text-3xl font-medium">
//             Contact <span className="text-orange-600">Us</span>
//           </p>
//           <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//         </div>

//         <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             className="w-full px-4 py-2 border rounded"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             className="w-full px-4 py-2 border rounded"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="subject"
//             placeholder="Subject"
//             className="w-full px-4 py-2 border rounded"
//             value={formData.subject}
//             onChange={handleChange}
//             required
//           />
//           <textarea
//             name="message"
//             placeholder="Your Message"
//             rows={5}
//             className="w-full px-4 py-2 border rounded"
//             value={formData.message}
//             onChange={handleChange}
//             required
//           />
//           <button
//             type="submit"
//             className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send Message"}
//           </button>
//           {response && (
//             <p
//               className={`mt-3 text-sm ${
//                 response.type === "error" ? "text-red-500" : "text-green-600"
//               }`}
//             >
//               {response.message}
//             </p>
//           )}
//         </form>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ContactPage;




