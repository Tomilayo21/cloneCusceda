// 'use client';

// import React, { useEffect } from "react";
// import { assets } from "@/assets/assets";
// import OrderSummary from "@/components/OrderSummary";
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";

// const Cart = () => {
//   const {
//     products,
//     router,
//     cartItems,
//     updateCartQuantity,
//     getCartCount,
//     currency
//   } = useAppContext();

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mt-8 mb-20">
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
//             <p className="text-2xl md:text-3xl text-gray-500">
//               My <span className="font-medium text-orange-600">Cart</span>
//             </p>
//             {getCartCount() > 0 && (
//               <p className="text-lg md:text-xl text-gray-500/80">
//                 {getCartCount()} {getCartCount() === 1 ? "Item" : "Items"}
//               </p>
//             )}

//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead className="text-left">
//                 <tr>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Product Details</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Price</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Quantity</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(cartItems).map((itemId) => {
//                   const product = products.find((p) => p._id === itemId);
//                   if (!product || cartItems[itemId] <= 0) return null;

//                   const maxQuantity = product.stock;
//                   const currentQuantity = cartItems[itemId];

//                   return (
//                     <tr key={itemId}>
//                       <td className="flex items-center gap-4 py-4 md:px-4 px-1">
//                         <div>
//                           <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
//                             <Image
//                               src={product.image[0]}
//                               alt={product.name}
//                               className="w-16 h-auto object-cover mix-blend-multiply"
//                               width={1280}
//                               height={720}
//                             />
//                           </div>
//                           <button
//                             className="md:hidden text-xs text-orange-600 mt-1"
//                             onClick={() => updateCartQuantity(product._id, 0)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                         <div className="text-sm hidden md:block">
//                           <p className="text-gray-800">{product.name}</p>
//                           <button
//                             className="text-xs text-orange-600 mt-1"
//                             onClick={() => updateCartQuantity(product._id, 0)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </td>

//                       <td className="py-4 md:px-4 px-1 text-gray-600">
//                         {currency}{product.offerPrice}
//                       </td>

//                       <td className="py-4 md:px-4 px-1">
//                         {maxQuantity === 0 ? (
//                           <p className="text-red-500 font-semibold">Sold Out</p>
//                         ) : (
//                           <div className="flex items-center md:gap-2 gap-1">
//                             <button
//                               onClick={() => updateCartQuantity(product._id, currentQuantity - 1)}
//                               disabled={currentQuantity <= 1}
//                             >
//                               <Image
//                                 src={assets.decrease_arrow}
//                                 alt="decrease_arrow"
//                                 className="w-4 h-4"
//                               />
//                             </button>

//                             <input
//                               type="number"
//                               value={currentQuantity}
//                               onChange={(e) => {
//                                 const value = Number(e.target.value);
//                                 if (value > 0 && value <= maxQuantity) {
//                                   updateCartQuantity(product._id, value);
//                                 }
//                               }}
//                               className="w-8 border text-center appearance-none"
//                             />

//                             <button
//                               onClick={() => {
//                                 if (currentQuantity < maxQuantity) {
//                                   updateCartQuantity(product._id, currentQuantity + 1);
//                                 }
//                               }}
//                               disabled={currentQuantity >= maxQuantity}
//                             >
//                               <Image
//                                 src={assets.increase_arrow}
//                                 alt="increase_arrow"
//                                 className="w-4 h-4"
//                               />
//                             </button>
//                           </div>
//                         )}
//                         {currentQuantity >= maxQuantity && maxQuantity > 0 && (
//                           <p className="text-xs text-red-500 mt-1">Maximum stock reached</p>
//                         )}
//                       </td>

//                       <td className="py-4 md:px-4 px-1 text-gray-600">
//                         {currency}{(product.offerPrice * currentQuantity).toFixed(2)}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <button
//             onClick={() => router.push("/all-products")}
//             className="group flex items-center mt-6 gap-2 text-orange-600"
//           >
//             <Image
//               className="group-hover:-translate-x-1 transition"
//               src={assets.arrow_right_icon_colored}
//               alt="arrow_right_icon_colored"
//             />
//             Continue Shopping
//           </button>
//         </div>

