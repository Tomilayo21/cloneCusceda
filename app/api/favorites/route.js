// import { NextResponse } from 'next/server';
// import connectDB from '@/config/db';
// import Favorite from '@/models/Favorite';
// import Product from '@/models/Product';
// import { getAuth } from '@clerk/nextjs/server';


// export async function GET(req) {
//   await connectDB();
//   const { userId } = getAuth(req);

//   if (!userId) {
//     return NextResponse.json([]);
//   }

//   try {
//     const favorites = await Favorite.find({ userId }).populate('productId');
//     return NextResponse.json(favorites);
//   } catch (error) {
//     console.error('Error fetching favorites:', error);
//     return NextResponse.json([], { status: 500 });
//   }
// }

// export async function POST(req) {
//   await connectDB();
//   const { userId } = getAuth(req);

//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const { productId } = await req.json();

//     if (!productId) {
//       return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
//     }

//     const existing = await Favorite.findOne({ userId, productId });

//     if (existing) {
//       await Favorite.deleteOne({ _id: existing._id });
//       return NextResponse.json({ removed: true }, { status: 200 });
//     }

//     const newFav = await Favorite.create({ userId, productId });
//     return NextResponse.json({ favorite: newFav }, { status: 201 });
//   } catch (error) {
//     console.error('Favorite POST error:', error);
//     return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
//   }
// }
























// app/api/favorites/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Favorite from '@/models/Favorite';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const favorites = await Favorite.find({ userId }).populate('productId');
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();

  try {
    const { productId, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const existing = await Favorite.findOne({ userId, productId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return NextResponse.json({ removed: true }, { status: 200 });
    }

    const newFav = await Favorite.create({ userId, productId });
    return NextResponse.json({ favorite: newFav }, { status: 201 });
  } catch (error) {
    console.error('Favorite POST error:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}



















// // app/api/favorites/route.js
// import { NextResponse } from 'next/server';
// import connectDB from '@/config/db';
// import Favorite from '@/models/Favorite';
// import { getUserFromRequest } from '@/utils/auth';

// export async function GET(req) {
//   await connectDB();

//   try {
//     const user = await getUserFromRequest(req);

//     if (!user?._id) {
//       return NextResponse.json([], { status: 200 });
//     }

//     // ✅ Use lean() so productId is plain JSON
//     const favorites = await Favorite.find({ userId: user._id })
//       .populate('productId')
//       .lean();

//     return NextResponse.json(favorites, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching favorites:', error);
//     return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await connectDB();

//   try {
//     const user = await getUserFromRequest(req);

//     if (!user?._id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { productId } = await req.json();

//     if (!productId) {
//       return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
//     }

//     const existing = await Favorite.findOne({ userId: user._id, productId });

//     if (existing) {
//       await Favorite.deleteOne({ _id: existing._id });
//       return NextResponse.json({ removed: true }, { status: 200 });
//     }

//     const newFav = await Favorite.create({ userId: user._id, productId });
//     return NextResponse.json({ favorite: newFav }, { status: 201 });
//   } catch (error) {
//     console.error('Favorite POST error:', error);
//     return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
//   }
// }
