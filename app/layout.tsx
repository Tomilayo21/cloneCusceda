'use client'; 
import { useEffect, useState } from 'react';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import LayoutWrapper from '@/components/LayoutWrapper';
import AnalyticsTracker from '@/components/admin/AnalyticsTracker';
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
          <SessionProvider> 
            <AppContextProvider>
              <Toaster position="top-right" />
              <AnalyticsTracker>
                <LayoutWrapper>{children}</LayoutWrapper>
              </AnalyticsTracker>
            </AppContextProvider>
          </SessionProvider>
      </body>
    </html>
  );
}
