// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import RelatedProducts from '@/components/RelatedProducts';


// import Loading from '@/components/Loading';
// import { useAppContext } from '@/context/AppContext';
// import { useUser } from '@clerk/nextjs';
// import { FaStar, FaRegStar } from 'react-icons/fa';
// import { ThumbsUp } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { Heart, ShoppingCart, ArrowRight, Star, CheckCircle, XCircle, Tag } from "lucide-react";
// import { useMemo } from 'react';


// export default function ProductPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { products, addToCart, currency } = useAppContext();
//   const { user } = useUser();
//   const [productData, setProductData] = useState(null);
//   const [mainImage, setMainImage] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState('');
//   const [page, setPage] = useState(1);
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [likeUsers, setLikeUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const reviewsPerPage = 5;


//   useEffect(() => {
//     if (!id || !products.length) return;
//     const product = products.find(p => p._id === id);
//     if (product) {
//       setProductData(product);
//       setLikeCount(product.likes?.length || 0);
//       if (user) {
//         setLiked(product.likes?.includes(user.id));
//       }
//     }
//   }, [id, products, user]);


//   useEffect(() => {
//     if (productData?.likes?.length > 0) {
//       fetch('/api/likes/users', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userIds: productData.likes }),
//       })
//       .then(res => res.json())
//       .then(data => setLikeUsers(data.users || []));
//     }
//   }, [productData]);

//   const toggleLike = async () => {
//     if (!user) return router.push('/login');

//     try {
//       const res = await fetch('/api/likes', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ productId: id, userId: user.id }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || 'Failed to update like');
//         return;
//       }

//       setLiked(data.liked);
//       setLikeCount((prev) => data.liked ? prev + 1 : prev - 1);

//       // Optimistically update likeUsers state
//       setLikeUsers((prevUsers) => {
//         if (data.liked) {
//           // Add user to the list if not already present
//           const alreadyLiked = prevUsers.some((u) => u.id === user.id);
//           if (!alreadyLiked) {
//             return [{ id: user.id, fullName: user.username || 'Anonymous' }, ...prevUsers];
//           }
//           return prevUsers;
//         } else {
//           // Remove user from the list
//           return prevUsers.filter((u) => u.id !== user.id);
//         }
//       });
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       alert('Something went wrong while updating the like.');
//     }
//   };

//   useEffect(() => {
//     if (productData?.likes?.length > 0) {
//       fetch('/api/likes/users', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userIds: productData.likes }),
//       })
//       .then(res => res.json())
//       .then(data => setLikeUsers(data.users || []));
//     }
//   }, [productData]);

//   useEffect(() => {
//     setProductData(products.find(p => p._id === id) || null);
//   }, [id, products]);

//   useEffect(() => {
//     if (!id) return;
//     fetch(`/api/reviews?productId=${id}`)
//       .then(res => res.json())
//       .then(data => setReviews(data));
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!user) return router.push('/login');
//     addToCart(productData);
//   };

//   const handleSubmitReview = async () => {
//     if (!user) return alert('Please log in to submit a review.');
//     const alreadyReviewed = reviews.some(
//       (r) => r.userId === user?.id // or user?.email depending on what you store
//     );

//     if (alreadyReviewed) {
//       toast.error("You have already reviewed this product.");
//       return;
//     }
    
//     try {
//       setLoading(true); // start loading before the request

//       await fetch('/api/reviews', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: id,
//           rating,
//           comment,
//           userId: user.id, // include this if you're storing userId
//           // userName: user.fullName || 'Anonymous',
//           username: user.username || 'unknown'
//         }),
//       });

//       toast.success("Review submitted successfully!");
//       setRating(5);
//       setComment('');
//       setPage(1);

//       const refreshed = await fetch(`/api/reviews?productId=${id}`).then(r => r.json());
//       setReviews(refreshed);
//     } catch (err) {
//       toast.error("Something went wrong.");
//     } finally {
//       setLoading(false); 
//     }
//   };

//   const handleHelpfulClick = async (reviewId) => {
//     try {
//       const res = await fetch('/api/reviews/helpful', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ reviewId }),
//       });

//       if (!res.ok) throw new Error('Failed to mark helpful');

//       const data = await res.json();

