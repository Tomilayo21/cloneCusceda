// import { Outfit } from "next/font/google";
// import "./globals.css";
// import { AppContextProvider } from "@/context/AppContext";
// import { Toaster } from "react-hot-toast";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/context/ThemeContext";
// import connectDB from "@/config/db";
// import SettingsModel from "@/models/Settings";
// import LayoutWrapper from "@/components/LayoutWrapper";
// import AnalyticsTracker from "@/components/admin/AnalyticsTracker";


// const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // Fetch site metadata from DB
// export async function generateMetadata() {
//   try {
//     await connectDB();
//     const settings = await SettingsModel.findOne().lean();

//     return {
//       title: settings?.siteTitle || "Cusceda",
//       description: settings?.siteDescription || "Innovative, Resilient, Growing",
//     };
//   } catch (error) {
//     console.error("Metadata fetch failed:", error);
//     return {
//       title: "Cusceda",
//       description: "Innovative, Resilient, Growing",
//     };
//   }
// }

// // Root layout
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     // <ClerkProvider>
//     //   <html lang="en" suppressHydrationWarning>
//     //     <body className={`${outfit.className} antialiased`}>
//     //       <ThemeProvider>
//     //         <AppContextProvider>
//     //           <Toaster position="top-right" />
//     //           <AnalyticsTracker>
//     //             <LayoutWrapper>{children}</LayoutWrapper>
//     //           </AnalyticsTracker>
//     //         </AppContextProvider>
//     //       </ThemeProvider>
//     //     </body>
//     //   </html>
//     // </ClerkProvider>
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${outfit.className} antialiased`}>
//         <ThemeProvider>
//           <AppContextProvider>
//             <Toaster position="top-right" />
//             <AnalyticsTracker>
//               <LayoutWrapper>{children}</LayoutWrapper>
//             </AnalyticsTracker>
//           </AppContextProvider>
//         </ThemeProvider>
//       </body>
//     </html>

//   );
// }



















'use client'; 
import { useEffect, useState } from 'react';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import AnalyticsTracker from '@/components/admin/AnalyticsTracker';
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${mounted ? outfit.className : ""}`}>
        <ThemeProvider>
          <AppContextProvider>
            <SessionProvider>  {/* 👈 wrap here */}
              <Toaster position="top-right" />
              <AnalyticsTracker>
                <LayoutWrapper>{children}</LayoutWrapper>
              </AnalyticsTracker>
            </SessionProvider>
          </AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
