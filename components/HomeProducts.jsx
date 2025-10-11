import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(25);

  const visibleProducts = products.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 25);
  };

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-normal">
          Featured Products
        </p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {visibleProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {visibleCount < products.length ? (
        <button
          onClick={handleLoadMore}
          className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
        >
          Load more
        </button>
      ) : (
        products.length > 25 && (
          <button
            onClick={() => router.push('/all-products')}
            className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
          >
            See all
          </button>
        )
      )}
    </div>
  );
};

export default HomeProducts;
