"use client";

import React, { useState, useRef, useEffect } from "react";
import { assets, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Moon, Sun, ShieldCheck, ShieldAlert } from "lucide-react";

const Navbar = () => {
  const { isAdmin, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const searchButtonRef = useRef(null);
  const cartCount = getCartCount();
  const { theme, toggleTheme } = useTheme();

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

  // Search submission
  const handleSearch = () => {
    if (inputValue.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(inputValue.trim())}`);
      setSearchExpanded(false);
    } else {
      setSearchExpanded((prev) => !prev);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Determine logo src based on theme
  const logoSrc = theme === "dark" ? "/cusceda___.png" : "/cusceda__.png";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? theme === "dark"
            ? "border-b border-gray-700 shadow-md bg-black"
            : "border-b border-transparent shadow-md bg-white"
          : "bg-transparent"
      }`}
    >
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
          {/* <Link href="/about" className="hover:bg-[#EBEDED] p-2 rounded">About Us</Link>
          <Link href="/contact" className="hover:bg-[#EBEDED] p-2 rounded">Contact</Link> */}
          {user && <Link href="/my-orders" className="hover:bg-[#EBEDED] p-2 rounded">My Orders</Link>}
        </div>

        {/* Right side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="flex items-center gap-1 bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full cursor-default">
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

          {/* Search */}
          <div className="relative flex items-center">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setSearchExpanded(true)}
              onKeyDown={handleKeyDown}
              className={`transition-all duration-300 bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 ${
                searchExpanded ? "opacity-100 w-48" : "opacity-0 w-0 px-0"
              }`}
            />
            <button
              ref={searchButtonRef}
              onClick={handleSearch}
              className="ml-1"
              aria-label="Search"
            >
              <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
            </button>
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
          <div className="relative flex items-center">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setSearchExpanded(true)}
              onKeyDown={handleKeyDown}
              className={`transition-all duration-300 bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 ${
                searchExpanded ? "opacity-100 w-40" : "opacity-0 w-0 px-0"
              }`}
            />
            <button
              ref={searchButtonRef}
              onClick={handleSearch}
              className="ml-1"
              aria-label="Search"
            >
              <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
            </button>
          </div>

          {isAdmin && (
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="flex items-center gap-1 bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full cursor-default">
                    <ShieldAlert className="w-3 h-3 text-yellow-300" />
                    {/* <span>Super Admin</span> */}
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
