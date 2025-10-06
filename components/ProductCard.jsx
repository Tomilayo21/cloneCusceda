// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation"; // ✅ useRouter directly
// import { useAppContext } from "@/context/AppContext";
// import { useAuth } from "@/context/AuthContext";
// import useSWR from "swr";
// import toast from "react-hot-toast";
// import { Heart, Star, XCircle, ShoppingCart } from "lucide-react";

// const fetcher = (url) => fetch(url).then((res) => res.json());

// const ProductCard = ({ product }) => {
//   if (product.visible === false) return null;

//   const router = useRouter(); // ✅ fixed router
//   const { currency, addToCart, currentUser } = useAppContext();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const [isFavorite, setIsFavorite] = useState(false);
//   const [likes, setLikes] = useState(product.likes || []);
//   const [actionLoading, setActionLoading] = useState(false);

//   const liked = user && likes.includes(user.id);
//   const [showModal, setShowModal] = useState(false);
//   const pressTimer = useRef(null);

//   // ------------------ Long Press Modal ------------------
//   const handleLongPressStart = () => {
//     pressTimer.current = setTimeout(() => setShowModal(true), 500);
//   };
//   const handleLongPressEnd = () => {
//     clearTimeout(pressTimer.current);
//     setShowModal(false);
//   };

//   // ------------------ Toggle Like ------------------
//   const toggleLike = async () => {
//     if (!user) {
//       toast.error("Please login to like products");
//       return;
//     }
//     setActionLoading(true);
//     try {
//       const res = await fetch("/api/likes", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ productId: product._id, userId: user.id }),
//       });
//       const data = await res.json();

//       if (data.liked) {
//         setLikes((prev) => [...prev, user.id]);
//       } else {
//         setLikes((prev) => prev.filter((id) => id !== user.id));
//       }
//     } catch (error) {
//       console.error("Like error:", error);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ------------------ Fetch Favorites ------------------
//   useEffect(() => {
//     const checkFavorite = async () => {
//       if (!currentUser) return;
//       try {
//         const res = await fetch(`/api/favorites?userId=${currentUser._id}`);
//         if (!res.ok) return;
//         const data = await res.json();
//         const found = data.find((f) => f.productId._id === product._id);
//         setIsFavorite(!!found);
//       } catch (err) {
//         console.error("Favorite fetch failed:", err);
//       }
//     };
//     checkFavorite();
//   }, [currentUser, product._id]);

//   // ------------------ Toggle Favorite ------------------
//   const toggleFavorite = async (e) => {
//     e.stopPropagation();
//     if (!currentUser) {
//       toast.error("Please log in first.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch("/api/favorites", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: product._id,
//           userId: currentUser._id,
//         }),
//       });

//       if (res.ok) {
//         setIsFavorite(!isFavorite);

//         toast.custom(
//           (t) => (
//             <div
//               className={`${
//                 t.visible ? "animate-enter" : "animate-leave"
//               } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-2 p-4`}
//             >
//               {isFavorite ? (
//                 <XCircle className="text-red-500" size={20} />
//               ) : (
//                 <Heart className="text-pink-500 fill-pink-500" size={20} />
//               )}
//               <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                 {!isFavorite ? "Added to favorites" : "Removed from favorites"}
//               </p>
//             </div>
//           ),
//           { duration: 2000 }
//         );
//       } else {
//         toast.error("Failed to update favorites");
//       }
//     } catch (error) {
//       toast.error("An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------ Reviews ------------------
//   const { data: reviews = [] } = useSWR(
//     `/api/reviews?productId=${product._id}`,
//     fetcher
//   );
//   const avgRating =
//     reviews.length > 0
//       ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//       : 0;

//   // ------------------ Navigation ------------------
//   const handleCardClick = () => {
//     router.push("/product/" + product._id); // ✅ router fixed
//     scrollTo(0, 0);
//   };

//   // ------------------ Add to Cart ------------------
//   const handleAddToCart = () => {
//     if (loading) return;
//     if (!user) {
//       toast.error("Please login to add items to your cart");
//       return;
//     }
//     addToCart(product);
//   };

//   // ------------------ Render ------------------
//   return (
//     <div
//       onClick={handleCardClick}
//       onMouseDown={handleLongPressStart}
//       onTouchStart={handleLongPressStart}
//       onMouseUp={handleLongPressEnd}
//       onMouseLeave={handleLongPressEnd}
//       onTouchEnd={handleLongPressEnd}
//       className="group flex flex-col max-w-[180px] w-full cursor-pointer rounded-xl shadow-md bg-white dark:bg-gray-900 transition-all hover:shadow-lg hover:scale-[1.02] overflow-hidden"
//     >
//       {/* Image */}
//       <div className="relative h-36 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
//         <Image
//           src={product.image[0]}
//           alt={product.name}
//           width={300}
//           height={300}
//           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//         />

//         {/* Favorite Button */}
//         <button
//           onClick={toggleFavorite}
//           className="absolute top-2 right-2 bg-white/90 dark:bg-gray-700/90 p-1.5 rounded-full shadow-md hover:scale-110 transition"
//           aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
//         >
//           <Heart
//             size={14}
//             className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}
//           />
//         </button>
//       </div>

//       {/* Details */}
//       <div className="p-3 flex flex-col flex-1 text-gray-900 dark:text-white">
//         <h3 className="text-sm font-semibold truncate">{product.name}</h3>
//         <div
//           className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5"
//           dangerouslySetInnerHTML={{ __html: product.description }}
//         />

