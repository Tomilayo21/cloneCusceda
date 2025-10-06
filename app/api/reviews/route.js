import connectDB from '@/config/db';
import Review from '@/models/Review';
import User from '@/models/User';
import { requireAdmin } from '@/lib/authAdmin';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();

    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');

    let reviews;
    if (productId) {
      // Public: only approved reviews
      reviews = await Review.find({ productId, approved: true })
        .populate('productId', 'name')
        .sort({ createdAt: -1 });
    } else {
      // Admin: all reviews
      // if (!userId || !(await authSeller(userId))) {
      //   return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
      // }
      if (!userId || !(await requireAdmin(userId))) {
        return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
      }

      reviews = await Review.find()
        .populate('productId', 'name')
        .sort({ createdAt: -1 });
    }

    // Fetch user images dynamically
    const reviewsWithImages = await Promise.all(
      reviews.map(async (review) => {
        let imageUrl = null;

        try {
          // Try Clerk first
          const clerkUser = await clerkClient.users.getUser(review.userId);
          imageUrl = clerkUser?.imageUrl || null;
        } catch {
          // If Clerk fails, fallback to your User model
          const dbUser = await User.findById(review.userId);
          imageUrl = dbUser?.imageUrl || null;
        }

        return {
          ...review.toObject(),
          imageUrl,
        };
      })
    );

    return NextResponse.json(
      productId ? reviewsWithImages : { success: true, reviews: reviewsWithImages },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    const { productId, rating, comment, username } = await request.json();
    if (!productId || !rating || !comment) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return NextResponse.json({ message: 'You already submitted a review' }, { status: 400 });
    }

    const review = new Review({ productId, userId, username, rating, comment, approved: false });
    await review.save();

    return NextResponse.json({ message: 'Review submitted for approval' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId || !(await authSeller(userId))) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const { reviewId, approved } = await request.json();
    if (!reviewId || typeof approved !== 'boolean') {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(reviewId, { approved }, { new: true });
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId || !(await authSeller(userId))) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const { reviewId } = await request.json();
    if (!reviewId) {
      return NextResponse.json({ message: 'Review ID missing' }, { status: 400 });
    }

    await Review.findByIdAndDelete(reviewId);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
