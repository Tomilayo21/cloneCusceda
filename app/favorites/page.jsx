'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const FavoritesPage = () => {
  const { addToCart, currency } = useAppContext();
  const { user } = useClerk();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    };
    if (user) fetchFavorites();
  }, [user]);

  const productIds = favorites.map(fav => fav.productId?._id?.toString());
  const { data: allReviews = [] } = useSWR(
    productIds.length > 0 ? `/api/reviews/batch?ids=${productIds.join(',')}` : null,
    fetcher
  );

  const ratingsMap = {};
  allReviews.forEach(({ productId, rating }) => {
    const id = productId.toString();
    if (!ratingsMap[id]) ratingsMap[id] = { sum: 0, count: 0 };
    ratingsMap[id].sum += rating;
    ratingsMap[id].count += 1;
  });

  Object.keys(ratingsMap).forEach(id => {
    ratingsMap[id].avg = ratingsMap[id].sum / ratingsMap[id].count;
  });

  const removeFavorite = async (productId) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    setFavorites(prev => prev.filter(fav => fav.productId._id !== productId));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="p-4 flex flex-col items-center pt-14">
      <Navbar />
      <div className="flex flex-col items-center mt-8 mb-4">
        <p className="text-3xl font-medium">
          My <span className="text-orange-600">Favorites</span>
        </p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favorites.map(({ _id, productId }) => {
            const pid = productId._id?.toString();
            const rating = ratingsMap[pid] || { avg: 0, count: 0 };

            return (
              <div key={_id} className="border p-3 rounded shadow-sm">
                <Image
                  src={productId.image[0]}
                  alt={productId.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded"
                />
                <h2 className="mt-2 font-medium text-lg">{productId.name}</h2>
                <p className="text-sm text-gray-600 truncate">{productId.description}</p>
                <p className="text-sm mt-1 font-semibold">
                  {currency}
                  {productId.offerPrice}
                </p>
                <div className="mt-2 text-sm text-gray-700">
                  <p>Average Rating: {rating.avg?.toFixed(1)} ⭐</p>
                  <p>{rating.count} Reviews</p>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                    onClick={() => handleAddToCart(productId)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="px-2 py-1 text-red-500 hover:underline"
                    onClick={() => removeFavorite(productId._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FavoritesPage;