//       // update helpful count in local state
//       setReviews(prev =>
//         prev.map(r =>
//           r._id === reviewId ? { ...r, helpful: data.helpful } : r
//         )
//       );
//     } catch (err) {
//       toast.error('Something went wrong');
//     }
//   };
//   if (!productData) return <Loading />;

//   const totalPages = Math.ceil(reviews.length / reviewsPerPage);
//   const start = (page - 1) * reviewsPerPage;
//   const currentReviews = reviews.slice(start, start + reviewsPerPage);
//   const relatedProducts = products.filter(p => p.category === productData.category && p._id !== id).slice(0, 4);
//   const visibleRelatedProducts = relatedProducts.filter(p => p.visible !== false);

//   const renderStars = (rating) => {
//     return (
//       <div className="flex text-yellow-500">
//         {[...Array(5)].map((_, i) =>
//           i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
//         )}
//       </div>
//     );
//   };

//   return (
//   <>
//     <Navbar />
//       <div className=" flex flex-col items-center mt-8 mb-8 bg-white text-black dark:bg-black dark:text-white min-h-screen">
//         <div className="px-6 md:px-16 lg:px-32 mt-8 space-y-10">
//           {/* Product Info */}
//           <div className="grid md:grid-cols-2 gap-16 mt-8">
//             {/* Left: Product Images */}
//             <div>
//               <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6 shadow-md">
//                 <Image
//                   src={mainImage || productData.image[0]}
//                   alt={productData.name}
//                   width={1280}
//                   height={720}
//                   className="w-full h-[400px] object-cover"
//                 />
//               </div>
//               <div className="grid grid-cols-4 gap-3">
//                 {productData.image.map((img, i) => (
//                   <div
//                     key={i}
//                     onClick={() => setMainImage(img)}
//                     className="cursor-pointer rounded-xl overflow-hidden border hover:ring-2 hover:ring-orange-500 transition"
//                   >
//                     <Image
//                       src={img}
//                       alt="Product thumbnail"
//                       width={200}
//                       height={200}
//                       className="w-full h-24 object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right: Product Info */}
//             <div className="flex flex-col">
//               {/* Title + Rating */}
//               <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 {productData.name}
//               </h1>
//               {/* <div className="flex items-center gap-2 mb-4">
//                 {renderStars(
//                   Math.round(
//                     reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0
//                   )
//                 )}
//                 <span className="text-sm text-gray-500">
//                   ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
//                 </span>
//               </div> */}

//               <div className="flex items-center gap-2 mb-4">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     size={20}
//                     className={
//                       i <
//                       Math.round(
//                         reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0
//                       )
//                         ? "text-yellow-500 fill-yellow-500"
//                         : "text-gray-300"
//                     }
//                   />
//                 ))}
//                 <span className="text-sm text-gray-500">
//                   ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
//                 </span>
//               </div>

//               {/* Description */}
//               <div
//                 className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
//                 dangerouslySetInnerHTML={{ __html: productData.description }}
//               />

//               {/* Price */}
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="text-3xl font-bold text-orange-600 flex items-center gap-1">
//                   <Tag size={20} />
//                   {currency}
//                   {productData.offerPrice}
//                 </span>
//                 <span className="line-through text-gray-500 dark:text-gray-400">
//                   {currency}
//                   {productData.price}
//                 </span>
//               </div>

//               {/* Specs Table */}
//               <div className="overflow-x-auto mb-6">
//                 <table className="table-auto border-collapse w-full max-w-sm text-sm">
//                   <tbody>
//                     <tr>
//                       <td className="font-medium py-2 pr-4 text-gray-700 dark:text-gray-300">
//                         Brand
//                       </td>
//                       <td>{productData.brand}</td>
//                     </tr>
//                     <tr>
//                       <td className="font-medium py-2 pr-4 text-gray-700 dark:text-gray-300">
//                         Color
//                       </td>
//                       <td>{productData.color}</td>
//                     </tr>
//                     <tr>
//                       <td className="font-medium py-2 pr-4 text-gray-700 dark:text-gray-300">
//                         Category
//                       </td>
//                       <td>{productData.category}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Like + Likes Info */}
//               {/* <div className="flex items-center gap-2 mb-6">
//                 <button
//                   onClick={toggleLike}
//                   className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
//                     liked
//                       ? "bg-red-500 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
//                   }`}
//                 >
//                   <Heart size={16} className={liked ? "fill-white" : ""} />
//                   {liked ? "Liked" : "Like"}
//                 </button>
//                 <span className="text-gray-600 dark:text-gray-300 text-sm">
//                   {likeCount} like{likeCount !== 1 && "s"}
//                 </span>
//                 {likeUsers.length > 0 && (
//                   <span className="text-xs text-gray-500">
//                     {likeUsers.length === 1 ? (
//                       <>Liked by {likeUsers[0].username || "Anonymous"}</>
//                     ) : (
//                       <>
//                         Liked by {likeUsers[0].username || "Anonymous"} and{" "}
//                         {likeUsers.length - 1} others
//                       </>
//                     )}
//                   </span>
//                 )}
//               </div> */}
//               <div className="flex items-center gap-2 mb-6">
//                 <button
//                   onClick={toggleLike}
//                   className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
//                     liked
//                       ? "bg-red-500 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
//                   }`}
//                 >
//                   <Heart size={16} className={liked ? "fill-white" : ""} />
//                   {liked ? "Liked" : "Like"}
//                 </button>

