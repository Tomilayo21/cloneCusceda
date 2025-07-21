// import { Outfit } from "next/font/google";
// import "./globals.css";
// import { AppContextProvider } from "@/context/AppContext";
// import { Toaster } from "react-hot-toast";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/context/ThemeContext";

// const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

// export const metadata = {
//   title: "Cusceda",
//   description: "Innovative, Resilient, Growing",
// };

// export default function RootLayout({ children }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body className={`${outfit.className} antialiased text-gray-700`} >
//           <ThemeProvider>
//             <Toaster />
//             <AppContextProvider>
//               {children}
//             </AppContextProvider>
//           </ThemeProvider>
//         </body>
//       </html>
//       </ClerkProvider>
//   );
// }


























import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import connectDB from "@/config/db";
import SettingsModel from "@/models/Settings";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

// This function runs at build time and on request if not cached
export async function generateMetadata() {
  try {
    await connectDB();

    // Ensure model is fully loaded and connection is established
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <ThemeProvider>
            <Toaster />
            <AppContextProvider>{children}</AppContextProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
