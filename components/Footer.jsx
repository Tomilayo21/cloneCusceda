"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();

  // Select logo based on theme
  const logoSrc = theme === "dark" ? "/cusceda___.png" : "/cusceda__.png";

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 dark:border-gray-600/50">
        {/* Logo & Description */}
        <div className="w-4/5 max-w-sm">
          <Image
            src={logoSrc}
            alt="Cusceda Logo"
            width={128}
            height={128}
            className="w-28 md:w-32 cursor-pointer"
            priority
          />
          <p className="mt-6 text-sm leading-relaxed">
            Cusceda is your go-to online shop for the latest electronics, fashion, and home essentials. 
            We offer great prices, fast shipping, and a simple, secure shopping experience. 
            Shop with us for quality products and exclusive deals delivered right to your door.
          </p>
        </div>

        {/* Company Links */}
        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-5 text-lg">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/" className="hover:underline transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-5 text-lg">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>📞 +234-902-1520-956</p>
              <p>✉️ cusceda@yahoo.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="py-4 text-center text-xs md:text-sm select-none">
        Copyright 2025 © Cusceda All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