//         <OrderSummary />
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Cart;

































// "use client";

// import React from "react";
// import { assets } from "@/assets/assets";
// import OrderSummary from "@/components/OrderSummary";
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";

// const Cart = () => {
//   const {
//     products,
//     router,
//     cartItems,
//     updateCartQuantity,
//     getCartCount,
//     currency,
//   } = useAppContext();

//   const cartCount = getCartCount();

//   return (
//     <>
//       <Navbar />
//       <div className="px-6 md:px-16 lg:px-32 pt-14 mt-8 mb-20">
//         <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
//           <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
//             My <span className="text-orange-600">Cart</span>
//           </h2>
//           {cartCount > 0 && (
//             <p className="text-lg md:text-xl text-gray-600">
//               {cartCount} {cartCount === 1 ? "Item" : "Items"}
//             </p>
//           )}
//         </div>

//         {cartCount === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <Image
//               src={assets.empty_cart}
//               alt="Empty Cart"
//               className="w-40 h-40 opacity-80"
//             />
//             <p className="mt-6 text-lg text-gray-600">
//               Your cart is empty. Let’s fix that!
//             </p>
//             <button
//               onClick={() => router.push("/all-products")}
//               className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-md transition"
//             >
//               Browse Products
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col md:flex-row gap-10">
//             {/* Cart Items */}
//             <div className="flex-1 space-y-6">
//               {Object.keys(cartItems).map((itemId) => {
//                 const product = products.find((p) => p._id === itemId);
//                 if (!product || cartItems[itemId] <= 0) return null;

//                 const maxQuantity = product.stock;
//                 const currentQuantity = cartItems[itemId];

//                 return (
//                   <div
//                     key={itemId}
//                     className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200"
//                   >
//                     {/* Product Image */}
//                     <div className="flex-shrink-0">
//                       <Image
//                         src={product.image[0]}
//                         alt={product.name}
//                         className="w-28 h-28 object-contain rounded-xl bg-gray-50 p-2"
//                         width={112}
//                         height={112}
//                       />
//                     </div>

//                     {/* Product Details */}
//                     <div className="flex flex-1 flex-col md:flex-row justify-between items-start md:items-center w-full">
//                       <div>
//                         <h3 className="text-lg font-medium text-gray-800">
//                           {product.name}
//                         </h3>
//                         <p className="text-gray-500 mt-1">
//                           {currency}
//                           {product.offerPrice.toFixed(2)}
//                         </p>
//                         <button
//                           className="text-sm text-red-500 mt-2 hover:underline"
//                           onClick={() => updateCartQuantity(product._id, 0)}
//                         >
//                           Remove
//                         </button>
//                       </div>

//                       {/* Quantity + Subtotal */}
//                       <div className="flex items-center gap-6 mt-4 md:mt-0">
//                         {maxQuantity === 0 ? (
//                           <p className="text-red-500 font-semibold">Sold Out</p>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() =>
//                                 updateCartQuantity(
//                                   product._id,
//                                   currentQuantity - 1
//                                 )
//                               }
//                               disabled={currentQuantity <= 1}
//                               className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
//                             >
//                               −
//                             </button>

//                             <input
//                               type="number"
//                               value={currentQuantity}
//                               onChange={(e) => {
//                                 const value = Number(e.target.value);
//                                 if (value > 0 && value <= maxQuantity) {
//                                   updateCartQuantity(product._id, value);
//                                 }
//                               }}
//                               className="w-12 border text-center rounded-lg"
//                             />

