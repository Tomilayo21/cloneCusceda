// // app/api/reviews/route.js
// import connectDB from "@/config/db";
// import Review from "@/models/Review";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import { requireAdmin } from "@/lib/authAdmin";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/authOptions";
// import * as mongoose from "mongoose";


// /**
//  * GET: Fetch reviews
//  * - If productId query param exists → public, only approved reviews
//  * - If no productId → admin only, all reviews
//  */

// export async function GET(request) {
//   try {
//     await connectDB();

//     const url = new URL(request.url);
//     const productId = url.searchParams.get("productId");

//     let reviews;

//     if (productId) {
//       // validate ObjectId before querying
//       if (!mongoose.Types.ObjectId.isValid(productId)) {
//         return NextResponse.json([], { status: 200 });
//       }

//       reviews = await Review.find({ productId, approved: true })
//         .populate("productId", "name")
//         .sort({ createdAt: -1 });
//     } else {
//       // admin access
//       const admin = await requireAdmin(request);
//       if (admin instanceof NextResponse) return admin;

//       reviews = await Review.find()
//         .populate("productId", "name")
//         .sort({ createdAt: -1 });
//     }

//     // enrich with user image
//     const reviewsWithImages = await Promise.all(
//       reviews.map(async (review) => {
//         const dbUser = await User.findById(review.userId);
//         return {
//           ...review.toObject(),
//           imageUrl: dbUser?.imageUrl || null,
//         };
//       })
//     );

//     return NextResponse.json(reviewsWithImages, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

// /**
//  * POST: Submit a new review (user)
//  */
// export async function POST(request) {
//   try {
//     await connectDB();

//     // Parse body
//     const body = await request.json();
//     const { productId, rating, comment } = body;

//     // Validate body
//     if (!productId || rating == null || !comment?.trim()) {
//       return NextResponse.json(
//         { message: "Missing or invalid fields" },
//         { status: 400 }
//       );
//     }

//     // Get session from NextAuth
//     const session = await getServerSession({ req: request, ...authOptions });
//     const userId = session?.user?.id;
//     const username = session?.user?.name || "Anonymous";

//     if (!userId) {
//       return NextResponse.json(
//         { message: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     // Check if user already submitted review
//     const existing = await Review.findOne({ productId, userId });
//     if (existing) {
//       return NextResponse.json(
//         { message: "You have already submitted a review" },
//         { status: 400 }
//       );
//     }

//     // Save new review
//     const review = new Review({
//       productId,
//       userId,
//       username,
//       rating: Number(rating),
//       comment: comment.trim(),
//       approved: false, // admin approval required
//     });

//     await review.save();

//     return NextResponse.json(
//       { message: "Review submitted for approval" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/reviews error:", error);
//     return NextResponse.json(
//       { message: "Server error: " + error.message },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * PATCH: Approve a review (admin only)
//  */
// export async function PATCH(request) {
//   try {
//     await connectDB();

//     const admin = await requireAdmin(request);
//     if (admin instanceof NextResponse) return admin; // stop if unauthorized

//     const { reviewId, approved } = await request.json();
//     if (!reviewId || typeof approved !== "boolean") {
//       return NextResponse.json({ message: "Invalid data" }, { status: 400 });
//     }

//     const review = await Review.findByIdAndUpdate(reviewId, { approved }, { new: true });
//     return NextResponse.json(review, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

// /**
//  * DELETE: Delete a review (admin only)
//  */
// export async function DELETE(request) {
//   try {
//     await connectDB();

//     const admin = await requireAdmin(request);
//     if (admin instanceof NextResponse) return admin; // stop if unauthorized

//     const { reviewId } = await request.json();
//     if (!reviewId) {
//       return NextResponse.json({ message: "Review ID missing" }, { status: 400 });
//     }

//     await Review.findByIdAndDelete(reviewId);
//     return NextResponse.json({ message: "Deleted" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }









// // app/api/reviews/route.js
// import connectDB from "@/config/db";
// import Review from "@/models/Review";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import { requireAdmin } from "@/lib/authAdmin";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/authOptions";
// import * as mongoose from "mongoose";
// import { sendEmail } from "@/lib/email";

// /**
//  * GET: Fetch reviews
//  */
// export async function GET(request) {
//   try {
//     await connectDB();

//     const url = new URL(request.url);
//     const productId = url.searchParams.get("productId");

//     let reviews;

//     if (productId) {
//       if (!mongoose.Types.ObjectId.isValid(productId)) {
//         return NextResponse.json([], { status: 200 });
//       }

//       reviews = await Review.find({ productId, approved: true })
//         .populate("productId", "name")
//         .sort({ createdAt: -1 });
//     } else {
//       const admin = await requireAdmin(request);
//       if (admin instanceof NextResponse) return admin;

//       reviews = await Review.find()
//         .populate("productId", "name")
//         .sort({ createdAt: -1 });
//     }

