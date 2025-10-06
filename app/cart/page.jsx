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
      <div className="px-6 md:px-16 lg:px-32 pt-10 mt-8 mb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
             Shopping <span className="text-orange-600">Bag</span>
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-2">
              Review the items you’ve added before checking out.
            </p>
          </div>

          {!loading && cartCount > 0 && (
            <p className="text-lg md:text-xl font-medium text-gray-700 mt-4 md:mt-0">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-600 animate-pulse">
              Bag is loading...
            </p>
          </div>
        ) : cartCount === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-12">
            <img src="/Essential_illustrations_-removebg-preview.png" width={200} height={200} alt="Empty Cart" />
            <p className="mt-6 text-lg text-gray-600">
              Looks like your bag is empty. Let’s fill it up!
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

                      <div className="flex flex-col gap-2 mt-4 md:mt-0">
                        {maxQuantity === 0 ? (
                          <p className="text-red-500 font-semibold">Sold Out</p>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(product._id, currentQuantity - 1)
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
                                  updateCartQuantity(product._id, currentQuantity + 1);
                                }
                              }}
                              disabled={currentQuantity >= maxQuantity}
                              className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        )}

                        {/* Price below quantity selector */}
                        <p className="text-lg font-semibold text-gray-800">
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