//                             <button
//                               onClick={() => {
//                                 if (currentQuantity < maxQuantity) {
//                                   updateCartQuantity(
//                                     product._id,
//                                     currentQuantity + 1
//                                   );
//                                 }
//                               }}
//                               disabled={currentQuantity >= maxQuantity}
//                               className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
//                             >
//                               +
//                             </button>
//                           </div>
//                         )}
//                         <p className="font-medium text-gray-700">
//                           {currency}
//                           {(product.offerPrice * currentQuantity).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               <button
//                 onClick={() => router.push("/all-products")}
//                 className="flex items-center gap-2 text-orange-600 hover:underline mt-4"
//               >
//                 <Image
//                   className="w-4 h-4"
//                   src={assets.arrow_right_icon_colored}
//                   alt="arrow_right_icon_colored"
//                 />
//                 Continue Shopping
//               </button>
//             </div>

//             {/* Order Summary */}
//             <OrderSummary />
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Cart;



















































// "use client";

// import React from "react";
// import { ShoppingCart, PackageX } from "lucide-react";
// import OrderSummary from "@/components/OrderSummary";
// import Navbar from "@/components/Navbar";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";

// const Cart = () => {
//   const {
//     products,
//     router,
//     cartItems,
//     updateCartQuantity,
//     getCartCount,
//     currency,
//   } = useAppContext();

//   const cartCount = getCartCount();

//   return (
//     <>
//       <Navbar />
//       <div className="px-6 md:px-16 lg:px-32 pt-10 mt-8 mb-20">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
//           <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
//             My <span className="text-orange-600">Cart</span>
//           </h2>
//           {cartCount > 0 && (
//             <p className="text-lg md:text-xl text-gray-600">
//               {cartCount} {cartCount === 1 ? "Item" : "Items"}
//             </p>
//           )}
//         </div>

//         {/* Empty Cart */}
//         {cartCount === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <PackageX className="w-32 h-32 text-gray-400 opacity-80" />
//             <p className="mt-6 text-lg text-gray-600">
//               Your cart is empty. Let’s fix that!
//             </p>
//             <button
//               onClick={() => router.push("/all-products")}
//               className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-md transition"
//             >
//               Browse Products
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col md:flex-row gap-10">
//             {/* Cart Items */}
//             <div className="flex-1 space-y-6">
//               {Object.keys(cartItems).map((itemId) => {
//                 const product = products.find((p) => p._id === itemId);
//                 if (!product || cartItems[itemId] <= 0) return null;

//                 const maxQuantity = product.stock;
//                 const currentQuantity = cartItems[itemId];

//                 return (
//                   <div
//                     key={itemId}
//                     className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200"
//                   >
//                     {/* Product Image */}
//                     <div className="flex-shrink-0">
//                       <img
//                         src={product.image[0]}
//                         alt={product.name}
//                         className="w-28 h-28 object-contain rounded-xl bg-gray-50 p-2"
//                       />
//                     </div>

//                     {/* Product Details */}
//                     <div className="flex flex-1 flex-col md:flex-row justify-between items-start md:items-center w-full">
//                       <div>
//                         <h3 className="text-lg font-medium text-gray-800">
//                           {product.name}
//                         </h3>
//                         <p className="text-gray-500 mt-1">
//                           {currency}
//                           {product.offerPrice.toFixed(2)}
//                         </p>
//                         <button
//                           className="text-sm text-red-500 mt-2 hover:underline"
//                           onClick={() => updateCartQuantity(product._id, 0)}
//                         >
//                           Remove
//                         </button>
//                       </div>

//                       {/* Quantity + Subtotal */}
//                       <div className="flex items-center gap-6 mt-4 md:mt-0">
//                         {maxQuantity === 0 ? (
//                           <p className="text-red-500 font-semibold">Sold Out</p>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() =>
//                                 updateCartQuantity(
//                                   product._id,
//                                   currentQuantity - 1
//                                 )
//                               }
//                               disabled={currentQuantity <= 1}
//                               className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
//                             >
//                               −
//                             </button>

