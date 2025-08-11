"use client";

import React, { useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const [logoUrl, setLogoUrl] = useState(null);
  const { theme } = useTheme();
  const [lightLogoUrl, setLightLogoUrl] = useState(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState(null);

  const [footerData, setFooterData] = useState({
    footerDescription: "",
    footerPhone: "",
    footerEmail: "",
    footerName: "",
  });

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

  

  useEffect(() => {
    const fetchFooter = async () => {
      const res = await fetch("/api/settings/footerdetails");
      const data = await res.json();
      setFooterData({
        footerDescription: data.footerDescription,
        footerPhone: data.footerPhone,
        footerEmail: data.footerEmail,
        footerName: data.footerName,
        socialLinks: data.socialLinks || [],       

      });
    };
    fetchFooter();
  }, []);

  // Select logo based on theme
  useEffect(() => {
    if (theme === "dark") {
      setLogoUrl(darkLogoUrl || lightLogoUrl);
    } else {
      setLogoUrl(lightLogoUrl || darkLogoUrl);
    }
  }, [theme, lightLogoUrl, darkLogoUrl]);

  // Automatically get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 dark:border-gray-600/50">
        {/* Logo & Description */}
        <div className="w-4/5 max-w-sm">
          <img
            src={logoSrc}
            alt="Logo"
            onClick={() => router.push('/')}
            className="cursor-pointer w-24 md:w-32"
          />
          <p className="mt-6 text-sm leading-relaxed">{footerData.footerDescription}</p>
        </div>

        {/* Container wrapping the last 3 sections in a grid for mobile */}
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-6 md:flex md:justify-center md:gap-10">
          {/* Company Links */}
          <div>
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-5 text-lg">Company</h2>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline transition">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline transition">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:underline transition">Return Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:underline transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline transition">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-5 text-lg">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>📞 {footerData.footerPhone}</p>
              <p>✉️ {footerData.footerEmail}</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-5 text-lg">Follow us</h2>
            <div className="flex flex-col gap-2 text-sm">
              {footerData.socialLinks?.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <img src={link.iconUrl} alt={link.platform} className="w-5 h-5 object-contain" />
                  <span>{link.platform}</span>
                </a>
              ))}
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
