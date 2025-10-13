"use client";

import React, { useState, useEffect, useCallback } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, } from "lucide-react";
import { useSession } from "next-auth/react"; 
import { motion, AnimatePresence } from "framer-motion";

import Signup from "@/components/Signup";
import SearchBar from "./Searchbar";
import AvatarMenu from "./AvatarMenu";

const Navbar = () => {
  const { getCartCount } = useAppContext();

  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { themeMode } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [signupMode, setSignupMode] = useState("signup");
  const [lightLogoUrl, setLightLogoUrl] = useState(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState(null);

  // Prevent SSR flash
  useEffect(() => setMounted(true), []);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch logos
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        console.log("Fetched settings:", data);
        setLightLogoUrl(data.settings?.lightLogoUrl || data.lightLogoUrl || null);
        setDarkLogoUrl(data.settings?.darkLogoUrl || data.darkLogoUrl || null);
      } catch (err) {
        console.error("Failed to fetch logos", err);
      }
    };
    fetchLogos();
  }, []);

  const logoSrc = themeMode === "dark" ? darkLogoUrl || lightLogoUrl : lightLogoUrl || darkLogoUrl;

  const handleAdminClick = () => router.push("/admin");


  // Close modal on ESC
  const handleEsc = useCallback(
    (e) => {
      if (e.key === "Escape") setShowSignup(false);
    },
    [setShowSignup]
  );

  useEffect(() => {
    if (showSignup) window.addEventListener("keydown", handleEsc);
    else window.removeEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showSignup, handleEsc]);

  const cartCount = getCartCount();

  if (!logoSrc) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
          isScrolled
            ? themeMode === "dark"
              ? "bg-black/80 border-b border-gray-700 shadow-lg"
              : "bg-white/80 border-b border-gray-200 shadow-lg"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-16 lg:px-32">
          {/* Logo */}
          <img
            key={themeMode}
            src={logoSrc || "/default-logo.png"}
            alt="logo"
            width={100}
            height={100}
            onClick={() => router.push("/")}
            className="cursor-pointer w-24 md:w-32 hidden md:block hover:scale-105 transition-transform duration-200"
          />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center gap-8 flex-1 px-8">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Home
            </Link>
            <Link
              href="/all-products"
              className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Contact
            </Link>

          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3 relative">
            <div className="">
              <SearchBar />
            </div>

            {mounted &&
              (user ? (
                <>
                  <AvatarMenu />
                </>
              ) : (
                <button
                  onClick={() => router.push("/signup")}
                  className="flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <Image src={assets.user_icon} alt="user" className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">
                    Sign In
                  </span>
                </button>
              ))}
          </div>

          {/* Mobile Menu */}

          <div className="flex md:hidden items-center justify-between w-full px-4">
            {/* Left: Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="hover:scale-110 transition-transform relative w-6 h-6 flex items-center justify-center"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="absolute"
                  >
                    <X className="font-thin text-gray-800 dark:text-gray-100" size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="absolute"
                  >
                    <Menu className="font-thin text-gray-800 dark:text-gray-100" size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Center: Logo */}
            <img
              key={themeMode}
              src={logoSrc || "/default-logo.png"}
              alt="logo"
              width={100}
              height={100}
              onClick={() => router.push("/")}
              className="cursor-pointer w-24 md:w-32 hover:scale-105 transition-transform block md:hidden"
            />

            {/* Right: Search & Cart */}
            <div className="flex items-center gap-3">
              <SearchBar />
              {mounted && user ? (
                <button
                  onClick={() => router.push("/cart")}
                  className="relative hover:text-orange-600 hover:scale-110 transition-transform"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white dark:bg-white dark:text-black text-[11px] rounded-full px-1.5">
                      {cartCount}
                    </span>
                  )}
                </button>
              ) : null}
            </div>
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isMobile && (
          <div className="flex flex-col gap-3 px-6 pb-6 md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 animate-slide-down">
            {/* Common Links */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 mt-2 font-thin rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </Link>
            <Link
              href="/all-products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 font-thin rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Products
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 font-thin rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 font-thin rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Contact
            </Link>
            {mounted && user ? (
              <>
                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-2 font-thin rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Favorites
                </Link>
                {mounted && user?.role === "admin" && (
                  <div
                    onClick={handleAdminClick}
                    className="flex items-center px-2 py-2 text-black dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition font-thin cursor-pointer"
                  >
                    <span className="">Admin</span>
                  </div>
                )}
                <AvatarMenu />
              </>
            ) : (
              <button
                onClick={() => router.push("/signup")}
                className="flex items-center gap-2 px-2 py-2 rounded-md font-thin text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Image src={assets.user_icon} alt="user" className="w-5 h-5" />
                Sign In
              </button>
            )}
          </div>
        )}
        
      </nav>

      {/* Signup Modal */}
      {showSignup && mounted && (
        <Signup onClose={() => setShowSignup(false)} mode={signupMode} />
      )}
    </>
  );
};

export default Navbar;







// components/Navbar.jsx
// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="sticky top-0 bg-white shadow z-50 py-3 px-6 flex justify-between items-center">
//       {/* Logo */}
//       <div className="text-2xl font-bold cursor-pointer">
//         <Link href="/">MyStore</Link>
//       </div>

//       {/* Navigation Links */}
//       <ul className="flex space-x-6">
//         <li>
//           <Link
//             href="/"
//             className="hover:text-orange-500 transition-colors"
//           >
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link
//             href="/all-products"
//             className="hover:text-orange-500 transition-colors"
//           >
//             Products
//           </Link>
//         </li>
//         <li>
//           <Link
//             href="/categories"
//             className="hover:text-orange-500 transition-colors"
//           >
//             Categories
//           </Link>
//         </li>
//         <li>
//           <Link
//             href="/contact"
//             className="hover:text-orange-500 transition-colors"
//           >
//             Contact
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }
