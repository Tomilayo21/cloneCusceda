// "use client";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function AdminOtpVerification({ email, onCancel, onSuccess }) {
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const [cooldown, setCooldown] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const maskedEmail = maskEmail(email);

//   useEffect(() => {
//     sendOtp();

//     const interval = setInterval(() => {
//       setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   function maskEmail(email) {
//     const [name, domain] = email.split("@");
//     if (name.length <= 2) return "*@"+domain;
//     return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
//   }

//   const sendOtp = async () => {
//     setCooldown(60);
//     try {
//       await fetch('/api/admin/send-otp', {
//         method: 'POST',
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       toast.success("OTP sent");
//     } catch (err) {
//       toast.error("Failed to send OTP");
//       console.error(err);
//     }
//   };

//   const handleVerify = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch('/api/admin/verify-otp', {
//         method: 'POST',
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         localStorage.setItem("otp_verified", "true");
//         toast.success("OTP verified");
//         onSuccess?.();
//       } else {
//         setError('Invalid or expired OTP');
//       }
//     } catch (err) {
//       setError('Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg w-full max-w-sm">
//       <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
//         Verify OTP
//       </h2>
//       <p className="text-sm text-gray-600 mb-4 text-center">
//         Enter the 6-digit code sent to <span className="font-mono text-gray-800">{maskedEmail}</span>
//       </p>

//       <input
//         type="text"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         placeholder="Enter OTP"
//         className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-600 focus:outline-none mb-3"
//       />

//       {error && (
//         <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
//       )}

//       <button
//         onClick={handleVerify}
//         disabled={loading}
//         className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
//       >
//         {loading ? 'Verifying...' : 'Verify OTP'}
//       </button>

//       <button
//         onClick={onCancel}
//         disabled={loading}
//         className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
//       >
//         Cancel
//       </button>

//       <button
//         onClick={sendOtp}
//         disabled={cooldown > 0}
//         className="w-full text-sm font-medium text-purple-600 hover:text-purple-700 transition disabled:text-gray-400 disabled:cursor-not-allowed"
//       >
//         {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
//       </button>
//     </div>

//   );
// }


































// "use client";
// import { useState, useEffect, useRef } from "react";
// import toast from "react-hot-toast";

// export default function AdminOtpVerification({ email, onCancel, onSuccess }) {
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [error, setError] = useState("");
//   const [cooldown, setCooldown] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const inputRefs = useRef([]);

//   useEffect(() => {
//     sendOtp();

//     const interval = setInterval(() => {
//       setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   function maskEmail(email) {
//     const [name, domain] = email.split("@");
//     if (name.length <= 2) return "*@" + domain;
//     return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
//   }

//   const maskedEmail = maskEmail(email);

//   const sendOtp = async () => {
//     setCooldown(60);
//     try {
//       await fetch("/api/admin/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       toast.success("OTP sent");
//     } catch (err) {
//       toast.error("Failed to send OTP");
//       console.error(err);
//     }
//   };

//   const handleVerify = async () => {
//     const otpValue = otp.join("");
//     if (otpValue.length < 6) {
//       setError("Please enter the full 6-digit OTP");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/admin/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp: otpValue }),
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         localStorage.setItem("otp_verified", "true");
//         toast.success("OTP verified");
//         onSuccess?.();
//       } else {
//         setError("Invalid or expired OTP");
//       }
//     } catch (err) {
//       setError("Verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (value, index) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 5) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     const pasted = e.clipboardData.getData("text").trim();
//     if (/^\d{6}$/.test(pasted)) {
//       const digits = pasted.split("");
//       setOtp(digits);
//       digits.forEach((d, i) => {
//         if (inputRefs.current[i]) inputRefs.current[i].value = d;
//       });
//       inputRefs.current[5].focus();
//     }
//   };

//   return (
//     <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg w-full max-w-md mx-auto">
//       <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
//         Verify OTP
//       </h2>
//       <p className="text-sm text-gray-600 mb-4 text-center">
//         Enter the 6-digit code sent to{" "}
//         <span className="font-mono text-gray-800">{maskedEmail}</span>
//       </p>

