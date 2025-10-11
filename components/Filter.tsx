// "use client";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
// import { useState } from "react";

// interface FilterProps {
//   searchQuery: string;
//   brand?: string;
//   color?: string;
// }

// const Filter = ({ searchQuery, brand, color }: FilterProps) => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [showFilters, setShowFilters] = useState(false);

//   const handleFilterChange = (
//     e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     const params = new URLSearchParams(searchParams.toString());

//     // Apply or remove the filter
//     if (value === "") {
//       params.delete(name);
//     } else {
//       params.set(name, value);
//     }

//     // Maintain the search query and reset page to 1
//     if (searchQuery) {
//       params.set("search", searchQuery);
//     }

//     params.set("page", "1");

//     router.replace(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//       {/* Filter Controls */}
//       <div className="w-full md:w-auto">
//         {/* Mobile Toggle */}
//         <button
//           className="flex items-center justify-between w-full md:hidden bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3"
//           onClick={() => setShowFilters(!showFilters)}
//         >
//           <div className="flex items-center gap-2">
//             <SlidersHorizontal className="w-4 h-4 text-orange-600" />
//             <span className="text-sm font-semibold text-gray-700">Filters</span>
//           </div>
//           <span className="text-xs text-gray-500">{showFilters ? "Hide" : "Show"}</span>
//         </button>

//         {/* Accordion Body */}
//         <div
//           className={`transition-all duration-300 overflow-hidden ${
//             showFilters ? "max-h-screen mt-3" : "max-h-0"
//           } md:max-h-none md:mt-0`}
//         >
//           <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 md:flex">
//             {/* Price Inputs */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 name="min"
//                 placeholder="Min"
//                 className="text-xs rounded-lg px-3 py-2 w-24 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 onChange={handleFilterChange}
//                 defaultValue={searchParams.get("min") || ""}
//               />
//               <span className="text-gray-400 text-xs">—</span>
//               <input
//                 type="number"
//                 name="max"
//                 placeholder="Max"
//                 className="text-xs rounded-lg px-3 py-2 w-24 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 onChange={handleFilterChange}
//                 defaultValue={searchParams.get("max") || ""}
//               />
//             </div>

//             {/* Category Filter */}
//             <div className="relative w-full sm:w-auto">
//               <select
//                 name="category"
//                 onChange={handleFilterChange}
//                 defaultValue={searchParams.get("category") || ""}
//                 className="block w-full sm:w-auto py-2 px-3 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors appearance-none"
//               >
//                 <option value="">Category</option>
//                 <option value="Earphone">Earphone</option>
//                 <option value="Headphone">Headphone</option>
//                 <option value="Watch">Watch</option>
//                 <option value="Smartphone">Smartphone</option>
//                 <option value="Laptop">Laptop</option>
//                 <option value="Camera">Camera</option>
//                 <option value="Accessories">Accessories</option>
//               </select>

//               {/* Chevron Arrow */}
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
//                 <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//               </div>
//             </div>


//             {/* Brand Filter */}
//             <select
//               name="brand"
//               className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               onChange={handleFilterChange}
//               defaultValue={brand || searchParams.get("brand") || ""}
//             >
//               <option value="">Brand</option>
//               <option value="Apple">Apple</option>
//               <option value="Samsung">Samsung</option>
//               <option value="Sony">Sony</option>
//               <option value="Bose">Bose</option>
//               <option value="Beats">Beats</option>
//               <option value="Dell">Dell</option>
//             </select>

//             {/* Color Filter */}
//             <select
//               name="color"
//               className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               onChange={handleFilterChange}
//               defaultValue={color || searchParams.get("color") || ""}
//             >
//               <option value="">Color</option>
//               <option value="Black">Black</option>
//               <option value="White">White</option>
//               <option value="Red">Red</option>
//               <option value="Blue">Blue</option>
//               <option value="Green">Green</option>
//               <option value="Silver">Silver</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Sort Control */}

//       <div className="w-full sm:w-auto">
//         <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-xl px-3 py-2 w-full sm:w-auto">
//           <svg
//             className="w-5 h-5 text-gray-500"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 4h18M3 12h18M3 20h18"
//             />
//           </svg>
//           <select
//             name="sort"
//             className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none"
//             onChange={handleFilterChange}
//             defaultValue={searchParams.get("sort") || ""}
//           >
//             <option value="">Sort By</option>
//             <option value="asc price">Price (low → high)</option>
//             <option value="desc price">Price (high → low)</option>
//             <option value="asc date">Newest</option>
//             <option value="desc date">Oldest</option>
//           </select>
//         </div>
//       </div>

//     </div>

//   );
// };

// export default Filter;



































