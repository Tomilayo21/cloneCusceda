// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { currentUser } from '@clerk/nextjs';

// export default function AdminOtpVerification({ email, onCancel }) {
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const [cooldown, setCooldown] = useState(0);
//   const [loading, setLoading] = useState(false); 
//   const router = useRouter();

//   useEffect(() => {
//     sendOtp();

//     const interval = setInterval(() => {
//       setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const sendOtp = async () => {
//     setCooldown(60);
//     await fetch('/api/admin/send-otp', {
//       method: 'POST',
//       body: JSON.stringify({ email }),
//     });
//   };

//   const handleVerify = async () => {
//     const res = await fetch('/api/admin/verify-otp', {
//       method: 'POST',
//       body: JSON.stringify({ email, otp }),
//     });

//     if (res.ok) {
//       localStorage.setItem('otp_verified', 'true');
//       router.push('/admin');
//     } else {
//       setError('Invalid or expired OTP');
//     }
//   };

//   return (
//     <div className="p-4 bg-white border rounded shadow-md w-full max-w-sm">
//         <h2 className="text-lg font-semibold mb-2">Enter OTP</h2>

//         <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             placeholder="6-digit OTP"
//             className="w-full p-2 border rounded mb-2"
//         />

//         {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

//         <button
//             onClick={handleVerify}
//             disabled={loading}
//             className="w-full bg-purple-700 text-white py-1 rounded hover:bg-purple-800 transition mb-2"
//         >
//             {loading ? 'Verifying...' : 'Verify OTP'}
//         </button>

//         <button
//             onClick={onCancel}
//             disabled={loading}
//             className="w-full bg-gray-200 text-gray-800 py-1 rounded hover:bg-gray-300 transition mb-2"
//         >
//             Cancel
//         </button>

//         <button
//             onClick={sendOtp}
//             disabled={cooldown > 0}
//             className="w-full text-sm text-purple-600 disabled:text-gray-400"
//         >
//             {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
//         </button>
//     </div>

//   );
// }













"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminOtpVerification({ email, onCancel, onSuccess }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const maskedEmail = maskEmail(email);

  useEffect(() => {
    sendOtp();

    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function maskEmail(email) {
    const [name, domain] = email.split("@");
    if (name.length <= 2) return "*@"+domain;
    return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  }

  const sendOtp = async () => {
    setCooldown(60);
    try {
      await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      toast.success("OTP sent");
    } catch (err) {
      toast.error("Failed to send OTP");
      console.error(err);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("otp_verified", "true");
        toast.success("OTP verified");
        onSuccess?.();
      } else {
        setError('Invalid or expired OTP');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow-md w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-2">Enter OTP sent to <span className="font-mono">{maskedEmail}</span></h2>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="6-digit OTP"
        className="w-full p-2 border rounded mb-2"
      />

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-purple-700 text-white py-1 rounded hover:bg-purple-800 transition mb-2"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <button
        onClick={onCancel}
        disabled={loading}
        className="w-full bg-gray-200 text-gray-800 py-1 rounded hover:bg-gray-300 transition mb-2"
      >
        Cancel
      </button>

      <button
        onClick={sendOtp}
        disabled={cooldown > 0}
        className="w-full text-sm text-purple-600 disabled:text-gray-400"
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
      </button>
    </div>
  );
}
