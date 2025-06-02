'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { useClerk } from '@clerk/nextjs';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductCard = ({ product }) => {
  const { currency, router, addToCart, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;

      const res = await fetch('/api/favorites');
      const data = await res.json();
      const found = data.find(f => f.productId._id === product._id);
      setIsFavorite(!!found);
    };

    checkFavorite();
  }, [user, product._id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) return openSignIn();

    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id }),
    });

    setIsFavorite(!isFavorite); // Optimistic update
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
    router.push('/product/' + product._id);
    scrollTo(0, 0);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to add items to cart.');
      openSignIn();
      return;
    }
    addToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      <div className="relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden group">
        <Image
          src={product.image[0]}
          alt={product.name}
          width={800}
          height={800}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow-md ${
            isFavorite ? 'text-red-500' : ''
          }`}
        >
          <Image
            src={assets.heart_icon}
            alt="heart_icon"
            width={12}
            height={12}
            className={`transition-transform ${isFavorite ? 'scale-110' : ''}`}
          />
        </button>
      </div>

      <p className="text-base font-medium pt-2 w-full truncate">{product.name}</p>
      <p className="text-xs text-gray-500/70 w-full truncate max-sm:hidden">
        {product.description}
      </p>

      <div className="mt-2 text-sm text-gray-700">
        <p>Average Rating: {avgRating.toFixed(1)} ⭐</p>
        <p>{reviews.length} Reviews</p>
      </div>

      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">
          {currency}
          {product.offerPrice}
        </p>
        {/* <button
          onClick={handleAddToCart}
          className="px-3 py-1 text-xs text-gray-500 border border-gray-300 rounded-full hover:bg-slate-50 transition"
        >
          Add to Cart
        </button> */}
        {/* <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
        {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
      </p> */}
      <button 
        onClick={handleAddToCart} 
        disabled={product.stock === 0}
        className="px-3 py-1 text-xs text-gray-500 border border-gray-300 rounded-full hover:bg-slate-50 transition"
      >
        {product.stock === 0 ? "Sold Out" : "Add to Cart"}
      </button>
      </div>
    </div>
  );
};

export default ProductCard;



