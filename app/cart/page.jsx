"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, PackageX } from "lucide-react";
import OrderSummary from "@/components/OrderSummary";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation';

const Cart = () => {
  const router = useRouter();

  const {
    products,
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

      <div className="px-4 sm:px-6 md:px-16 lg:px-32 pt-10 mt-8 mb-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
          
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Shopping <span className="text-orange-600">Bag</span>
            </h2>

            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">
              Review your items before completing checkout
            </p>
          </div>

          {!loading && cartCount > 0 && (
            <span className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Loading your shopping bag...
            </p>
          </div>
        ) : cartCount === 0 ? (
          
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20">
            
            <img
              src="/Essential_illustrations_-removebg-preview.png"
              width={220}
              height={220}
              alt="Empty Cart"
              className="opacity-90"
            />

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">
              Your bag is empty
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
              Discover amazing products and start building your cart.
            </p>

            <button
              onClick={() => router.push("/all-products")}
              className="mt-6 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-sm transition"
            >
              Start Shopping
            </button>
          </div>

        ) : (

          /* Cart Layout */
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT: Cart Items */}
            <div className="flex-1 space-y-5">

              {Object.keys(cartItems).map((itemId) => {
                const product = products.find((p) => p._id === itemId);
                if (!product || cartItems[itemId] <= 0) return null;

                const quantity = cartItems[itemId];
                const max = product.stock;

                return (
                  <div
                    key={itemId}
                    className="group flex flex-col sm:flex-row gap-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:shadow-md transition"
                  >

                    {/* Image */}
                    <div className="w-full sm:w-28 flex-shrink-0">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-28 object-contain rounded-xl bg-gray-50 dark:bg-gray-800 p-2"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">

                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          ₦{Number(product.offerPrice).toLocaleString()}
                        </p>

                        <button
                          onClick={() => updateCartQuantity(product._id, 0)}
                          className="text-xs text-red-500 hover:underline mt-2"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4">

                        {max === 0 ? (
                          <span className="text-sm font-medium text-red-500">
                            Sold Out
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            
                            <button
                              onClick={() =>
                                updateCartQuantity(product._id, quantity - 1)
                              }
                              disabled={quantity <= 1}
                              className="w-8 h-8 rounded-lg border dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 && val <= max) {
                                  updateCartQuantity(product._id, val);
                                }
                              }}
                              className="w-12 text-center border dark:border-gray-700 rounded-lg bg-transparent"
                            />

                            <button
                              onClick={() => {
                                if (quantity < max) {
                                  updateCartQuantity(product._id, quantity + 1);
                                }
                              }}
                              disabled={quantity >= max}
                              className="w-8 h-8 rounded-lg border dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
                            >
                              +
                            </button>

                          </div>
                        )}

                        <p className="font-semibold text-gray-900 dark:text-white">
                          ₦{(product.offerPrice * quantity).toLocaleString()}
                        </p>

                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Continue Shopping */}
              <button
                onClick={() => router.push("/all-products")}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm mt-6"
              >
                <ShoppingCart className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>

            {/* RIGHT: Summary */}
            <div className="w-full lg:w-[380px]">
              <OrderSummary />
            </div>

          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cart;