//                 {/* ✅ Only show like count if > 0 */}
//                 {likeCount > 0 && (
//                   <span className="text-gray-600 dark:text-gray-300 text-sm">
//                     {likeCount} like{likeCount !== 1 && "s"}
//                   </span>
//                 )}

//                 {/* ✅ Only show usernames if there are likes */}
//                 {likeUsers.length > 0 && (
//                   <span className="text-xs text-gray-500">
//                     {likeUsers.length === 1 ? (
//                       <>Liked by {likeUsers[0].username || "Anonymous"}</>
//                     ) : (
//                       <>
//                         Liked by {likeUsers[0].username || "Anonymous"} and{" "}
//                         {likeUsers.length - 1} others
//                       </>
//                     )}
//                   </span>
//                 )}
//               </div>


//               {/* CTA Buttons */}
//               <div className="flex gap-4 mb-10">
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={productData.stock === 0}
//                   className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition disabled:opacity-50"
//                 >
//                   <ShoppingCart size={18} />
//                   {productData.stock === 0 ? "Sold Out" : "Add to Cart"}
//                 </button>
//                 {productData.stock > 0 && (
//                   <button
//                     onClick={() => router.push("/cart")}
//                     className="flex items-center gap-2 px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition"
//                   >
//                     Go to Cart
//                     <ArrowRight size={18} />
//                   </button>
//                 )}
//               </div>

//               {/* Submit Review */}
//               <div>
//                 {user ? (
//                   <>
//                     <h2 className="font-semibold mb-2 text-lg text-gray-900 dark:text-white">
//                       Leave a Review
//                     </h2>
//                     <label
//                       className="flex items-center gap-2 mb-2 text-sm text-gray-700 dark:text-gray-300"
//                       htmlFor="rating-select"
//                     >
//                       Rating:
//                       <select
//                         id="rating-select"
//                         value={rating}
//                         onChange={(e) => setRating(+e.target.value)}
//                         className="border rounded px-2 py-1 text-black dark:text-white bg-white dark:bg-gray-900"
//                       >
//                         {[1, 2, 3, 4, 5].map((n) => (
//                           <option key={n} value={n}>
//                             {n}
//                           </option>
//                         ))}
//                       </select>
//                     </label>
//                     <textarea
//                       rows={3}
//                       value={comment}
//                       onChange={(e) => setComment(e.target.value)}
//                       className="w-full border rounded-lg p-2 mb-3 text-black dark:text-white bg-white dark:bg-gray-900"
//                       placeholder="Your comment..."
//                     />
//                     <button
//                       onClick={handleSubmitReview}
//                       disabled={loading}
//                       className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
//                     >
//                       {loading ? (
//                         <>
//                           <XCircle size={16} /> Submitting...
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle size={16} /> Submit Review
//                         </>
//                       )}
//                     </button>
//                   </>
//                 ) : (
//                   <p className="text-red-600 text-sm">
//                     Please sign in to leave a review.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Reviews List with Pagination */}
//           <div className="w-full md:w-1/2">
//             {/* Section Heading */}
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                 <span className="text-orange-600">Customer Reviews</span>
//               </h2>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 See what others are saying about this product
//               </p>
//             </div>

