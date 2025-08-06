// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { assets } from "@/assets/assets"; // Adjust this path if needed
// import { useAppContext } from "@/context/AppContext"; // For accessing products

// export default function SearchBar() {
//   const router = useRouter();
//   const searchRef = useRef(null);
//   const searchButtonRef = useRef(null);
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
//       <input
//         ref={searchRef}
//         type="text"
//         placeholder="Search..."
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onFocus={() => {
//           setSearchExpanded(true);
//           setShowDropdown(true);
//         }}
//         onBlur={() => {
//           setTimeout(() => setShowDropdown(false), 200);
//         }}
//         onKeyDown={handleKeyDown}
//         className={`transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-1 text-sm text-gray-700 dark:text-gray-100 ${
//           searchExpanded ? "opacity-100 w-48" : "opacity-0 w-0 px-0"
//         }`}
//       />
//       <button
//         ref={searchButtonRef}
//         onClick={() => handleSearch()}
//         className="ml-1"
//         aria-label="Search"
//       >
//         <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
//       </button>

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
import { assets } from "@/assets/assets"; // Adjust this path if needed
import { useAppContext } from "@/context/AppContext"; // For accessing products

export default function SearchBar() {
  const router = useRouter();
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const { products } = useAppContext();

  const productNames = products?.map((p) => p.name) || [];

  const filteredSuggestions = productNames.filter(
    (item) =>
      item.toLowerCase().includes(inputValue.toLowerCase()) &&
      item.toLowerCase() !== inputValue.toLowerCase()
  );

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
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
      setSearchExpanded(true); // Expand on empty input click
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setShowDropdown(false);
      setSearchExpanded(false); // Collapse on outside click
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
    <div className="relative flex items-center" ref={containerRef}>
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            setSearchExpanded(true);
            setShowDropdown(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 200);
          }}
          onKeyDown={handleKeyDown}
          className={`transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full py-1 pr-8 pl-4 text-sm text-gray-700 dark:text-gray-100 ${
            searchExpanded ? "opacity-100 w-48" : "opacity-0 w-0 pl-0 pr-0"
          }`}
        />
        <button
          onClick={() => handleSearch()}
          className="absolute top-1/2 right-2 transform -translate-y-1/2"
          aria-label="Search"
        >
          <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-1 w-64 sm:w-72 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow z-50 max-h-80 overflow-auto">
          {inputValue && filteredSuggestions.length > 0 ? (
            <ul>
              {filteredSuggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    const selected = s;
                    setInputValue(selected);
                    handleSearch(selected);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm"
                >
                  {s}
                </li>
              ))}
            </ul>
          ) : inputValue ? (
            <div className="px-4 py-2 text-xs text-gray-400">
              No suggestions
            </div>
          ) : null}

          {!inputValue && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                Recent Searches
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
                    className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm"
                  >
                    <span
                      onClick={() => {
                        setInputValue(s);
                        handleSearch(s);
                      }}
                      className="flex-1"
                    >
                      🕑 {s}
                    </span>
                    <button
                      onClick={() => handleDeleteRecent(s)}
                      className="text-red-500 text-xs ml-2 hover:scale-105 transition-transform"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
