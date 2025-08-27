
// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { assets } from "@/assets/assets"; // Adjust this path if needed
// import { useAppContext } from "@/context/AppContext"; // For accessing products

// export default function SearchBar() {
//   const router = useRouter();
//   const searchRef = useRef(null);
//   const containerRef = useRef(null);

//   const [inputValue, setInputValue] = useState("");
//   const [searchExpanded, setSearchExpanded] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);

//   const { products } = useAppContext();

//   const productNames = products?.map((p) => p.name) || [];

//   const filteredSuggestions = productNames.filter(
//     (item) =>
//       item.toLowerCase().includes(inputValue.toLowerCase()) &&
//       item.toLowerCase() !== inputValue.toLowerCase()
//   );

//   useEffect(() => {
//     const stored = localStorage.getItem("recentSearches");
//     if (stored) {
//       setRecentSearches(JSON.parse(stored));
//     }
//   }, []);

//   const handleSearch = (customValue) => {
//     const search = (customValue ?? inputValue).trim();
//     if (search) {
//       const updatedRecent = [
//         search,
//         ...recentSearches.filter((s) => s !== search),
//       ].slice(0, 5);
//       setRecentSearches(updatedRecent);
//       localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));

//       router.push(`/all-products?search=${encodeURIComponent(search)}`);
//       setSearchExpanded(false);
//       setShowDropdown(false);
//     } else {
//       setSearchExpanded(true); // Expand on empty input click
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   const handleClickOutside = (e) => {
//     if (containerRef.current && !containerRef.current.contains(e.target)) {
//       setShowDropdown(false);
//       setSearchExpanded(false); // Collapse on outside click
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleDeleteRecent = (item) => {
//     const updated = recentSearches.filter((s) => s !== item);
//     setRecentSearches(updated);
//     localStorage.setItem("recentSearches", JSON.stringify(updated));
//   };

//   const clearAll = () => {
//     setRecentSearches([]);
//     localStorage.removeItem("recentSearches");
//   };

//   return (
//     <div className="relative flex items-center" ref={containerRef}>
//       <div className="relative">
//         <input
//           ref={searchRef}
//           type="text"
//           placeholder="Search..."
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onFocus={() => {
//             setSearchExpanded(true);
//             setShowDropdown(true);
//           }}
//           onBlur={() => {
//             setTimeout(() => setShowDropdown(false), 200);
//           }}
//           onKeyDown={handleKeyDown}
//           className={`transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full py-1 pr-8 pl-4 text-sm text-gray-700 dark:text-gray-100 ${
//             searchExpanded ? "opacity-100 w-48" : "opacity-0 w-0 pl-0 pr-0"
//           }`}
//         />
//         <button
//           onClick={() => handleSearch()}
//           className="absolute top-1/2 right-2 transform -translate-y-1/2"
//           aria-label="Search"
//         >
//           <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
//         </button>
//       </div>

//       {showDropdown && (
//         <div className="absolute top-full mt-1 w-64 sm:w-72 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow z-50 max-h-80 overflow-auto">
//           {inputValue && filteredSuggestions.length > 0 ? (
//             <ul>
//               {filteredSuggestions.map((s, i) => (
//                 <li
//                   key={i}
//                   onClick={() => {
//                     const selected = s;
//                     setInputValue(selected);
//                     handleSearch(selected);
//                   }}
//                   className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm"
//                 >
//                   {s}
//                 </li>
//               ))}
//             </ul>
//           ) : inputValue ? (
//             <div className="px-4 py-2 text-xs text-gray-400">
//               No suggestions
//             </div>
//           ) : null}

//           {!inputValue && recentSearches.length > 0 && (
//             <div>
//               <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
//                 Recent Searches
//                 <button
//                   onClick={clearAll}
//                   className="text-red-500 text-xs hover:underline"
//                 >
//                   Clear All
//                 </button>
//               </div>
//               <ul>
//                 {recentSearches.map((s, i) => (
//                   <li
//                     key={i}
//                     className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm"
//                   >
//                     <span
//                       onClick={() => {
//                         setInputValue(s);
//                         handleSearch(s);
//                       }}
//                       className="flex-1"
//                     >
//                       🕑 {s}
//                     </span>
//                     <button
//                       onClick={() => handleDeleteRecent(s)}
//                       className="text-red-500 text-xs ml-2 hover:scale-105 transition-transform"
//                     >
//                       ❌
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }















"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets"; 
import { useAppContext } from "@/context/AppContext"; 
import { Search, Clock, X, History } from "lucide-react"; // clean SVG icons
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const router = useRouter();
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const { products } = useAppContext();
  const productNames = products?.map((p) => p.name) || [];

  const filteredSuggestions = productNames.filter(
    (item) =>
      item.toLowerCase().includes(inputValue.toLowerCase()) &&
      item.toLowerCase() !== inputValue.toLowerCase()
  );

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const handleSearch = (customValue) => {
    const search = (customValue ?? inputValue).trim();
    if (search) {
      const updatedRecent = [
        search,
        ...recentSearches.filter((s) => s !== search),
      ].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));

      router.push(`/all-products?search=${encodeURIComponent(search)}`);
      setSearchExpanded(false);
      setShowDropdown(false);
    } else {
      setSearchExpanded(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && filteredSuggestions[highlightIndex]) {
        handleSearch(filteredSuggestions[highlightIndex]);
      } else {
        handleSearch();
      }
    }
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setShowDropdown(false);
      setSearchExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteRecent = (item) => {
    const updated = recentSearches.filter((s) => s !== item);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="relative flex items-center w-full max-w-lg" ref={containerRef}>
      <div className="relative w-full">
        {/* Input */}
        <input
          ref={searchRef}
          type="text"
          placeholder="Search products, brands, categories..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setHighlightIndex(-1);
          }}
          onFocus={() => {
            setSearchExpanded(true);
            setShowDropdown(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 200);
          }}
          onKeyDown={handleKeyDown}
          className={`transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full py-2 pr-10 pl-4 text-sm text-gray-700 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 ${
            searchExpanded ? "opacity-100 w-full" : "opacity-0 w-0 pl-0 pr-0"
          }`}
        />

        {/* Search Icon Button */}
        <button
          onClick={() => handleSearch()}
          className="absolute top-1/2 right-2 hover:scale-110 transform -translate-y-1/2 text-gray-500 hover:text-orange-600 transition"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden"
          >
            {inputValue && filteredSuggestions.length > 0 ? (
              <ul>
                {filteredSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSearch(s)}
                    className={`px-4 py-2 cursor-pointer text-sm flex items-center gap-2 transition ${
                      highlightIndex === i
                        ? "bg-orange-100 dark:bg-gray-800 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Search size={14} className="text-gray-400" />
                    {s}
                  </li>
                ))}
              </ul>
            ) : inputValue ? (
              <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                <X size={14} className="text-gray-400" />
                No suggestions
              </div>
            ) : null}

            {/* Recent Searches */}
            {!inputValue && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium">Recent Searches</span>
                  <button
                    onClick={clearAll}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <ul>
                  {recentSearches.map((s, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm transition"
                    >
                      <span
                        onClick={() => handleSearch(s)}
                        className="flex items-center gap-2 flex-1"
                      >
                        <History size={14} className="text-gray-400" />
                        {s}
                      </span>
                      <button
                        onClick={() => handleDeleteRecent(s)}
                        className="text-red-500 text-xs ml-2 hover:scale-110 transition-transform"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