//             {/* Reviews List */}
//             <div className="space-y-6">
//               {currentReviews.length === 0 ? (
//                 <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-8 border rounded-xl bg-gray-50 dark:bg-gray-900/40">
//                   No reviews yet. Be the first to review this product!
//                 </p>
//               ) : (
//                 <>
//                   {[...currentReviews]
//                     .sort((a, b) => b.rating - a.rating)
//                     .map((r) => {
//                       const foundHelpful = r.helpful?.includes(user?.id);

//                       return (
//                         <div
//                           key={r._id}
//                           className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-900 transition hover:shadow-md"
//                         >
//                           {/* User + Date */}
//                           <div className="flex items-center justify-between mb-2">
//                             <p className="font-semibold text-gray-900 dark:text-white">
//                               {r.username}
//                             </p>
//                             <span className="text-xs text-gray-500">
//                               {new Date(r.createdAt).toLocaleDateString("en-GB")}
//                             </span>
//                           </div>

//                           {/* Rating */}
//                           <div className="flex items-center gap-1 mb-2">
//                             {renderStars(r.rating)}
//                           </div>

//                           {/* Comment */}
//                           <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
//                             {r.comment}
//                           </p>

//                           {/* Helpful Button */}
//                           <div className="flex items-center gap-3 mt-3">
//                             <button
//                               onClick={() => handleHelpfulClick(r._id)}
//                               className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
//                                 foundHelpful
//                                   ? "bg-orange-500 text-white shadow-sm"
//                                   : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50"
//                               }`}
//                             >
//                               <ThumbsUp size={16} />
//                               {foundHelpful ? "Helpful" : "Mark as Helpful"}
//                             </button>
//                             <span className="text-sm text-gray-500">
//                               {r.helpful?.length === 1
//                                 ? "1 person found this helpful"
//                                 : `${r.helpful?.length || 0} people found this helpful`}
//                             </span>
//                           </div>
//                         </div>
//                       );
//                     })}

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="flex justify-center mt-8">
//                       <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow border">
//                         {/* Prev */}
//                         <button
//                           onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                           disabled={page === 1}
//                           className={`px-3 py-1 rounded-md text-sm font-medium transition ${
//                             page === 1
//                               ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
//                               : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-50"
//                           }`}
//                         >
//                           Prev
//                         </button>

//                         {[...Array(totalPages)].map((_, index) => {
//                           const pageNum = index + 1;
//                           const isActive = page === pageNum;

//                           const shouldShow =
//                             totalPages <= 7 ||
//                             pageNum === 1 ||
//                             pageNum === totalPages ||
//                             (pageNum >= page - 1 && pageNum <= page + 1);

//                           if (!shouldShow && totalPages > 7) {
//                             if (
//                               (pageNum === 2 && page > 4) ||
//                               (pageNum === totalPages - 1 && page < totalPages - 3)
//                             ) {
//                               return (
//                                 <span
//                                   key={pageNum}
//                                   className="px-2 text-gray-400 dark:text-gray-500"
//                                 >
//                                   ...
//                                 </span>
//                               );
//                             }
//                             return null;
//                           }

//                           return (
//                             <button
//                               key={pageNum}
//                               onClick={() => setPage(pageNum)}
//                               className={`px-3 py-1 rounded-md text-sm font-medium transition ${
//                                 isActive
//                                   ? "bg-orange-600 text-white shadow"
//                                   : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-50"
//                               }`}
//                             >
//                               {pageNum}
//                             </button>
//                           );
//                         })}

//                         {/* Next */}
//                         <button
//                           onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//                           disabled={page === totalPages}
//                           className={`px-3 py-1 rounded-md text-sm font-medium transition ${
//                             page === totalPages
//                               ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
//                               : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-50"
//                           }`}
//                         >
//                           Next
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>



//           {/* Related Products */}
//           {visibleRelatedProducts.length > 0 && (
//             <section className="mt-10">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
//                   Related Products
//                 </h2>
//                 {/* <span className="text-sm text-gray-500 dark:text-gray-400">
//                   {visibleRelatedProducts.length} products
//                 </span> */}
//               </div>

//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {visibleRelatedProducts.map((p) => (
//                   <div
//                     key={p._id}
//                     className="transition-transform hover:scale-[1.02] duration-200"
//                   >
//                     <RelatedProducts product={p} />
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//         </div>
//       </div>
//     <Footer />
//   </>
// );

// }











































































































