// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';          // ← add this
// import { useAppContext } from '@/context/AppContext';
// import { useClerk } from '@clerk/nextjs';
// import Image from 'next/image';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import useSWR from 'swr';
// import { HeartOff, ShoppingCart, Star, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";

// const fetcher = (url) => fetch(url).then((res) => res.json());

// export default function FavoritesPage() {
//   const { addToCart, currency } = useAppContext();
//   const { user } = useClerk();
//   const [favorites, setFavorites] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       const res = await fetch('/api/favorites');
//       const data = await res.json();
//       setFavorites(Array.isArray(data) ? data : []);
//     };
//     if (user) fetchFavorites();
//   }, [user]);

//   /* -------- ratings lookup (unchanged) -------- */
//   const productIds = favorites.map((fav) => fav.productId?._id?.toString());
//   const { data: allReviews = [] } = useSWR(
//     productIds.length ? `/api/reviews/batch?ids=${productIds.join(',')}` : null,
//     fetcher
//   );
//   const ratingsMap = {};
//   allReviews.forEach(({ productId, rating }) => {
//     const id = productId.toString();
//     if (!ratingsMap[id]) ratingsMap[id] = { sum: 0, count: 0 };
//     ratingsMap[id].sum += rating;
//     ratingsMap[id].count += 1;
//   });
//   Object.keys(ratingsMap).forEach((id) => {
//     ratingsMap[id].avg = ratingsMap[id].sum / ratingsMap[id].count;
//   });

//   /* -------- handlers -------- */
//   const removeFavorite = async (productId) => {
//     await fetch('/api/favorites', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ productId }),
//     });
//     setFavorites((prev) => prev.filter((fav) => fav.productId._id !== productId));
//   };

//   const handleAddToCart = (product) => addToCart(product);
  

//   /* -------- UI -------- */
//   return (
//     <>
//       <Navbar />

//       <div className="p-4 flex flex-col items-center pt-14 mt-8 bg-white text-black dark:bg-black dark:text-white min-h-screen px-6 md:px-16 lg:px-32">
        
//         {/* Header */}
//         <div className="flex flex-col items-center mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
//             <HeartOff className="w-7 h-7 text-orange-600" />
//             Favorites
//           </h1>
//           <div className="w-28 h-1 rounded-full bg-orange-600 mt-2" />
//           <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//             Save the products you love and access them anytime.
//           </p>
//         </div>

//         {/* Empty State */}
//         {favorites.length === 0 ? (
//           <div className="flex flex-col items-center justify-center mt-16 text-center">
//             <img src="document.png" alt='favorites' className="w-32 h-32 text-gray-400 opacity-70 mb-4" />
//             <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
//               Your favorites list is empty
//             </p>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Browse products and tap the heart to save them here.
//             </p>
//              <button
//               onClick={() => router.push("/all-products")}
//               className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-md transition"
//             >
//               Browse Products
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
//             {favorites.map(({ _id, productId }) => {
//               if (productId.visible === false) return null;

//               const pid = productId._id?.toString();
//               const rating = ratingsMap[pid] || { avg: 0, count: 0 };

//               return (
//                 <div
//                   key={_id}
//                   className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-neutral-900 transition hover:shadow-lg hover:-translate-y-1 duration-200"
//                 >
//                   {/* Product Image */}
//                   <Link href={`/product/${pid}`} className="block">
//                     <Image
//                       src={productId.image[0]}
//                       alt={productId.name}
//                       width={300}
//                       height={200}
//                       className="w-full h-48 object-cover rounded-t-2xl"
//                     />
//                     <div className="p-4">
//                       <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
//                         {productId.name}
//                       </h2>
//                       <p
//                         className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2"
//                         dangerouslySetInnerHTML={{ __html: productId.description }}
//                       />
//                       <p className="text-base font-bold text-orange-600 mt-2">
//                         {currency}{productId.offerPrice}
//                       </p>
//                       {/* Rating */}
//                       <div className="mt-2 flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
//                         <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                         <span>{rating.avg?.toFixed(1)} ({rating.count} reviews)</span>
//                       </div>
//                     </div>
//                   </Link>

