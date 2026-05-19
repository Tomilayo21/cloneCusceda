"use client";

import { Suspense, useMemo } from "react";
import {
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Filter from "@/components/Filter";
import { useAppContext } from "@/context/AppContext";
import { PackageSearch, ChevronLeft, ChevronRight, Frown, ListFilter, SlidersHorizontal } from "lucide-react";
import ProductSlider from "@/components/ProductSlider";

const PRODUCTS_PER_PAGE = 25;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <AllProducts />
    </Suspense>  
  );
}

const AllProducts = () => {
  const { products, loading, themeColor, secondaryColor, tertiaryColor, fontSize, layoutStyle, layoutStyle: effectiveLayout } = useAppContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const minRaw = searchParams.get("min");
  const maxRaw = searchParams.get("max");
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const color = searchParams.get("color") || "";
  const searchQuery = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const pageRaw = searchParams.get("page");

  const min = minRaw !== null && !isNaN(parseFloat(minRaw)) ? parseFloat(minRaw) : 0;
  const max = maxRaw !== null && !isNaN(parseFloat(maxRaw)) ? parseFloat(maxRaw) : Infinity;
  const currentPage = pageRaw && !isNaN(parseInt(pageRaw)) && parseInt(pageRaw) > 0 ? parseInt(pageRaw) : 1;

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (type) filtered = filtered.filter((p) => p.type === type);
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (brand) filtered = filtered.filter((p) => p.brand?.toLowerCase() === brand.toLowerCase());
    if (color) filtered = filtered.filter((p) => p.color?.toLowerCase() === color.toLowerCase());

    filtered = filtered.filter((p) => {
      const offerPrice = typeof p.offerPrice === "string" ? parseFloat(p.offerPrice) : p.offerPrice;
      return !isNaN(offerPrice) && offerPrice >= min && offerPrice <= max;
    });

    if (sort === "asc price") {
      filtered.sort((a, b) => parseFloat(a.offerPrice) - parseFloat(b.offerPrice));
    } else if (sort === "desc price") {
      filtered.sort((a, b) => parseFloat(b.offerPrice) - parseFloat(a.offerPrice));
    } else if (sort === "asc date") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sort === "desc date") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, type, category, brand, color, min, max, searchQuery, sort]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // const fontSizeClass = {
  //   small: "text-sm",
  //   medium: "text-base",
  //   large: "text-lg",
  // }[fontSize] || "text-base";
  const fontSizeClass =
  fontSize === 'small'
    ? 'font-size-small'
    : fontSize === 'large'
    ? 'font-size-large'
    : 'font-size-medium';

  const productLayoutClass =
    effectiveLayout === "list"
      ? "flex flex-col gap-6"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4";

  if (loading) {
    return (
      <>
        <Navbar />
        <ProductSlider />
        <div className="w-full flex justify-center items-center h-96 text-lg text-gray-600">
          Please wait...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProductSlider />

      <main className="px-6 md:px-16 lg:px-32 py-10 bg-gray-50 dark:bg-neutral-900 min-h-screen">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-semibold ${fontSizeClass}`}
              style={{ color: secondaryColor }}
            >
              Explore Products
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Browse and discover products tailored to your needs
            </p>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="mb-8 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-5">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Filters
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Refine your search by category, brand, or preferences
            </p>
          </div>

          <Filter searchQuery={searchQuery} brand={brand} color={color} />
        </div>

        {/* PRODUCTS / EMPTY */}
        {paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-neutral-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
            <Frown className="w-14 h-14 text-gray-400 mb-4" />

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              No products found
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              We couldn’t find any products matching your current filters. Try adjusting your search or explore other categories.
            </p>

            <button
              onClick={() => router.push("/all-products")}
              className="mt-6 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-sm transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (

          <>
            {/* PRODUCT GRID */}
            <div className={`${productLayoutClass} gap-6`}>
              {paginatedProducts.map((product, index) => (
                <div
                  key={index}
                  className="transform transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">

                <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm px-4 py-3">

                  {/* Previous */}
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;

                    if (totalPages <= 7) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => changePage(pageNum)}
                          className={`px-4 py-2 text-sm rounded-lg transition ${
                            pageNum === currentPage
                              ? "bg-orange-600 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    const isVisible =
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 &&
                        pageNum <= currentPage + 1);

                    if (isVisible) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => changePage(pageNum)}
                          className={`px-4 py-2 text-sm rounded-lg transition ${
                            pageNum === currentPage
                              ? "bg-orange-600 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    if (
                      (pageNum === 2 && currentPage > 4) ||
                      (pageNum === totalPages - 1 &&
                        currentPage < totalPages - 3)
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="px-2 text-gray-400"
                        >
                          …
                        </span>
                      );
                    }

                    return null;
                  })}

                  {/* Next */}
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
};
