"use client";

import React, { useState, useEffect, useCallback } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, Heart, ShoppingCart, ShieldAlert } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react"; // ✅ NextAuth hook

import Signup from "@/components/Signup";
import SearchBar from "./Searchbar";
import AvatarMenu from "./AvatarMenu";

const Navbar = () => {
  const { getCartCount } = useAppContext();
  // const { user, logout } = useAuth(); // 👈 get current user + logout
  const { data: session, status } = useSession();
  const user = session?.user;

  const router = useRouter();
  const { theme } = useTheme();

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
        setLightLogoUrl(data.lightLogoUrl || null);
        setDarkLogoUrl(data.darkLogoUrl || null);
      } catch (err) {
        console.error("Failed to fetch logos", err);
      }
    };
    fetchLogos();
  }, []);

  const logoSrc =
    theme === "dark" ? darkLogoUrl || lightLogoUrl : lightLogoUrl || darkLogoUrl;

  const handleAdminClick = () => router.push("/admin");

  const handleLogout = () => {
    signOut();
    router.push("/");
  };


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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
          isScrolled
            ? theme === "dark"
              ? "bg-black/80 border-b border-gray-700 shadow-lg"
              : "bg-white/80 border-b border-gray-200 shadow-lg"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-16 lg:px-32">
          {/* Logo */}
          <img
            src={logoSrc || "/default-logo.png"}
            alt="logo"
            width={100}
            height={100}
            onClick={() => router.push("/")}
            className="cursor-pointer w-24 md:w-32 hover:scale-105 transition-transform duration-200"
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
            {mounted && user && (
              <Link
                href="/my-orders"
                className="px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-5 relative">
            {mounted && user?.role === "admin" && (
              <div
                onClick={handleAdminClick}
                className="flex items-center gap-1 bg-purple-700 text-white text-xs px-3 py-1 rounded-full cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-yellow-300" />
                <span>Super Admin</span>
              </div>
            )}

            <div className="w-52">
              <SearchBar />
            </div>

            {mounted &&
              (user ? (
                <>
                  <button
                    onClick={() => router.push("/favorites")}
                    className="relative hover:scale-110 hover:text-orange-600 transition-transform"
                  >
                    <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => router.push("/cart")}
                    className="relative hover:text-orange-600 hover:scale-110 transition-transform"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] rounded-full px-1.5 font-bold animate-bounce">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <AvatarMenu />
                </>
              ) : (
                <button
                  // onClick={() => setShowSignup((prev) => !prev)}
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
          <div className="flex md:hidden items-center gap-3">
            <SearchBar />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="hover:scale-110 transition-transform"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isMobile && (
          <div className="flex flex-col gap-3 px-6 pb-6 md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 animate-slide-down">
            {/* Common Links */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </Link>
            <Link
              href="/all-products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Products
            </Link>

            {/* Logged-in User Menu */}
            {mounted && user ? (
              <>
                <Link
                  href="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  My Orders
                </Link>
                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Favorites
                </Link>
                <button
                  onClick={() => {
                    router.push("/cart");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart ({getCartCount()})
                </button>
                <AvatarMenu />
              </>
            ) : (
              /* Not logged in: Sign In triggers modal */
              <button
                // onClick={() => {
                //   setShowSignup(true);
                //   setMobileMenuOpen(false);
                // }}
                onClick={() => router.push("/signup")}
                className="flex items-center gap-2 px-2 py-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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