//                   {/* Actions */}
//                   <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 px-4 py-3 text-sm">
//                     <button
//                       className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition"
//                       onClick={() => handleAddToCart(productId)}
//                     >
//                       <ShoppingCart className="w-4 h-4" />
//                       Add to Cart
//                     </button>
//                     <button
//                       className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-600 transition"
//                       onClick={() => removeFavorite(productId._id)}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }




























// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useAppContext } from '@/context/AppContext';
// import { useAuth } from '@/context/AuthContext';   // ✅ use your AuthContext
// import Image from 'next/image';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import useSWR from 'swr';
// import { HeartOff, ShoppingCart, Star, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";

// const fetcher = (url) => fetch(url).then((res) => res.json());

// export default function FavoritesPage() {
//   const { addToCart, currency } = useAppContext();
//   const { user } = useAuth();   // ✅ now from AuthContext
//   const [favorites, setFavorites] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) return;

//         const res = await fetch("/api/favorites", {
//           headers: {
//             Authorization: `Bearer ${token}`,   // ✅ send JWT
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch favorites");
//         const data = await res.json();
//         setFavorites(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error(err);
//         setFavorites([]);
//       }
//     };
//     if (user) fetchFavorites();
//   }, [user]);

//   /* -------- ratings lookup -------- */
//   const productIds = favorites.map((fav) => fav.productId?._id?.toString());
//   const { data: allReviews = [] } = useSWR(
//     productIds.length ? `/api/reviews/batch?ids=${productIds.join(',')}` : null,
//     fetcher
//   );
//   const ratingsMap = {};
//   allReviews.forEach(({ productId, rating }) => {
//     const id = productId.toString();
//     if (!ratingsMap[id]) ratingsMap[id] = { sum: 0, count: 0 };
//     ratingsMap[id].sum += rating;
//     ratingsMap[id].count += 1;
//   });
//   Object.keys(ratingsMap).forEach((id) => {
//     ratingsMap[id].avg = ratingsMap[id].sum / ratingsMap[id].count;
//   });

//   /* -------- handlers -------- */
//   const removeFavorite = async (productId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) return;

//       const res = await fetch("/api/favorites", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,   // ✅ send JWT
//         },
//         body: JSON.stringify({ productId }),
//       });

//       if (res.ok) {
//         setFavorites((prev) =>
//           prev.filter((fav) => fav.productId._id !== productId)
//         );
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAddToCart = (product) => addToCart(product);

//   /* -------- UI -------- */
//   return (
//     <>
//       <Navbar />
//       <div className="p-4 flex flex-col items-center pt-14 mt-8 bg-white text-black dark:bg-black dark:text-white min-h-screen px-6 md:px-16 lg:px-32">
        
//         {/* Header */}
//         <div className="flex flex-col items-center mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
//             <HeartOff className="w-7 h-7 text-orange-600" />
//             Favorites
//           </h1>
//           <div className="w-28 h-1 rounded-full bg-orange-600 mt-2" />
//           <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//             Save the products you love and access them anytime.
//           </p>
//         </div>

//         {/* Empty State */}
//         {favorites.length === 0 ? (
//           <div className="flex flex-col items-center justify-center mt-16 text-center">
//             <img src="document.png" alt='favorites' className="w-32 h-32 text-gray-400 opacity-70 mb-4" />
//             <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
//               Your favorites list is empty
//             </p>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Browse products and tap the heart to save them here.
//             </p>
//             <button
//               onClick={() => router.push("/all-products")}
//               className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-md transition"
//             >
//               Browse Products
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
//             {favorites.map(({ _id, productId }) => {
//               if (productId.visible === false) return null;

//               const pid = productId._id?.toString();
//               const rating = ratingsMap[pid] || { avg: 0, count: 0 };

