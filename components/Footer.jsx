// "use client";

// import React, { useState, useEffect} from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useTheme } from "@/context/ThemeContext";
// import { Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

// const Footer = () => {
//   const [logoUrl, setLogoUrl] = useState(null);
//   const { theme } = useTheme();
//   const [lightLogoUrl, setLightLogoUrl] = useState(null);
//   const [darkLogoUrl, setDarkLogoUrl] = useState(null);

//   const [footerData, setFooterData] = useState({
//     footerDescription: "",
//     footerPhone: "",
//     footerEmail: "",
//     footerName: "",
//   });

//   useEffect(() => {
//     const fetchLogos = async () => {
//       try {
//         const res = await fetch("/api/settings");
//         const data = await res.json();
//         setLightLogoUrl(data.lightLogoUrl || null);
//         setDarkLogoUrl(data.darkLogoUrl || null);
//       } catch (err) {
//         console.error("Failed to fetch logos", err);
//       }
//     };

//     fetchLogos();
//   }, []);

//   const logoSrc =
//     theme === "dark"
//       ? darkLogoUrl || lightLogoUrl 
//       : lightLogoUrl || darkLogoUrl; 

  

//   useEffect(() => {
//     const fetchFooter = async () => {
//       const res = await fetch("/api/settings/footerdetails");
//       const data = await res.json();
//       setFooterData({
//         footerDescription: data.footerDescription,
//         footerPhone: data.footerPhone,
//         footerEmail: data.footerEmail,
//         footerName: data.footerName,
//         socialLinks: data.socialLinks || [],       

//       });
//     };
//     fetchFooter();
//   }, []);

//   // Select logo based on theme
//   useEffect(() => {
//     if (theme === "dark") {
//       setLogoUrl(darkLogoUrl || lightLogoUrl);
//     } else {
//       setLogoUrl(lightLogoUrl || darkLogoUrl);
//     }
//   }, [theme, lightLogoUrl, darkLogoUrl]);

//   // Automatically get the current year
//   const currentYear = new Date().getFullYear();

//   return (

//     <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-400">
//       {/* Top Section */}
//       <div className="flex flex-col md:flex-row items-start justify-between px-6 md:px-16 lg:px-32 gap-12 py-16 border-b border-gray-200/70 dark:border-gray-800/70">
        
//         {/* Logo & Description */}
//         <div className="w-full md:w-1/3 space-y-6">
//           <img
//             src={logoSrc}
//             alt="Logo"
//             onClick={() => router.push('/')}
//             className="cursor-pointer w-28 md:w-36 hover:opacity-90 transition"
//           />
//           <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
//             {footerData.footerDescription}
//           </p>
//         </div>

//         {/* Links Grid */}
//         <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-10">
//           {/* Company Links */}
//           <div>
//             <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-5 text-lg tracking-wide">
//               Company
//             </h2>
//             <ul className="space-y-2 text-sm">
//               {[
//                 { name: "Home", href: "/" },
//                 { name: "About Us", href: "/about" },
//                 { name: "Contact Us", href: "/contact" },
//                 { name: "Privacy Policy", href: "/privacy-policy" },
//                 { name: "Return Policy", href: "/return-policy" },
//                 { name: "Terms & Conditions", href: "/terms-and-conditions" },
//                 { name: "FAQs", href: "/faq" },
//               ].map((link, i) => (
//                 <li key={i}>
//                   <Link
//                     href={link.href}
//                     className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
//                   >
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-5 text-lg tracking-wide">
//               Get in Touch
//             </h2>
//             <div className="space-y-3 text-sm">
//               <p className="flex items-center gap-2">
//                 <Phone size={16} className="text-orange-600" />
//                 {footerData.footerPhone}
//               </p>
//               <p className="flex items-center gap-2">
//                 <Mail size={16} className="text-orange-600" />
//                 {footerData.footerEmail}
//               </p>
//             </div>
//           </div>

//           {/* Social Media */}
//           <div>
//             <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-5 text-lg tracking-wide">
//               Follow Us
//             </h2>
//             <div className="flex flex-col gap-3 text-sm">
//               {footerData.socialLinks?.map((link, index) => {
//                 const url = link.url?.startsWith("http://") || link.url?.startsWith("https://")
//                   ? link.url
//                   : `https://${link.url}`;