//     const reviewsWithImages = await Promise.all(
//       reviews.map(async (review) => {
//         const dbUser = await User.findById(review.userId);
//         return {
//           ...review.toObject(),
//           imageUrl: dbUser?.imageUrl || null,
//         };
//       })
//     );

//     return NextResponse.json(reviewsWithImages, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

// /**
//  * POST: Submit a new review (user)
//  * → Notifies admins
//  */
// export async function POST(request) {
//   try {
//     await connectDB();

//     const body = await request.json();
//     const { productId, rating, comment } = body;

//     if (!productId || rating == null || !comment?.trim()) {
//       return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
//     }

//     const session = await getServerSession({ req: request, ...authOptions });
//     const userId = session?.user?.id;
//     const username = session?.user?.name || "Anonymous";

//     if (!userId) {
//       return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
//     }

//     const existing = await Review.findOne({ productId, userId });
//     if (existing) {
//       return NextResponse.json({ message: "You have already submitted a review" }, { status: 400 });
//     }

//     const review = new Review({
//       productId,
//       userId,
//       username,
//       rating: Number(rating),
//       comment: comment.trim(),
//       approved: false,
//     });

//     await review.save();

//     // ✅ Notify admins about the new pending review
//     try {
//       const subject = `📝 New Review Pending Approval`;
//       const html = `
//         <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;">
//           <div style="background:#fff;padding:20px;border-radius:8px;">
//             <h2 style="color:#ff6600;margin-bottom:10px;">New Review Submitted</h2>
//             <p><b>User:</b> ${username}</p>
//             <p><b>Rating:</b> ${rating} ⭐</p>
//             <p><b>Comment:</b> ${comment}</p>
//             <p><b>Product ID:</b> ${productId}</p>
//             <p style="color:#666;margin-top:16px;">Login to your admin dashboard to approve or reject this review.</p>
//           </div>
//         </div>
//       `;

//       // Send to all admin emails (you can store multiple comma-separated addresses)
//       const adminEmails = process.env.ADMIN_EMAIL?.split(",") || [];
//       for (const email of adminEmails) {
//         await sendEmail({ to: email.trim(), subject, html });
//       }

//       console.log("✅ Admin notified of new review");
//     } catch (err) {
//       console.error("⚠️ Failed to send admin review notification:", err);
//     }

//     return NextResponse.json({ message: "Review submitted for approval" }, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/reviews error:", error);
//     return NextResponse.json({ message: "Server error: " + error.message }, { status: 500 });
//   }
// }

// /**
//  * PATCH: Approve or reject a review (admin only)
//  * → Notifies user when approved
//  */
// export async function PATCH(request) {
//   try {
//     await connectDB();

//     const admin = await requireAdmin(request);
//     if (admin instanceof NextResponse) return admin;

//     const { reviewId, approved } = await request.json();
//     if (!reviewId || typeof approved !== "boolean") {
//       return NextResponse.json({ message: "Invalid data" }, { status: 400 });
//     }

//     const review = await Review.findByIdAndUpdate(reviewId, { approved }, { new: true });
//     if (!review) {
//       return NextResponse.json({ message: "Review not found" }, { status: 404 });
//     }

//     // ✅ Notify user when their review is approved
//     if (approved) {
//       try {
//         const user = await User.findById(review.userId);
//         if (user?.email) {
//           const subject = "✅ Your Review Has Been Approved!";
//           const html = `
//             <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;">
//               <div style="background:#fff;padding:20px;border-radius:8px;">
//                 <h2 style="color:#28a745;margin-bottom:10px;">Your Review is Now Live!</h2>
//                 <p>Hi ${user.name || "Customer"},</p>
//                 <p>Your review for product <b>${review.productId}</b> has been approved and is now visible on our website.</p>
//                 <p><b>Your Review:</b></p>
//                 <blockquote style="border-left:3px solid #ccc;padding-left:10px;color:#555;">
//                   ${review.comment}
//                 </blockquote>
//                 <p>⭐ Rating: ${review.rating}</p>
//                 <p style="color:#666;margin-top:16px;">Thank you for sharing your feedback!</p>
//               </div>
//             </div>
//           `;
//           await sendEmail({ to: user.email, subject, html });
//           console.log(`✅ Sent approval email to ${user.email}`);
//         }
//       } catch (err) {
//         console.error("⚠️ Failed to send user approval email:", err);
//       }
//     }

//     return NextResponse.json(review, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

// /**
//  * DELETE: Delete a review (admin only)
//  */
// export async function DELETE(request) {
//   try {
//     await connectDB();

//     const admin = await requireAdmin(request);
//     if (admin instanceof NextResponse) return admin;

//     const { reviewId } = await request.json();
//     if (!reviewId) {
//       return NextResponse.json({ message: "Review ID missing" }, { status: 400 });
//     }

