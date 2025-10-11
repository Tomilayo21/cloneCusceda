"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import FadeInWhenVisible from "./animations/FadeInWhenVisible";


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
        <p className="text-3xl font-normal">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
        {visibleProducts.map((product, index) => (
          <FadeInWhenVisible key={index} delay={index * 0.1}>
            <ProductCard product={product} />
          </FadeInWhenVisible>
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








































// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import ProductCard from "./ProductCard";
// import { useAppContext } from "@/context/AppContext";
// import FadeInWhenVisible from "./animations/FadeInWhenVisible";

// // Container & child animation variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.12,
//       delayChildren: 0.15,
//     },
//   },
// };

// const childVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0 },
// };

// const HomeProducts = () => {
//   const { products, router } = useAppContext();
//   const [visibleCount, setVisibleCount] = useState(25);

//   const visibleProducts = products.slice(0, visibleCount);

//   const handleLoadMore = () => {
//     setVisibleCount(prev => prev + 25);
//   };

//   return (
//     <FadeInWhenVisible delay={0.1}>
//       <div className="flex flex-col items-center pt-14">
//         {/* Section Title */}
//         <div className="flex flex-col items-center">
//           <p className="text-3xl font-normal">Featured Products</p>
//           <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//         </div>

//         {/* Product Grid with Staggered Animation */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.2 }}
//           className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full"
//         >
//           {visibleProducts.map((product, index) => (
//             <motion.div key={index} variants={childVariants}>
//               <ProductCard product={product} />
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Load More Button */}
//         {visibleCount < products.length ? (
//           <button
//             onClick={handleLoadMore}
//             className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
//           >
//             Load more
//           </button>
//         ) : (
//           products.length > 25 && (
//             <button
//               onClick={() => router.push("/all-products")}
//               className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
//             >
//               See all
//             </button>
//           )
//         )}
//       </div>
//     </FadeInWhenVisible>
//   );
// };

// export default HomeProducts;