//                 return (
//                   <a
//                     key={index}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition"
//                   >
//                     <img
//                       src={link.iconUrl}
//                       alt={link.platform}
//                       className="w-5 h-5 object-contain"
//                     />
//                     <span>{link.platform}</span>
//                   </a>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="py-5 px-6 md:px-16 lg:px-32 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-gray-500 dark:text-gray-500">
//         <p className="text-center md:text-left">
//           © {currentYear} {footerData.footerName}. All Rights Reserved.
//         </p>

//         {/* Social Icons Row (Optional for global icons, separate from platform text links) */}
//         <div className="flex items-center gap-4 mt-4 md:mt-0">
//           {footerData.socialLinks?.map((link, index) => {
//             const url = link.url?.startsWith("http://") || link.url?.startsWith("https://")
//               ? link.url
//               : `https://${link.url}`;

//             return (
//               <a
//                 key={index}
//                 href={url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:text-orange-600 dark:hover:text-orange-400 transition"
//               >
//                 <img
//                   src={link.iconUrl}
//                   alt={link.platform}
//                   className="w-5 h-5 object-contain"
//                 />
//               </a>
//             );
//           })}
//         </div>

//       </div>
//     </footer>

//   );
// };

// export default Footer;




























"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Phone, Mail, ChevronDown } from "lucide-react";

// ✅ Reusable Section with Accordion
const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 md:border-none pb-4 md:pb-0">
      {/* Section Header */}
      <button
        className="w-full flex items-center justify-between md:justify-start md:cursor-default text-left font-semibold text-gray-900 dark:text-gray-100 text-lg tracking-wide"
        onClick={() => setOpen(!open)}
      >
        {title}
        {/* Show chevron only on mobile */}
        <ChevronDown
          className={`w-5 h-5 md:hidden transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Section Content */}
      <div
        className={`mt-3 md:mt-5 space-y-2 text-sm transition-all duration-300 overflow-hidden ${
          open
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 md:max-h-full md:opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default function Footer() {
  const { theme } = useTheme();
  const [logoUrl, setLogoUrl] = useState(null);
  const [lightLogoUrl, setLightLogoUrl] = useState(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState(null);

  const [footerData, setFooterData] = useState({
    footerDescription: "",
    footerPhone: "",
    footerEmail: "",
    footerName: "",
    socialLinks: [],
  });

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

  // Select logo based on theme
  useEffect(() => {
    if (theme === "dark") {
      setLogoUrl(darkLogoUrl || lightLogoUrl);
    } else {
      setLogoUrl(lightLogoUrl || darkLogoUrl);
    }
  }, [theme, lightLogoUrl, darkLogoUrl]);

  // Fetch footer content
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

  // Current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-400">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start justify-between px-6 md:px-16 lg:px-32 gap-12 py-8 md:py-16 border-b border-gray-200/70 dark:border-gray-800/70">
        {/* Logo & Description */}
        <div className="w-full md:w-1/3 space-y-6">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="cursor-pointer w-28 md:w-36 hover:opacity-90 transition"
            />
          )}
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {footerData.footerDescription}
          </p>
        </div>

        {/* Links Grid */}
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Company Links */}
          <FooterSection title="Company">
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Return Policy", href: "/return-policy" },
                { name: "Terms & Conditions", href: "/terms-and-conditions" },
                { name: "FAQs", href: "/faq" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection title="Get in Touch">
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-orange-600" />
                {footerData.footerPhone}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-orange-600" />
                {footerData.footerEmail}
              </p>
            </div>
          </FooterSection>

          {/* Social Media */}
          <FooterSection title="Follow Us">
            <div className="flex flex-col gap-3 text-sm">
              {footerData.socialLinks?.map((link, index) => {
                const url =
                  link.url?.startsWith("http://") || link.url?.startsWith("https://")
                    ? link.url
                    : `https://${link.url}`;
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition"
                  >
                    <img
                      src={link.iconUrl}
                      alt={link.platform}
                      className="w-5 h-5 object-contain"
                    />
                    <span>{link.platform}</span>
                  </a>
                );
              })}
            </div>
          </FooterSection>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-4 md:py-5 px-6 md:px-16 lg:px-32 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-gray-500 dark:text-gray-500">
        <p className="text-center md:text-left">
          © {currentYear} {footerData.footerName}. All Rights Reserved.
        </p>

        {/* Social Icons Row */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {footerData.socialLinks?.map((link, index) => {
            const url =
              link.url?.startsWith("http://") || link.url?.startsWith("https://")
                ? link.url
                : `https://${link.url}`;
            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 dark:hover:text-orange-400 transition"
              >
                <img
                  src={link.iconUrl}
                  alt={link.platform}
                  className="w-5 h-5 object-contain"
                />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