//     await Review.findByIdAndDelete(reviewId);
//     return NextResponse.json({ message: "Deleted" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }


















































// app/api/reviews/route.js
import connectDB from "@/config/db";
import Review from "@/models/Review";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import * as mongoose from "mongoose";
import { sendEmail } from "@/lib/email";

/**
 * GET: Fetch reviews
 */
export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");

    let reviews;

    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json([], { status: 200 });
      }

      reviews = await Review.find({ productId, approved: true })
        .populate("productId", "name")
        .sort({ createdAt: -1 });
    } else {
      const admin = await requireAdmin(request);
      if (admin instanceof NextResponse) return admin;

      reviews = await Review.find()
        .populate("productId", "name")
        .sort({ createdAt: -1 });
    }

    const reviewsWithImages = await Promise.all(
      reviews.map(async (review) => {
        const dbUser = await User.findById(review.userId);
        return {
          ...review.toObject(),
          imageUrl: dbUser?.imageUrl || null,
        };
      })
    );

    return NextResponse.json(reviewsWithImages, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * POST: Submit a new review (user)
 * → Notifies admins
 */
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || rating == null || !comment?.trim()) {
      return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
    }

    const session = await getServerSession({ req: request, ...authOptions });
    const userId = session?.user?.id;
    const username = session?.user?.name || "Anonymous";

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return NextResponse.json({ message: "You have already submitted a review" }, { status: 400 });
    }

    const review = new Review({
      productId,
      userId,
      username,
      rating: Number(rating),
      comment: comment.trim(),
      approved: false,
    });

    await review.save();

    // ✅ Fetch product name for email context
    const product = await Product.findById(productId);
    const productName = product?.name || "Unknown Product";

    // ✅ Notify admins about the new pending review
    try {
      const subject = `New Review Pending Approval – ${productName}`;
      const html = `
        <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;">
          <div style="background:#ffffff;padding:20px;border-radius:8px;max-width:600px;margin:auto;">
            <h2 style="color:#ff6600;margin-bottom:10px;">New Review Submitted</h2>
            <p><b>User:</b> ${username}</p>
            <p><b>Product:</b> ${productName}</p>
            <p><b>Rating:</b> ${rating} ⭐</p>
            <p><b>Comment:</b> ${comment}</p>
            <p style="color:#666;margin-top:16px;">
              Please log in to your admin dashboard to review and approve this submission.
            </p>
          </div>
        </div>
      `;

      const adminEmails = process.env.ADMIN_EMAIL?.split(",") || [];
      for (const email of adminEmails) {
        await sendEmail({ to: email.trim(), subject, html });
      }

      console.log("✅ Admin notified of new review");
    } catch (err) {
      console.error("⚠️ Failed to send admin review notification:", err);
    }

    return NextResponse.json({ message: "Review submitted for approval" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ message: "Server error: " + error.message }, { status: 500 });
  }
}

/**
 * PATCH: Approve or reject a review (admin only)
 * → Notifies user when approved
 */
export async function PATCH(request) {
  try {
    await connectDB();

    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) return admin;

    const { reviewId, approved } = await request.json();
    if (!reviewId || typeof approved !== "boolean") {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(reviewId, { approved }, { new: true }).populate("productId", "name");
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    // ✅ Notify user when their review is approved
    if (approved) {
      try {
        const user = await User.findById(review.userId);
        if (user?.email) {
          const subject = "Your Review Has Been Approved!";
          const html = `
            <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:20px;">
              <div style="background:#fff;padding:20px;border-radius:8px;max-width:600px;margin:auto;">
                <h2 style="color:#28a745;margin-bottom:10px;">Your Review is Now Live!</h2>
                <p>Hi ${user.name || "Customer"},</p>
                <p>Great news! Your review for <b>${review.productId?.name || "our product"}</b> has been approved and is now visible on our website.</p>
                <p><b>Your Review:</b></p>
                <blockquote style="border-left:3px solid #ccc;padding-left:10px;color:#555;">
                  ${review.comment}
                </blockquote>
                <p> Rating: ${review.rating} ⭐</p>
                <p style="margin-top:20px;color:#333;">
                  Thank you for sharing your experience with us — we truly value your feedback.
                </p>
                <p>
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}" 
                     style="background:#ff6600;color:white;text-decoration:none;padding:10px 20px;border-radius:5px;">
                    Shop With Us Again
                  </a>
                </p>
              </div>
            </div>
          `;
          await sendEmail({ to: user.email, subject, html });
          console.log(`✅ Sent approval email to ${user.email}`);
        }
      } catch (err) {
        console.error("⚠️ Failed to send user approval email:", err);
      }
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Delete a review (admin only)
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) return admin;

    const { reviewId } = await request.json();
    if (!reviewId) {
      return NextResponse.json({ message: "Review ID missing" }, { status: 400 });
    }

    await Review.findByIdAndDelete(reviewId);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
