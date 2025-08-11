"use client";

import React, { useState, useRef, useEffect } from "react";
import { assets, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Menu, X, Heart, Search } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Moon, Sun, ShieldCheck, ShieldAlert } from "lucide-react";
import SuperAdminUnlock from '@/components/admin/SuperAdminUnlock'; 
import AdminOtpVerification from '@/components/admin/AdminOtpVerification'; 
import SearchBar from "./Searchbar";

const Navbar = () => {
  const { isAdmin, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const searchButtonRef = useRef(null);
  const cartCount = getCartCount();
  const { theme, toggleTheme } = useTheme();
  const [promptPassword, setPromptPassword] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [lightLogoUrl, setLightLogoUrl] = useState(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState(null);


  

  // const handleClick = () => {
  //   if (!hasAccess) {
  //     setPromptPassword(true);
  //   } else {
  //     // ✅ Redirect to /admin
  //     router.push('/admin');
  //   }
  // };
  // const handleAdminClick = () => {
  //   setShowOtpPrompt(true);
  // };

  // useEffect(() => {
  //   const fetchLogo = async () => {
  //     const res = await fetch('/api/settings');
  //     const data = await res.json();
  //     setLogoUrl(data.logoUrl);
  //   };

  //   fetchLogo();
  // }, []);


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
    theme === "dark"
      ? darkLogoUrl || lightLogoUrl 
      : lightLogoUrl || darkLogoUrl; 


  const handleClick = () => {
    router.push('/admin');
  };

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (searchExpanded && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchExpanded]);

  // Collapse search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !searchButtonRef.current.contains(e.target)
      ) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sticky scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-transparent border-b border-gray-700 shadow-md bg-black ${
        isScrolled
          ? theme === "dark"
            ? "border-b border-gray-700 shadow-md bg-black"
            : "border-b border-transparent shadow-md bg-white"
          : "bg-transparent"
      }`}
    >
      {/* <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-transparent border-b border-gray-700 shadow-md bg-black`}
      > */}
      <div className="flex items-center justify-between px-4 py-3 md:px-16 lg:px-32">
        {/* Logo */}
        <img
          src={logoSrc}
          alt="logo"
          width={100}
          height={100}
          onClick={() => router.push("/")}
          className="cursor-pointer w-24 md:w-32"
        />


        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-center gap-8 flex-1 px-8">
          <Link href="/" className="hover:bg-[#EBEDED] p-2 rounded">Home</Link>
          <Link href="/all-products" className="hover:bg-[#EBEDED] p-2 rounded">Products</Link>
          {user && <Link href="/my-orders" className="hover:bg-[#EBEDED] p-2 rounded">My Orders</Link>}
        </div>

        {/* Right side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    onClick={handleClick}
                    className="flex items-center gap-1 bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-purple-800 transition"
                  >
                    <ShieldAlert className="w-3 h-3 text-yellow-300" />
                    <span>Super Admin</span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-black text-white text-xs px-2 py-1 rounded shadow-md z-50"
                    sideOffset={5}
                  >
                    You have full access to all admin features.
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}

          {/* {isAdmin && (
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    onClick={handleClick}
                    className="flex items-center gap-1 bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-purple-800 transition"
                  >
                    <ShieldAlert className="w-3 h-3 text-yellow-300" />
                    <span>Super Admin</span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-black text-white text-xs px-2 py-1 rounded shadow-md z-50"
                    sideOffset={5}
                  >
                    You have full access to all admin features.
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )} */}

          {/* {promptPassword && !hasAccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <SuperAdminUnlock
              onSuccess={() => {
                setHasAccess(true);
                setPromptPassword(false);
                router.push('/admin'); // ✅ Optional: auto-redirect after success
              }}
              onCancel={() => setPromptPassword(false)}
            />
            </div>
          )} */}
















{/*           {isAdmin && (
            <>
              <div
                onClick={handleAdminClick}
                className="flex items-center gap-1 bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-purple-800 transition"
              >
                <ShieldAlert className="w-3 h-3 text-yellow-300" />
                <span>Super Admin</span>
              </div>

              {showOtpPrompt && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                  <AdminOtpVerification
                    email={user.emailAddresses[0].emailAddress}
                    onCancel={() => setShowOtpPrompt(false)}
                  />
                </div>
              )}
            </>
          )} */}


          {/* Search */}          
          <div className="mt-2 sm:mt-0 w-full sm:w-auto">
            <SearchBar />
          </div>

          {/* Favorites */}
          {user && (
            <button onClick={() => router.push("/favorites")} className="relative">
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
          )}

          {/* Cart */}
          {user && (
            <button onClick={() => router.push("/cart")} className="relative">
              <CartIcon className="w-4 h-4 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full px-1 font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Auth */}
          {user ? (
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-5 h-5" } }} />
          ) : (
            <button onClick={openSignIn} className="flex items-center gap-2">
              <Image src={assets.user_icon} alt="user" className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* <button
          onClick={toggleTheme}
          className="hidden md:block p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-yellow-400" />
          ) : (
            <Moon className="w-4 h-4 text-gray-700" />
          )}
        </button> */}

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-2">
          {/* Search */}

          <SearchBar />

          {isAdmin && (
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    onClick={handleClick}
                    className="flex items-center gap-1 bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-purple-800 transition"
                  >
                    <ShieldAlert className="w-3 h-3 text-yellow-300" />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-black text-white text-xs px-2 py-1 rounded shadow-md z-50"
                    sideOffset={5}
                  >
                    You have full access to all admin features.
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
{/*           {promptPassword && !hasAccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <SuperAdminUnlock
              onSuccess={() => {
                setHasAccess(true);
                setPromptPassword(false);
                router.push('/admin'); // ✅ Optional: auto-redirect after success
              }}
              onCancel={() => setPromptPassword(false)}
            />
            </div>
          )} */}

{/*           {isAdmin && (
            <>
              <div
                onClick={handleAdminClick}
                className="flex items-center gap-1 bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-purple-800 transition"
              >
                <ShieldAlert className="w-3 h-3 text-yellow-300" />
              </div>

              {showOtpPrompt && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                  <AdminOtpVerification
                    email={user.emailAddresses[0].emailAddress}
                    onCancel={() => setShowOtpPrompt(false)}
                  />
                </div>
              )}
            </>
          )}
 */}
          <button onClick={() => setMobileMenuOpen((prev) => !prev)} aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && isMobile && (
        <div className="flex flex-col gap-4 px-6 pb-4 md:hidden bg-white dark:bg-black">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1 mt-4"
          >
            Home
          </Link>
          <Link
            href="/all-products"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1"
          >
            Products
          </Link>
          {/* <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1"
          >
            Contact
          </Link> */}

          {user && (
            <>
              <Link
                href="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1"
              >
                My Orders
              </Link>
              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1"
              >
                Favorites
              </Link>
              <button
                onClick={() => {
                  router.push("/cart");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1 text-gray-700 dark:text-white"
              >
                <CartIcon className="w-4 h-4" />
                Cart ({cartCount})
              </button>
            </>
          )}

          {user ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "w-5 h-5" } }}
            />
          ) : (
            <button
              onClick={() => {
                openSignIn();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-gray-700 dark:text-white hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1"
            >
              <Image src={assets.user_icon} alt="user" className="w-4 h-4" />
              Sign In
            </button>
          )}

          {/* <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-700 dark:text-white hover:bg-[#EBEDED] dark:hover:bg-gray-800 rounded px-2 py-1"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-yellow-400" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-gray-700" />
                Dark Mode
              </>
            )}
          </button> */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