//       {/* OTP Boxes */}
//       <div
//         className="flex justify-center gap-2 sm:gap-3 mb-4"
//         onPaste={handlePaste}
//       >
//         {otp.map((digit, index) => (
//           <input
//             key={index}
//             ref={(el) => (inputRefs.current[index] = el)}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             onChange={(e) => handleChange(e.target.value, index)}
//             onKeyDown={(e) => handleKeyDown(e, index)}
//             className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         ))}
//       </div>

//       {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

//       {/* Buttons */}
//       <div className="space-y-3">
//         <button
//           onClick={handleVerify}
//           disabled={loading}
//           className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>

//         <button
//           onClick={onCancel}
//           disabled={loading}
//           className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={sendOtp}
//           disabled={cooldown > 0}
//           className="w-full text-sm font-medium text-purple-600 hover:text-purple-700 transition disabled:text-gray-400 disabled:cursor-not-allowed"
//         >
//           {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
//         </button>
//       </div>
//     </div>
//   );
// }




"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Mail, AlertCircle, CheckCircle, XCircle, AlertTriangle } from "lucide-react"; 



export default function AdminOtpVerification({ email, onCancel, onSuccess }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    sendOtp();

    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  function maskEmail(email) {
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return "******@****"; // fallback if no email provided
    }

    const [name, domain] = email.split("@");
    if (name.length <= 2) return "*@" + domain;
    return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  }


  const maskedEmail = maskEmail(email);

  
  const sendOtp = async () => {
    setCooldown(60);
    try {
      await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      toast.custom(
        (t) => (
          <div
            className={`
              max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4
              transform transition-all duration-300 ease-in-out
              ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
            `}
          >
            <Mail className="text-green-500" size={20} />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              OTP sent successfully
            </p>
          </div>
        ),
        { duration: 2500, position: "top-right" }
      );
    } catch (err) {
      console.error(err);

      toast.custom(
        (t) => (
          <div
            className={`
              max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4
              transform transition-all duration-300 ease-in-out
              ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
            `}
          >
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Failed to send OTP
            </p>
          </div>
        ),
        { duration: 3000, position: "top-right" }
      );
    }
  };
  
  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the full 6-digit OTP");

      toast.custom(
        (t) => (
          <div
            className={`
              max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg 
              pointer-events-auto flex items-center gap-3 p-4
              transform transition-all duration-300 ease-in-out
              ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
              animate-shake
            `}
          >
            <XCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Please enter the full 6-digit OTP
            </p>
          </div>
        ),
        { duration: 2000, position: "top-right" }
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("otp_verified", "true");

        toast.custom(
          (t) => (
            <div
              className={`
                max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg 
                pointer-events-auto flex items-center gap-3 p-4
                transform transition-all duration-300 ease-in-out
                ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
              `}
            >
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                ✅ OTP verified successfully!
              </p>
            </div>
          ),
          { duration: 2000, position: "top-right" }
        );

        onSuccess?.();
      } else {
        setError("Invalid or expired OTP");

        toast.custom(
          (t) => (
            <div
              className={`
                max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg 
                pointer-events-auto flex items-center gap-3 p-4
                transform transition-all duration-300 ease-in-out
                ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
                animate-shake
              `}
            >
              <XCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Invalid or expired OTP
              </p>
            </div>
          ),
          { duration: 2000, position: "top-right" }
        );
      }
    } catch (err) {
      setError("Verification failed");

      toast.custom(
        (t) => (
          <div
            className={`
              max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg 
              pointer-events-auto flex items-center gap-3 p-4
              transform transition-all duration-300 ease-in-out
              ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
              animate-shake
            `}
          >
            <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              ⚠️ Verification failed, try again
            </p>
          </div>
        ),
        { duration: 2000, position: "top-right" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      digits.forEach((d, i) => {
        if (inputRefs.current[i]) inputRefs.current[i].value = d;
      });
      inputRefs.current[5].focus();
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
        Verify OTP
      </h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Enter the 6-digit code sent to{" "}
        <span className="font-mono text-gray-800">{maskedEmail}</span>
      </p>

      {/* OTP Boxes */}
      <div
        className="flex justify-center gap-2 sm:gap-3 mb-4"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-9 h-11 sm:w-10 sm:h-12 text-center text-base sm:text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        ))}
      </div>

      {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-orange-700 hover:bg-orange-800 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          onClick={sendOtp}
          disabled={cooldown > 0}
          className="w-full text-sm font-medium text-orange-600 hover:text-orange-700 transition disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