//               return (
//                 <div
//                   key={_id}
//                   className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-neutral-900 transition hover:shadow-lg hover:-translate-y-1 duration-200"
//                 >
//                   <Link href={`/product/${pid}`} className="block">
//                     <Image
//                       src={productId.image[0]}
//                       alt={productId.name}
//                       width={300}
//                       height={200}
//                       className="w-full h-48 object-cover rounded-t-2xl"
//                     />
//                     <div className="p-4">
//                       <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
//                         {productId.name}
//                       </h2>
//                       <p
//                         className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2"
//                         dangerouslySetInnerHTML={{ __html: productId.description }}
//                       />
//                       <p className="text-base font-bold text-orange-600 mt-2">
//                         {currency}{productId.offerPrice}
//                       </p>
//                       <div className="mt-2 flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
//                         <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                         <span>{rating.avg?.toFixed(1)} ({rating.count} reviews)</span>
//                       </div>
//                     </div>
//                   </Link>

//                   {/* Actions */}
//                   <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 px-4 py-3 text-sm">
//                     <button
//                       className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition"
//                       onClick={() => handleAddToCart(productId)}
//                     >
//                       <ShoppingCart className="w-4 h-4" />
//                       Add to Cart
//                     </button>
//                     <button
//                       className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-600 transition"
//                       onClick={() => removeFavorite(productId._id)}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }






































//....................................................................................................................................
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HeartOff, ShoppingCart, Star, Trash2, PackageX } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------- Fetch helper that injects JWT -------- */
const authFetcher = async (url) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token found");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
};

export default function FavoritesPage() {
  const { addToCart, currency } = useAppContext();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* -------- Fetch favorites -------- */
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authFetcher(`/api/favorites?userId=${user._id}`);
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user, fetchFavorites]);

  /* -------- Ratings lookup -------- */
  const ratingsMap = {};
  favorites.forEach((fav) => {
    const reviews = fav.productId?.reviews || [];
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      ratingsMap[fav.productId._id] = {
        avg: sum / reviews.length,
        count: reviews.length,
      };
    }
  });

  /* -------- Handlers -------- */
  const removeFavorite = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        setFavorites((prev) =>
          prev.filter((fav) => fav.productId?._id !== productId)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = (product) => addToCart(product);

  /* -------- UI -------- */
  return (
    <>
      <Navbar />
      <div className="p-4 flex flex-col items-center pt-14 mt-8 bg-white text-black dark:bg-black dark:text-white min-h-screen px-6 md:px-16 lg:px-32">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <HeartOff className="w-7 h-7 text-orange-600" />
            Favorites
          </h1>
          <div className="w-28 h-1 rounded-full bg-orange-600 mt-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Save the products you love and access them anytime.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500 dark:text-gray-400">Loading favorites...</p>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <img src="document.png" alt='favorites' className="w-32 h-32 opacity-70 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Your favorites list is empty
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Browse products and tap the heart to save them here.
            </p>
            <button
              onClick={() => router.push("/all-products")}
              className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-md transition"
            >
              Browse Products
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {favorites.map(({ _id, productId }) => {
            const isDeleted = !productId;
            const rating = productId ? ratingsMap[productId._id] || { avg: 0, count: 0 } : null;

            return (
              <div
                key={_id}
                className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-neutral-900 transition hover:shadow-lg hover:-translate-y-1 duration-200"
              >
                {/* Product or Deleted placeholder */}
                {isDeleted ? (
                  <div className="block">
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-neutral-800 rounded-t-2xl">
                      <PackageX className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Deleted product
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        This product is no longer available.
                      </p>
                      <p className="text-base font-bold text-gray-400 mt-2">—</p>
                    </div>
                  </div>
                ) : (
                  <Link href={`/product/${productId._id}`} className="block">
                    <Image
                      src={productId.image?.[0] || "/placeholder.png"}
                      alt={productId.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {productId.name}
                      </h2>
                      <p
                        className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: productId.description }}
                      />
                      <p className="text-base font-bold text-orange-600 mt-2">
                        {currency}{productId.offerPrice}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{rating.avg?.toFixed(1)} ({rating.count} reviews)</span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 px-4 py-3 text-sm">
                  {!isDeleted ? (
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition"
                      onClick={() => handleAddToCart(productId)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Unavailable</span>
                  )}
                  <button
                    className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-600 transition"
                    onClick={() => removeFavorite(productId?._id || _id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
