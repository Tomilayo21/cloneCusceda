"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface FilterProps {
  searchQuery: string;
  brand?: string;
  color?: string;
}

const Filter = ({ searchQuery, brand, color }: FilterProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams.toString());

    // Apply or remove the filter
    if (value === "") {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    // Maintain the search query and reset page to 1
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    // <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    //   {/* Filter Controls */}
    //   <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
    //     <div className="flex items-center gap-2 w-full">
    //       <SlidersHorizontal className="w-4 h-4 text-orange-600" />
    //       <span className="text-sm font-semibold text-gray-700">Filters</span>
    //     </div>

    //     {/* Price Inputs */}
    //     <div className="flex items-center gap-2">
    //       <input
    //         type="number"
    //         name="min"
    //         placeholder="Min"
    //         className="text-xs rounded-lg px-3 py-2 w-24 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
    //         onChange={handleFilterChange}
    //         defaultValue={searchParams.get("min") || ""}
    //       />
    //       <span className="text-gray-400 text-xs">—</span>
    //       <input
    //         type="number"
    //         name="max"
    //         placeholder="Max"
    //         className="text-xs rounded-lg px-3 py-2 w-24 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
    //         onChange={handleFilterChange}
    //         defaultValue={searchParams.get("max") || ""}
    //       />
    //     </div>

    //     {/* Category Filter */}
    //     <select
    //       name="category"
    //       className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
    //       onChange={handleFilterChange}
    //       defaultValue={searchParams.get("category") || ""}
    //     >
    //       <option value="">Category</option>
    //       <option value="Earphone">Earphone</option>
    //       <option value="Headphone">Headphone</option>
    //       <option value="Watch">Watch</option>
    //       <option value="Smartphone">Smartphone</option>
    //       <option value="Laptop">Laptop</option>
    //       <option value="Camera">Camera</option>
    //       <option value="Accessories">Accessories</option>
    //     </select>

    //     {/* Brand Filter */}
    //     <select
    //       name="brand"
    //       className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
    //       onChange={handleFilterChange}
    //       defaultValue={brand || searchParams.get("brand") || ""}
    //     >
    //       <option value="">Brand</option>
    //       <option value="Apple">Apple</option>
    //       <option value="Samsung">Samsung</option>
    //       <option value="Sony">Sony</option>
    //       <option value="Bose">Bose</option>
    //       <option value="Beats">Beats</option>
    //       <option value="Dell">Dell</option>
    //     </select>

    //     {/* Color Filter */}
    //     <select
    //       name="color"
    //       className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
    //       onChange={handleFilterChange}
    //       defaultValue={color || searchParams.get("color") || ""}
    //     >
    //       <option value="">Color</option>
    //       <option value="Black">Black</option>
    //       <option value="White">White</option>
    //       <option value="Red">Red</option>
    //       <option value="Blue">Blue</option>
    //       <option value="Green">Green</option>
    //       <option value="Silver">Silver</option>
    //     </select>
    //   </div>

    //   {/* Sort Control */}
    //   <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-2">
    //     <ArrowUpDown className="w-4 h-4 text-gray-500" />
    //     <select
    //       name="sort"
    //       className="bg-transparent text-sm font-medium text-gray-700 outline-none"
    //       onChange={handleFilterChange}
    //       defaultValue={searchParams.get("sort") || ""}
    //     >
    //       <option value="">Sort By</option>
    //       <option value="asc price">Price (low → high)</option>
    //       <option value="desc price">Price (high → low)</option>
    //       <option value="asc date">Newest</option>
    //       <option value="desc date">Oldest</option>
    //     </select>
    //   </div>
    // </div>


    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Filter Controls */}
      <div className="w-full md:w-auto">
        {/* Mobile Toggle */}
        <button
          className="flex items-center justify-between w-full md:hidden bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-gray-700">Filters</span>
          </div>
          <span className="text-xs text-gray-500">{showFilters ? "Hide" : "Show"}</span>
        </button>

        {/* Accordion Body */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showFilters ? "max-h-screen mt-3" : "max-h-0"
          } md:max-h-none md:mt-0`}
        >
          <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 md:flex">
            {/* Price Inputs */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="min"
                placeholder="Min"
                className="text-xs rounded-lg px-3 py-2 w-24 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                onChange={handleFilterChange}
                defaultValue={searchParams.get("min") || ""}
              />
              <span className="text-gray-400 text-xs">—</span>
              <input
                type="number"
                name="max"
                placeholder="Max"
                className="text-xs rounded-lg px-3 py-2 w-24 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                onChange={handleFilterChange}
                defaultValue={searchParams.get("max") || ""}
              />
            </div>

            {/* Category Filter */}
            <select
              name="category"
              className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              onChange={handleFilterChange}
              defaultValue={searchParams.get("category") || ""}
            >
              <option value="">Category</option>
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>

            {/* Brand Filter */}
            <select
              name="brand"
              className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              onChange={handleFilterChange}
              defaultValue={brand || searchParams.get("brand") || ""}
            >
              <option value="">Brand</option>
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Sony">Sony</option>
              <option value="Bose">Bose</option>
              <option value="Beats">Beats</option>
              <option value="Dell">Dell</option>
            </select>

            {/* Color Filter */}
            <select
              name="color"
              className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              onChange={handleFilterChange}
              defaultValue={color || searchParams.get("color") || ""}
            >
              <option value="">Color</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Silver">Silver</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sort Control */}
      {/* <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-2">
        <svg
          className="w-4 h-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 12h18M3 20h18" />
        </svg>
        <select
          name="sort"
          className="bg-transparent text-sm font-medium text-gray-700 outline-none"
          onChange={handleFilterChange}
          defaultValue={searchParams.get("sort") || ""}
        >
          <option value="">Sort By</option>
          <option value="asc price">Price (low → high)</option>
          <option value="desc price">Price (high → low)</option>
          <option value="asc date">Newest</option>
          <option value="desc date">Oldest</option>
        </select>
      </div> */}
      <div className="w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-xl px-3 py-2 w-full sm:w-auto">
          <svg
            className="w-5 h-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4h18M3 12h18M3 20h18"
            />
          </svg>
          <select
            name="sort"
            className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none"
            onChange={handleFilterChange}
            defaultValue={searchParams.get("sort") || ""}
          >
            <option value="">Sort By</option>
            <option value="asc price">Price (low → high)</option>
            <option value="desc price">Price (high → low)</option>
            <option value="asc date">Newest</option>
            <option value="desc date">Oldest</option>
          </select>
        </div>
      </div>

    </div>

  );
};

export default Filter;