//                             <input
//                               type="number"
//                               value={currentQuantity}
//                               onChange={(e) => {
//                                 const value = Number(e.target.value);
//                                 if (value > 0 && value <= maxQuantity) {
//                                   updateCartQuantity(product._id, value);
//                                 }
//                               }}
//                               className="w-12 border text-center rounded-lg"
//                             />

//                             <button
//                               onClick={() => {
//                                 if (currentQuantity < maxQuantity) {
//                                   updateCartQuantity(
//                                     product._id,
//                                     currentQuantity + 1
//                                   );
//                                 }
//                               }}
//                               disabled={currentQuantity >= maxQuantity}
//                               className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
//                             >
//                               +
//                             </button>
//                           </div>
//                         )}
//                         <p className="font-medium text-gray-700">
//                           {currency}
//                           {(product.offerPrice * currentQuantity).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               <button
//                 onClick={() => router.push("/all-products")}
//                 className="flex items-center gap-2 text-orange-600 hover:underline mt-4"
//               >
//                 <ShoppingCart className="w-4 h-4" />
//                 Continue Shopping
//               </button>
//             </div>

//             {/* Order Summary */}
//             <OrderSummary />
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Cart;




























"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, PackageX } from "lucide-react";
import OrderSummary from "@/components/OrderSummary";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";

const Cart = () => {
  const {
    products,
    router,
    cartItems,
    updateCartQuantity,
    getCartCount,
    currency,
  } = useAppContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // small delay to wait for context to hydrate
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [cartItems]);

  const cartCount = getCartCount();

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-10 mt-8 mb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            My <span className="text-orange-600">Cart</span>
          </h2>
          {!loading && cartCount > 0 && (
            <p className="text-lg md:text-xl text-gray-600">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-600 animate-pulse">
              Cart is loading...
            </p>
          </div>
        ) : cartCount === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-20">
            <PackageX className="w-32 h-32 text-gray-400 opacity-80" />
            <p className="mt-6 text-lg text-gray-600">
              Your cart is empty. Let’s fix that!
            </p>
            <button
              onClick={() => router.push("/all-products")}
              className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-md transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          /* Cart Items + Order Summary */
          <div className="flex flex-col md:flex-row gap-10">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              {Object.keys(cartItems).map((itemId) => {
                const product = products.find((p) => p._id === itemId);
                if (!product || cartItems[itemId] <= 0) return null;

                const maxQuantity = product.stock;
                const currentQuantity = cartItems[itemId];

                return (
                  <div
                    key={itemId}
                    className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-28 h-28 object-contain rounded-xl bg-gray-50 p-2"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 mt-1">
                          {currency}
                          {product.offerPrice.toFixed(2)}
                        </p>
                        <button
                          className="text-sm text-red-500 mt-2 hover:underline"
                          onClick={() => updateCartQuantity(product._id, 0)}
                        >
                          Remove
                        </button>
                      </div>

                      {/* Quantity + Subtotal */}
                      <div className="flex items-center gap-6 mt-4 md:mt-0">
                        {maxQuantity === 0 ? (
                          <p className="text-red-500 font-semibold">Sold Out</p>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  product._id,
                                  currentQuantity - 1
                                )
                              }
                              disabled={currentQuantity <= 1}
                              className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              value={currentQuantity}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value > 0 && value <= maxQuantity) {
                                  updateCartQuantity(product._id, value);
                                }
                              }}
                              className="w-12 border text-center rounded-lg"
                            />

                            <button
                              onClick={() => {
                                if (currentQuantity < maxQuantity) {
                                  updateCartQuantity(
                                    product._id,
                                    currentQuantity + 1
                                  );
                                }
                              }}
                              disabled={currentQuantity >= maxQuantity}
                              className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        )}
                        <p className="font-medium text-gray-700">
                          {currency}
                          {(product.offerPrice * currentQuantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => router.push("/all-products")}
                className="flex items-center gap-2 text-orange-600 hover:underline mt-4"
              >
                <ShoppingCart className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <OrderSummary />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
