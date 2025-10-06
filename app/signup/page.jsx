// "use client";

// import React from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Signup from "@/components/Signup";
// import { useState } from "react";

// export default function SignupPage() {
//   const [open, setOpen] = useState(true);

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navbar */}
//       <Navbar />

//       {/* Main Signup Section */}
//       <main className="flex-1 flex justify-center items-center bg-gray-50 dark:bg-gray-900 px-4 md:px-16 lg:px-32 py-16">
//         {/* <Signup /> */}
//         <div>
//           {open && <Signup onClose={() => setOpen(false)} />}
//           <button onClick={() => setOpen(false)}></button>
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }























"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Signup from "@/components/Signup";

export default function SignupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect logged-in users to home
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If not logged in, show signup
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex justify-center items-center bg-gray-50 dark:bg-gray-900 px-4 md:px-16 lg:px-32 py-16">
        {open && <Signup onClose={() => setOpen(false)} />}
      </main>

      <Footer />
    </div>
  );
}
