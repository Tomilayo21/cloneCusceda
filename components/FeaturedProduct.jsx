'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const FeaturedProduct = () => {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);

    if (!product || !product.visible) {
      router.push("/not-found"); // Redirect if product is not visible
      return;
    }

    setProductData(product);
    if (product.image?.length > 0) {
      setMainImage(product.image[0]);
    }
  };

  useEffect(() => {
    if (id && products.length > 0) {
      fetchProductData();
    }
  }, [id, products.length]);

  return (
    <div className="flex flex-col items-center">
      {/* Product Details */}
      {productData && (
        <div
          className="w-full max-w-4xl mt-10"
          style={{
            backgroundColor: "rgba(230, 233, 242, 0.6)",
            padding: "1.5rem",
            borderRadius: "0.375rem"
          }}
        >
          <h1 className="text-2xl font-semibold mb-4 text-white dark:text-black">
            {productData.name}
          </h1>
          {mainImage && (
            <img
              src={mainImage}
              alt="Main product image"
              className="w-full h-auto rounded"
            />
          )}
          <p className="mt-4 text-white dark:text-black">
            {productData.description}
          </p>
          <p className="mt-2 text-lg font-semibold text-orange-600">
            ${productData.price}
          </p>
          <button
            onClick={() => addToCart(productData._id)}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
          >
            Add to Cart
          </button>
        </div>
      )}

      {/* Featured Products Section */}
      <div className="mt-14 w-full">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-medium">
            Featured <span className="text-orange-600">Products</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-12 px-4">
          {products
            .filter((product) => product.visible) // Only show visible products
            .filter((product) => product._id !== id) // Exclude current product
            .slice(0, 5)
            .map((product) => (
              <div
                key={product._id}
                className="relative group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <p className="font-semibold text-lg text-gray-800 dark:text-white truncate">
                    {product.name}
                  </p>
                  {/* Uncomment below if you want short description */}
                  {/* <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                    {product.description}
                  </p> */}
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="mt-2 inline-flex items-center justify-center w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition duration-300"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
        </div>

        
      </div>
    </div>
  );
};

export default FeaturedProduct;