"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedProducts from "@/components/RelatedProducts";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { Heart, ShoppingCart, ArrowRight, Star, CheckCircle, XCircle, Tag } from "lucide-react";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart, currency, currentUser } = useAppContext();
  
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUsers, setLikeUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const reviewsPerPage = 5;

  // Load product data and initial like state
  useEffect(() => {
    if (!id || !products.length) return;
    const product = products.find((p) => p._id === id);
    if (product) {
      setProductData(product);
      setLikeCount(product.likes?.length || 0);
      if (currentUser) {
        setLiked(product.likes?.includes(currentUser._id));
      }
    }
  }, [id, products, currentUser]);

  // Load like users
  useEffect(() => {
    if (productData?.likes?.length > 0) {
      fetch("/api/likes/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: productData.likes }),
      })
        .then((res) => res.json())
        .then((data) => setLikeUsers(data.users || []));
    }
  }, [productData]);

  // Load reviews
  useEffect(() => {
    if (!id) return;
    fetch(`/api/reviews?productId=${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [id]);

  const toggleLike = async () => {
    if (!currentUser) return router.push("/login");

    try {
      const res = await fetch("/api/likes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, userId: currentUser._id }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update like");
        return;
      }

      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));

      setLikeUsers((prevUsers) => {
        if (data.liked) {
          const alreadyLiked = prevUsers.some((u) => u.id === currentUser._id);
          if (!alreadyLiked) {
            return [{ id: currentUser._id, username: currentUser.username || "Anonymous" }, ...prevUsers];
          }
          return prevUsers;
        } else {
          return prevUsers.filter((u) => u.id !== currentUser._id);
        }
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Something went wrong while updating the like.");
    }
  };

  const handleAddToCart = () => {
    if (!currentUser) return router.push("/login");
    addToCart(productData);
  };

  const handleSubmitReview = async () => {
    if (!currentUser) return alert("Please log in to submit a review.");

    const alreadyReviewed = reviews.some((r) => r.userId === currentUser._id);
    if (alreadyReviewed) {
      toast.error("You have already reviewed this product.");
      return;
    }

    try {
      setLoading(true);
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          rating,
          comment,
          userId: currentUser._id,
          username: currentUser.username || "unknown",
        }),
      });

      toast.success("Review submitted successfully!");
      setRating(5);
      setComment("");
      setPage(1);

      const refreshed = await fetch(`/api/reviews?productId=${id}`).then((r) => r.json());
      setReviews(refreshed);
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    try {
      const res = await fetch("/api/reviews/helpful", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      if (!res.ok) throw new Error("Failed to mark helpful");

      const data = await res.json();

      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, helpful: data.helpful } : r))
      );
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (!productData) return <Loading />;

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const start = (page - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(start, start + reviewsPerPage);

  const relatedProducts = products
    .filter((p) => p.category === productData.category && p._id !== id)
    .slice(0, 4)
    .filter((p) => p.visible !== false);

  const renderStars = (rating) => (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, i) => (i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-8 mb-8 bg-white text-black dark:bg-black dark:text-white min-h-screen">
        <div className="px-6 md:px-16 lg:px-32 mt-8 space-y-10">
          {/* Product Info */}
          <div className="grid md:grid-cols-2 gap-16 mt-8">
            {/* Left: Product Images */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6 shadow-md">
                <Image
                  src={mainImage || productData.image[0]}
                  alt={productData.name}
                  width={1280}
                  height={720}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {productData.image.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setMainImage(img)}
                    className="cursor-pointer rounded-xl overflow-hidden border hover:ring-2 hover:ring-orange-500 transition"
                  >
                    <Image src={img} alt="Product thumbnail" width={200} height={200} className="w-full h-24 object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{productData.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i <
                      Math.round(
                        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0
                      )
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-gray-500">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>

              {/* Description */}
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-orange-600 flex items-center gap-1">
                  <Tag size={20} />
                  {currency}
                  {productData.offerPrice}
                </span>
                <span className="line-through text-gray-500 dark:text-gray-400">
                  {currency}
                  {productData.price}
                </span>
              </div>

              {/* Specs Table */}
              <div className="overflow-x-auto mb-6">
                <table className="table-auto border-collapse w-full max-w-sm text-sm">
                  <tbody>
                    <tr>
                      <td className="font-medium py-2 pr-4 text-gray-700 dark:text-gray-300">Brand</td>
                      <td>{productData.brand}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 pr-4 text-gray-700 dark:text-gray-300">Color</td>
                      <td>{productData.color}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 pr-4 text-gray-700 dark:text-gray-300">Category</td>
                      <td>{productData.category}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Like Section */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={toggleLike}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    liked
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                  }`}
                >
                  <Heart size={16} className={liked ? "fill-white" : ""} />
                  {liked ? "Liked" : "Like"}
                </button>

                {likeCount > 0 && (
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {likeCount} like{likeCount !== 1 && "s"}
                  </span>
                )}

                {likeUsers.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {likeUsers.length === 1
                      ? `Liked by ${likeUsers[0].username || "Anonymous"}`
                      : `Liked by ${likeUsers[0].username || "Anonymous"} and ${likeUsers.length - 1} others`}
                  </span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 mb-10">
                <button
                  onClick={handleAddToCart}
                  disabled={productData.stock === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition disabled:opacity-50"
                >
                  <ShoppingCart size={18} />
                  {productData.stock === 0 ? "Sold Out" : "Add to Cart"}
                </button>
                {productData.stock > 0 && (
                  <button
                    onClick={() => router.push("/cart")}
                    className="flex items-center gap-2 px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition"
                  >
                    Go to Cart
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

              {/* Submit Review */}
              <div>
                {currentUser ? (
                  <>
                    <h2 className="font-semibold mb-2 text-lg text-gray-900 dark:text-white">
                      Leave a Review
                    </h2>
                    <label
                      className="flex items-center gap-2 mb-2 text-sm text-gray-700 dark:text-gray-300"
                      htmlFor="rating-select"
                    >
                      Rating:
                      <select
                        id="rating-select"
                        value={rating}
                        onChange={(e) => setRating(+e.target.value)}
                        className="border rounded px-2 py-1 text-black dark:text-white bg-white dark:bg-gray-900"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border rounded-lg p-2 mb-3 text-black dark:text-white bg-white dark:bg-gray-900"
                      placeholder="Your comment..."
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <XCircle size={16} /> Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} /> Submit Review
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <p className="text-red-600 text-sm">Please sign in to leave a review.</p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List & Pagination */}
          <div className="w-full md:w-1/2 mt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-orange-600">Customer Reviews</span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                See what others are saying about this product
              </p>
            </div>

            <div className="space-y-6">
              {currentReviews.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-8 border rounded-xl bg-gray-50 dark:bg-gray-900/40">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                <>
                  {[...currentReviews]
                    .sort((a, b) => b.rating - a.rating)
                    .map((r) => {
                      const foundHelpful = r.helpful?.includes(currentUser?._id);

                      return (
                        <div
                          key={r._id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-900 transition hover:shadow-md"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{r.username}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(r.createdAt).toLocaleDateString("en-GB")}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">{renderStars(r.rating)}</div>

                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{r.comment}</p>

                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => handleHelpfulClick(r._id)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                foundHelpful
                                  ? "bg-orange-500 text-white shadow-sm"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50"
                              }`}
                            >
                              <Heart size={16} />
                              {foundHelpful ? "Helpful" : "Mark as Helpful"}
                            </button>
                            <span className="text-sm text-gray-500">
                              {r.helpful?.length === 1
                                ? "1 person found this helpful"
                                : `${r.helpful?.length || 0} people found this helpful`}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow border">
                        <button
                          onClick={() => setPage((p) => Math.max(p - 1, 1))}
                          disabled={page === 1}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                            page === 1
                              ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                              : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-50"
                          }`}
                        >
                          Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                          const pageNum = index + 1;
                          const isActive = page === pageNum;

                          const shouldShow =
                            totalPages <= 7 ||
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= page - 1 && pageNum <= page + 1);

                          if (!shouldShow && totalPages > 7) {
                            if ((pageNum === 2 && page > 4) || (pageNum === totalPages - 1 && page < totalPages - 3)) {
                              return (
                                <span key={pageNum} className="px-2 text-gray-400 dark:text-gray-500">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                isActive
                                  ? "bg-orange-600 text-white shadow"
                                  : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                          disabled={page === totalPages}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                            page === totalPages
                              ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                              : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-50"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Related Products
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <div key={p._id} className="transition-transform hover:scale-[1.02] duration-200">
                    <RelatedProducts product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