"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, SlidersHorizontal, ListFilter } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export default function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (name === "price") {
      params.delete("min");
      params.delete("max");
    } else if (!value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const triggerClasses =
    "flex items-center justify-between w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white";

  const itemClasses =
    "text-sm px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 data-[state=checked]:bg-gray-200 dark:data-[state=checked]:bg-gray-600";

  const summaryChips = useMemo(() => {
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const color = searchParams.get("color");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const sort = searchParams.get("sort");

    const sortLabels: Record<string, string> = {
      "asc price": "Price (low → high)",
      "desc price": "Price (high → low)",
      "asc date": "Oldest",
      "desc date": "Newest",
    };

    const chips: { name: string; label: string }[] = [];

    if (category) chips.push({ name: "category", label: `Category: ${category}` });
    if (brand) chips.push({ name: "brand", label: `Brand: ${brand}` });
    if (color) chips.push({ name: "color", label: `Color: ${color}` });
    if (min || max)
      chips.push({ name: "price", label: `₦${min || "0"} – ₦${max || "∞"}` });
    if (sort)
      chips.push({ name: "sort", label: sortLabels[sort] || sort });

    return chips;
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* === Summary Chips (Now Above Filters) === */}
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-700">
        {summaryChips.length > 0 && (
          <>
            <span className="font-medium text-gray-500 mr-1">
              Showing results for:
            </span>

            {summaryChips.map((chip, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs md:text-sm"
              >
                {chip.label}
                <button
                  onClick={() =>
                    chip.name === "price"
                      ? (handleFilterChange("min", ""), handleFilterChange("max", ""))
                      : handleFilterChange(chip.name, "")
                  }
                  className="ml-1 text-orange-500 hover:text-orange-700 focus:outline-none"
                  aria-label={`Remove ${chip.label}`}
                >
                  ×
                </button>
              </span>
            ))}

            {/* === Clear All Button === */}
            <button
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.delete("category");
                params.delete("brand");
                params.delete("color");
                params.delete("min");
                params.delete("max");
                params.delete("sort");
                const newUrl = `${window.location.pathname}`;
                router.push(newUrl); // navigates to base path (cleared filters)
              }}
              className="ml-2 text-xs md:text-sm text-orange-600 hover:text-orange-800 font-medium underline decoration-underline-offset-2"
            >
              Clear all
            </button>
          </>
        )}
      </div>

      {/* === Filter Controls === */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
        {/* Left section: Filters */}
        <div className="w-full md:w-auto">
          {/* Mobile Toggle */}
          <button
            className="flex items-center justify-between w-full md:hidden bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-normal text-black">Filters</span>
            </div>
            <span className="text-xs text-gray-500">
              {showFilters ? "Hide" : "Show"}
            </span>
          </button>

          {/* Accordion Body */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              showFilters ? "max-h-screen mt-3" : "max-h-0"
            } md:max-h-none md:mt-0`}
          >
            <div className="flex flex-col sm:flex-row flex-wrap items-start gap-4 bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
              {/* Price Inputs */}
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Price
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="min"
                    placeholder="Min"
                    className="text-xs rounded-lg px-3 py-2 w-24 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none"
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    }
                    defaultValue={searchParams.get("min") || ""}
                  />
                  <span className="text-gray-400 text-xs">—</span>
                  <input
                    type="number"
                    name="max"
                    placeholder="Max"
                    className="text-xs rounded-lg px-3 py-2 w-24 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none"
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    }
                    defaultValue={searchParams.get("max") || ""}
                  />
                </div>
              </div>

              {/* Generic Selects */}
              {[
                {
                  name: "category",
                  label: "Category",
                  options: [
                    "Earphone",
                    "Headphone",
                    "Watch",
                    "Smartphone",
                    "Laptop",
                    "Camera",
                    "Accessories",
                  ],
                },
                {
                  name: "brand",
                  label: "Brand",
                  options: [
                    "Apple",
                    "Samsung",
                    "Sony",
                    "Bose",
                    "Beats",
                    "Dell",
                  ],
                },
                {
                  name: "color",
                  label: "Color",
                  options: [
                    "Black",
                    "White",
                    "Red",
                    "Blue",
                    "Green",
                    "Silver",
                  ],
                },
              ].map((filter) => (
                <div
                  key={filter.name}
                  className="flex flex-col w-full sm:w-auto relative"
                >
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    {filter.label}
                  </label>
                  <Select.Root
                    defaultValue={searchParams.get(filter.name) || undefined}
                    onValueChange={(value) =>
                      handleFilterChange(filter.name, value)
                    }
                  >
                    <Select.Trigger
                      className={`${triggerClasses} w-auto min-w-[8rem] flex items-center justify-between`}
                    >
                      <div className="text-gray-500 text-xs">
                        {searchParams.get(filter.name) || `Select ${filter.label.toLowerCase()}`}
                      </div>
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                      </Select.Icon>
                    </Select.Trigger>



                    <Select.Content
                      position="popper"
                      side="bottom"
                      align="start"
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 mt-1 w-full sm:w-auto"
                    >
                      <Select.Viewport className="p-2">
                        {filter.options.map((opt) => (
                          <Select.Item
                            key={opt}
                            value={opt}
                            className={itemClasses}
                          >
                            {opt}
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Root>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right section: Sort */}
        <div className="flex flex-col w-full sm:w-auto mt-3 md:mt-0">
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Sort
          </label>

          <Select.Root
            defaultValue={searchParams.get("sort") || undefined}
            onValueChange={(value) => handleFilterChange("sort", value)}
          >
            <Select.Trigger
              className={`${triggerClasses} w-auto min-w-[9rem] flex items-center justify-between gap-2`}
            >
              {/* === Left Section: Icon + Label === */}
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <ListFilter className="w-4 h-4 text-gray-500" />
                <span>
                  {(() => {
                    const sort = searchParams.get("sort");
                    if (sort === "asc price") return "Price (low → high)";
                    if (sort === "desc price") return "Price (high → low)";
                    if (sort === "asc date") return "Oldest";
                    if (sort === "desc date") return "Newest";
                    return "Sort order";
                  })()}
                </span>
              </div>

              {/* === Right Section: Chevron === */}
              <Select.Icon>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Content
              position="popper"
              side="bottom"
              align="start"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 mt-1 w-full sm:w-auto"
            >
              <Select.Viewport className="p-2">
                {[
                  { label: "Price (low → high)", value: "asc price" },
                  { label: "Price (high → low)", value: "desc price" },
                  { label: "Newest", value: "desc date" },
                  { label: "Oldest", value: "asc date" },
                ].map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className={itemClasses}
                  >
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>


      </div>
    </div>
  );
}