//         {/* Price / Rating / Cart */}
//         <div className="flex items-center justify-between mt-auto">
//           <div>
//             <p className="text-base font-bold text-orange-600">
//               {currency}
//               {product.offerPrice}
//             </p>
//             <div className="flex items-center gap-1 text-xs text-yellow-500">
//               <Star className="w-3 h-3 fill-yellow-500" />
//               {avgRating.toFixed(1)}
//             </div>
//             {product.stock <= 10 && product.stock > 0 && (
//               <p className="text-[10px] text-orange-600 font-medium mt-1">
//                 Only {product.stock} left!
//               </p>
//             )}
//           </div>

//           {/* Add to Cart Button */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleAddToCart();
//             }}
//             disabled={product.stock === 0}
//             className={`p-1.5 rounded-full shadow-md transition-colors flex items-center justify-center ${
//               product.stock === 0
//                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 : "bg-orange-600 hover:bg-orange-700 text-white"
//             }`}
//             aria-label={product.stock === 0 ? "Sold Out" : "Add to Cart"}
//           >
//             {product.stock === 0 ? (
//               <span className="text-[10px] font-medium">Sold</span>
//             ) : (
//               <ShoppingCart size={14} />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;





































"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useSession } from "next-auth/react";  // ✅ NextAuth
import useSWR from "swr";
import toast from "react-hot-toast";
import { Heart, Star, XCircle, ShoppingCart } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductCard = ({ product }) => {
  if (product.visible === false) return null;

  const router = useRouter();
  const { currency, addToCart, currentUser } = useAppContext();

  const { data: session } = useSession(); // ✅ replace useAuth
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(product.likes || []);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pressTimer = useRef(null);

  const liked = user && likes.includes(user.id);

  // ------------------ Long Press Modal ------------------
  const handleLongPressStart = () => {
    pressTimer.current = setTimeout(() => setShowModal(true), 500);
  };
  const handleLongPressEnd = () => {
    clearTimeout(pressTimer.current);
    setShowModal(false);
  };

  // ------------------ Toggle Like ------------------
  const toggleLike = async () => {
    if (!user) {
      toast.error("Please login to like products");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, userId: user.id }),
      });
      const data = await res.json();

      if (data.liked) {
        setLikes((prev) => [...prev, user.id]);
      } else {
        setLikes((prev) => prev.filter((id) => id !== user.id));
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // ------------------ Fetch Favorites ------------------
  useEffect(() => {
    const checkFavorite = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch(`/api/favorites?userId=${currentUser._id}`);
        if (!res.ok) return;
        const data = await res.json();
        const found = data.find((f) => f.productId._id === product._id);
        setIsFavorite(!!found);
      } catch (err) {
        console.error("Favorite fetch failed:", err);
      }
    };
    checkFavorite();
  }, [currentUser, product._id]);

  // ------------------ Toggle Favorite ------------------
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          userId: user.id,
        }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);

        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-2 p-4`}
            >
              {isFavorite ? (
                <XCircle className="text-red-500" size={20} />
              ) : (
                <Heart className="text-pink-500 fill-pink-500" size={20} />
              )}
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {!isFavorite ? "Added to favorites" : "Removed from favorites"}
              </p>
            </div>
          ),
          { duration: 2000 }
        );
      } else {
        toast.error("Failed to update favorites");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Reviews ------------------
  const { data: reviews = [] } = useSWR(
    `/api/reviews?productId=${product._id}`,
    fetcher
  );
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // ------------------ Navigation ------------------
  const handleCardClick = () => {
    router.push("/product/" + product._id);
    scrollTo(0, 0);
  };

  // ------------------ Add to Cart ------------------
  const handleAddToCart = () => {
    if (loading) return;
    if (!user) {
      toast.error("Please login to add items to your cart");
      return;
    }
    addToCart(product);
  };

  // ------------------ Render ------------------
  return (
    <div
      onClick={handleCardClick}
      onMouseDown={handleLongPressStart}
      onTouchStart={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
      onTouchEnd={handleLongPressEnd}
      className="group flex flex-col max-w-[180px] w-full cursor-pointer rounded-xl shadow-md bg-white dark:bg-gray-900 transition-all hover:shadow-lg hover:scale-[1.02] overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-36 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <Image
          src={product.image[0]}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-white/90 dark:bg-gray-700/90 p-1.5 rounded-full shadow-md hover:scale-110 transition"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={14}
            className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}
          />
        </button>
      </div>

      {/* Details */}
      <div className="p-3 flex flex-col flex-1 text-gray-900 dark:text-white">
        <h3 className="text-sm font-semibold truncate">{product.name}</h3>
        <div
          className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        {/* Price / Rating / Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-base font-bold text-orange-600">
              {currency}
              {product.offerPrice}
            </p>
            <div className="flex items-center gap-1 text-xs text-yellow-500">
              <Star className="w-3 h-3 fill-yellow-500" />
              {avgRating.toFixed(1)}
            </div>
            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-[10px] text-orange-600 font-medium mt-1">
                Only {product.stock} left!
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.stock === 0}
            className={`p-1.5 rounded-full shadow-md transition-colors flex items-center justify-center ${
              product.stock === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
            aria-label={product.stock === 0 ? "Sold Out" : "Add to Cart"}
          >
            {product.stock === 0 ? (
              <span className="text-[10px] font-medium">Sold</span>
            ) : (
              <ShoppingCart size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
