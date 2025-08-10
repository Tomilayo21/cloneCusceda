"use client";

import React, { useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const [logoUrl, setLogoUrl] = useState(null);
  const { theme } = useTheme();

  const [footerData, setFooterData] = useState({
    footerDescription: "",
    footerPhone: "",
    footerEmail: "",
    footerName: "",
  });

  useEffect(() => {
    const fetchFooter = async () => {
      const res = await fetch("/api/settings/footerdetails");
      const data = await res.json();
      setFooterData({
        footerDescription: data.footerDescription,
        footerPhone: data.footerPhone,
        footerEmail: data.footerEmail,
        footerName: data.footerName,

      });
    };
    fetchFooter();
  }, []);

  // Select logo based on theme
  const logoSrc = theme === "dark" ? "/cusceda___.png" : "/cusceda__.png";
  
  useEffect(() => {
      const fetchLogo = async () => {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setLogoUrl(data.logoUrl);
      };
  
      fetchLogo();
    }, []);

  // Automatically get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 dark:border-gray-600/50">
        {/* Logo & Description */}
        <div className="w-4/5 max-w-sm">

          <img
            src={logoUrl}
            alt="Logo"
            onClick={() => router.push('/')}
            className="cursor-pointer w-24 md:w-32"
          />
          <p className="mt-6 text-sm leading-relaxed">
            {footerData.footerDescription}
          </p>
        </div>

        {/* Company Links */}

        <div className="w-full md:w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-5 text-lg">Company</h2>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
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
              <li>
                <Link href="/return-policy" className="hover:underline transition">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:underline transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline transition">
                  FAQs
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
              <p>📞 {footerData.footerPhone}</p>
              <p>✉️ {footerData.footerEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="py-4 text-center text-xs md:text-sm select-none">
        Copyright {currentYear} © {footerData.footerName}. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
