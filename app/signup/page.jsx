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
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    const navbar = document.getElementById("main-navbar");
    if (navbar) {
      const updateHeight = () => {
        const height = navbar.offsetHeight;
        document.documentElement.style.setProperty("--navbar-height", height + "px");
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);

      return () => window.removeEventListener("resize", updateHeight);
    }
  }, []);  

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex justify-center items-center pt-[calc(var(--navbar-height)+1rem)] bg-gray-50 dark:bg-gray-900 px-4 md:px-16 lg:px-32 py-16">
        {open && <Signup onClose={() => setOpen(false)} />}
      </main>

      <Footer />
    </div>
  );
}
