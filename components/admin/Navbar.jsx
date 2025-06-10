import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // ✅ Client-side hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ⛔️ Skip SSR render

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
        <img
          src="/cusceda.png"
          alt="logo"
          width={100}
          height={100}
          onClick={() => router.push("/")}
          className="cursor-pointer w-24 md:w-32"
        />
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          {theme === "dark" ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-gray-700" />}
        </button>
        <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded text-xs sm:text-sm'>
          Only Admins Can See This
        </button>
      </div>
    </div>
  );
};

export default Navbar;
