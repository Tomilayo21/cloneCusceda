
// import { Outfit } from "next/font/google";
// import "./globals.css";
// import { AppContextProvider } from "@/context/AppContext";
// import { Toaster } from "react-hot-toast";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/context/ThemeContext";
// import connectDB from "@/config/db";
// import SettingsModel from "@/models/Settings";

// const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // This function runs at build time and on request if not cached
// export async function generateMetadata() {
//   try {
//     await connectDB();

//     // Ensure model is fully loaded and connection is established
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

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body className={`${outfit.className} antialiased text-gray-700`}>
//           <ThemeProvider>
//             <Toaster />
//             <AppContextProvider>{children}</AppContextProvider>
//           </ThemeProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }


























































// import { Outfit } from "next/font/google";
// import "./globals.css";
// import { AppContextProvider } from "@/context/AppContext";
// import { Toaster } from "react-hot-toast";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/context/ThemeContext";
// import connectDB from "@/config/db";
// import SettingsModel from "@/models/Settings";

// const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

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

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <ClerkProvider>
//       <html lang="en" suppressHydrationWarning>
//         <body className={`${outfit.className} antialiased`}>
//           <ThemeProvider>
//             <Toaster position="top-right" />
//             <AppContextProvider>{children}</AppContextProvider>
//           </ThemeProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }






















































// app/layout.tsx
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider, useAppContext } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import connectDB from "@/config/db";
import SettingsModel from "@/models/Settings";
import LayoutWrapper from '@/components/LayoutWrapper';

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

// Fetch site metadata from DB
export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await SettingsModel.findOne().lean();

    return {
      title: settings?.siteTitle || "Cusceda",
      description: settings?.siteDescription || "Innovative, Resilient, Growing",
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "Cusceda",
      description: "Innovative, Resilient, Growing",
    };
  }
}



// Root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.className} antialiased`}>
          <ThemeProvider>
            <AppContextProvider>
              <Toaster position="top-right" />
              <LayoutWrapper>{children}</LayoutWrapper>
            </AppContextProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}












































































































// import { cookies } from 'next/headers';
// import { Outfit } from "next/font/google";
// import "./globals.css";
// import { AppContextProvider } from "@/context/AppContext";
// import { Toaster } from "react-hot-toast";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/context/ThemeContext";
// import { appWithTranslation } from 'next-i18next';
// import { dir } from 'i18next';
// import connectDB from "@/config/db";
// import SettingsModel from "@/models/Settings";
// import { languages } from "@/i18n/settings"; // Your supported languages list
// import TranslationsProvider from "@/components/admin/TranslationsProvider";
// import { getServerTranslations } from "@/lib/getServerTranslations";

// const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

// export async function generateMetadata() {
//   try {
//     await connectDB();
//     const settings = await SettingsModel.findOne().lean();
//     return {
//       title: settings?.siteTitle || "Cusceda",
//       description: settings?.siteDescription || "Innovative, Resilient, Growing",
//     };
//   } catch {
//     return {
//       title: "Cusceda",
//       description: "Innovative, Resilient, Growing",
//     };
//   }
// }

// export default async function RootLayout({ children }: { children: React.ReactNode }) {
//   const lang = cookies().get('lang')?.value || 'en';

//   const translations = await getServerTranslations(lang, ['common']);

//   return (
//     <ClerkProvider>
//       <html lang={lang} dir={dir(lang)}>
//         <body className={`${outfit.className} antialiased text-gray-700`}>
//           <ThemeProvider>
//             <Toaster />
//             <AppContextProvider lang={lang}>
//               <TranslationsProvider namespaces={['common']} locale={lang} resources={translations}>
//                 {children}
//               </TranslationsProvider>
//             </AppContextProvider>
//           </ThemeProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }









































































































// import { Outfit } from "next/font/google";
// import "./globals.css";
// import { AppContextProvider } from "@/context/AppContext";
// import { Toaster } from "react-hot-toast";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/context/ThemeContext";
// import connectDB from "@/config/db";
// import SettingsModel from "@/models/Settings";
// import { dir } from "i18next";
// import { languages } from "@/i18n/settings"; 
// import { useTranslation } from "@/i18n"; 
// import { ReactNode } from "react";

// const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // This function runs at build time and on request if not cached
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

// export async function generateStaticParams() {
//   return languages.map((lng) => ({ lang: lng }));
// }

// export default function RootLayout({
//   children,
//   params,
// }: {
//   children: ReactNode;
//   params: { lang: string };
// }) {
//   const currentLang = params.lang;

//   return (
//     <ClerkProvider>
//       <html lang={currentLang} dir={dir(currentLang)}>
//         <body className={`${outfit.className} antialiased text-gray-700`}>
//           <ThemeProvider>
//             <Toaster />
//             <AppContextProvider>{children}</AppContextProvider>
//           </ThemeProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }
