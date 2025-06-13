// app/api/reviews/helpful/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server'; // ✅ use getAuth here
import connectDB from '@/config/db';
import Review from '@/models/Review';

export async function PATCH(req) {
  try {
    await connectDB();

    const { reviewId } = await req.json();

    // ✅ Use getAuth to extract userId in app router
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    const hasLiked = review.helpful.includes(userId);

    if (hasLiked) {
      review.helpful = review.helpful.filter(id => id !== userId);
    } else {
      review.helpful.push(userId);
    }

    await review.save();

    return NextResponse.json({ helpful: review.helpful }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
