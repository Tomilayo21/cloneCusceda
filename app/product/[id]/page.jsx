'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';
import { useAppContext } from '@/context/AppContext';
import { useUser } from '@clerk/nextjs';
import { FaStar, FaRegStar } from 'react-icons/fa';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart, currency } = useAppContext();
  const { user } = useUser();

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUsers, setLikeUsers] = useState([]);

  const reviewsPerPage = 5;


  useEffect(() => {
  if (!id || !products.length) return;
  const product = products.find(p => p._id === id);
  if (product) {
    setProductData(product);
    setLikeCount(product.likes?.length || 0);
    if (user) {
      setLiked(product.likes?.includes(user.id));
    }
  }
}, [id, products, user]);


useEffect(() => {
  if (productData?.likes?.length > 0) {
    fetch('/api/likes/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: productData.likes }),
    })
    .then(res => res.json())
    .then(data => setLikeUsers(data.users || []));
  }
}, [productData]);


  const toggleLike = async () => {
  if (!user) return router.push('/login');

  const res = await fetch('/api/likes', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: id, userId: user.id }),
  });

  const data = await res.json();

  if (res.ok) {
    setLiked(data.liked);
    setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
  } else {
    alert(data.message || 'Failed to update like');
  }
};

useEffect(() => {
  if (productData?.likes?.length > 0) {
    fetch('/api/likes/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: productData.likes }),
    })
    .then(res => res.json())
    .then(data => setLikeUsers(data.users || []));
  }
}, [productData]);

useEffect(() => {
  setProductData(products.find(p => p._id === id) || null);
}, [id, products]);

useEffect(() => {
  if (!id) return;
  fetch(`/api/reviews?productId=${id}`)
    .then(res => res.json())
    .then(data => setReviews(data));
}, [id]);

const handleAddToCart = () => {
  if (!user) return router.push('/login');
  addToCart(productData);
};

const handleSubmitReview = async () => {
  if (!user) return alert('Please log in to submit a review.');
  await fetch('/api/reviews', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ productId: id, rating, comment, userName: user.fullName || 'Anonymous' })
  });
  setRating(5);
  setComment('');
  setPage(1);
  const refreshed = await fetch(`/api/reviews?productId=${id}`).then(r => r.json());
  setReviews(refreshed);
};

  if (!productData) return <Loading />;

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const start = (page - 1) * reviewsPerPage;
  const current = reviews.slice(start, start + reviewsPerPage);
  const relatedProducts = products.filter(p => p.category === productData.category && p._id !== id).slice(0, 4);
  const visibleRelatedProducts = relatedProducts.filter(p => p.visible !== false);

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) =>
          i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className=" flex flex-col items-center mt-8 mb-8 bg-white text-black dark:bg-black dark:text-white min-h-screen">
        <div className="px-6 md:px-16 lg:px-32 mt-16 space-y-10">
          {/* Product Info */}
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                <Image
                  src={mainImage || productData.image[0]}
                  alt={productData.name}
                  width={1280} height={720}
                  className="w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productData.image.map((img,i) => (
                  <div key={i} className="cursor-pointer" onClick={()=>setMainImage(img)}>
                    <Image src={img} alt="" width={200} height={200} className="w-full h-auto object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-black dark:text-white">{productData.name}</h1>
              <p className="mt-2 text-black dark:text-white">{productData.description}</p>
              <div className="mt-4">
                <span className="text-2xl font-semibold text-black dark:text-white">{currency}{productData.offerPrice}</span>
                <span className="line-through text-gray-500 dark:text-gray-400 ml-2">{currency}{productData.price}</span>
              </div>
              <div className="overflow-x-auto mt-4">
                  <table className="table-auto border-collapse w-full max-w-72 text-black dark:text-white">
                      <tbody>
                          <tr>
                              <td className="font-medium">Brand</td>
                              <td>{productData.brand}</td>
                          </tr>
                          <tr>
                              <td className="font-medium">Color</td>
                              <td>{productData.color}</td>
                          </tr>
                          <tr>
                              <td className="font-medium">Category</td>
                              <td>{productData.category}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={toggleLike}
                  className={`px-3 py-1 border rounded text-sm ${
                    liked ? 'bg-black text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  {liked ? '♥ Liked' : '♡ Like'}
                </button>
                <span className="text-black dark:text-white text-sm">{likeCount} like{likeCount !== 1 && 's'}</span>
                 {likeUsers.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {likeUsers.length === 1 ? (
                      <>Liked by {likeUsers[0].fullName || 'Anonymous'}</>
                    ) : (
                      <>Liked by {likeUsers[0].fullName || 'Anonymous'} and {likeUsers.length - 1} other{likeUsers.length - 1 > 1 ? 's' : ''}</>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex gap-4">
                <button 
                onClick={handleAddToCart} 
                disabled={productData.stock === 0}
                className="px-3 py-1 text-lg bg-orange-600 text-white border border-gray-300 rounded hover:bg-slate-50 hover:text-black cursor-pointer transition"
              >
                {productData.stock === 0 ? "Sold Out" : "Add to Cart"}
              </button>
                {productData.stock > 0 && (
                  <button 
                    onClick={() => router.push('/cart')} 
                    className="px-6 py-2 border border-black-600 rounded text-orange-600 hover:bg-black-50"
                  >
                    Go to Cart
                  </button>
                )}
              </div>

              {/* Submit Review */}
              <div className="mt-8">
                {user ? (
                  <>
                    <h2 className="font-semibold mb-2 text-black dark:text-white">Leave a Review</h2>
                    <label className="flex items-center gap-2 mb-2 text-black dark:text-white" htmlFor="rating-select">
                      Rating:
                      <select
                        id="rating-select"
                        value={rating}
                        onChange={e => setRating(+e.target.value)}
                        className="border rounded p-1 text-black dark:text-white bg-white dark:bg-gray-900"
                      >
                        {[1,2,3,4,5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="w-full border rounded p-2 mb-2 text-black dark:text-white bg-white dark:bg-gray-900"
                      placeholder="Your comment..."
                    />
                    <button
                      onClick={handleSubmitReview}
                      className="px-4 py-2 bg-black text-white rounded"
                    >
                      Submit Review
                    </button>
                  </>
                ) : (
                  <p className="text-red-600">Please sign in to leave a review.</p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List with Pagination */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-black dark:text-white">Reviews</h2>
            {current.length === 0 ? (
              <p className="text-black dark:text-white">No reviews yet.</p>
            ) : current.map(r => (
              <div key={r._id} className="border-b pb-2">
                <p className="font-semibold text-black dark:text-white">{r.userName}</p>
                {renderStars(r.rating)}
                <p className="text-black dark:text-white">{r.comment}</p>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 text-black dark:text-white"
                >
                  Prev
                </button>
                <span className="text-black dark:text-white">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 text-black dark:text-white"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Related Products */}
          {/* {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )} */}
          {visibleRelatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {visibleRelatedProducts.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}


        </div>
      </div>
      <Footer />

    </>
  );
}
