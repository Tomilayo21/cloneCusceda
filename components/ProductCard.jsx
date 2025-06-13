"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Heart} from "lucide-react"; // <-- import Heart icon

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductCard = ({ product }) => {
  if (product.visible === false) return null;

  const { currency, router, addToCart, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(product.likes || []);
  const [loading, setLoading] = useState(false);

  const liked = user && likes.includes(user.id);

  const toggleLike = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch('/api/likes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, userId: user.id }),
      });
      const data = await res.json();

      if (data.liked) {
        setLikes(prev => [...prev, user.id]);
      } else {
        setLikes(prev => prev.filter(id => id !== user.id));
      }
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;

      const res = await fetch("/api/favorites");
      const data = await res.json();
      const found = data.find((f) => f.productId._id === product._id);
      setIsFavorite(!!found);
    };

    checkFavorite();
  }, [user, product._id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) return openSignIn();

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
      } else {
        toast.error("Failed to update favorites");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const { data: reviews = [] } = useSWR(
    `/api/reviews?productId=${product._id}`,
    fetcher
  );

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleCardClick = () => {
    router.push("/product/" + product._id);
    scrollTo(0, 0);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please log in to add items to cart.");
      openSignIn();
      return;
    }
    addToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer mb-16"
    >
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden group">
        <Image
          src={product.image[0]}
          alt={product.name}
          width={800}
          height={800}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <Heart fill="red" color="red" size={15} />
          ) : (
            <Heart size={15} />
          )}
        </button>
      </div>

      <p className="text-base font-medium pt-2 w-full truncate text-black dark:text-white">
        {product.name}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 w-full truncate max-sm:hidden">
        {product.description}
      </p>

      <div className="mt-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
        <div>
          <p className="mb-2">Average Rating: {avgRating.toFixed(1)} ⭐</p>
          <p>{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</p>
        </div>

        <div className="ml-4 mt-5 text-sm text-gray-600 dark:text-gray-400">
          <p>{likes.length} {likes.length === 1 ? 'like' : 'likes'}</p>
        </div>
      </div>


      {/* {user && (
        <button onClick={toggleLike} disabled={loading} aria-label="Toggle Like">
        <Heart
          className={`w-5 h-5 transition ${
            liked ? 'text-red-500 fill-red-500' : 'text-gray-500'
          }`}
        />
      </button>
      )} */}

      

      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium text-black dark:text-white">
          {currency}
          {product.offerPrice}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-slate-50 dark:hover:bg-gray-700 transition"
        >
          {product.stock === 0 ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
