// import { inngest } from "@/config/inngest";
// import Product from "@/models/Product";
// import User from "@/models/User";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";



// export async function POST(request) {
//     try {
        
//         const { userId } = getAuth(request)
//         const { address, items } = await request.json();

//         if (!address || items.length === 0) {
//             return NextResponse.json({ success : false, message : 'Invalid data' })
//         } 

//         //Calculate Amount Using Items
//         const amount = await items.reduce(async (acc, item) => {
//             const product = await Product.findById(item.product);
//             return await acc + product.price * item.quantity;
//         },0)
        
//         await inngest.send(
//             {
//                 name : 'order/created',
//                 data : {
//                     userId,
//                     address,
//                     items, 
//                     amount : amount + Math.floor( amount * 0.02 ),
//                     date : Date.now()
//                 }
//             }
//         )

//         // clear user cart
//         const user = await User.findById(userId)
//         user.cartItems = {}
//         await user.save()

//         return NextResponse.json({ success : true, message : 'Order Placed' })
//     } catch (error) {
//         console.log(error)
//         return NextResponse.json({ success : false, message : error.message }) 
//     }
// }






//.....................................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
    }

    // Validate stock and calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      totalAmount += product.price * item.quantity;
    }

    // Deduct stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // Send event with 2% fee
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: totalAmount + Math.floor(totalAmount * 0.02),
        date: Date.now(),
      },
    });

    // Clear user's cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("[ORDER_POST_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}



























































// import { inngest } from "@/config/inngest";
// import Product from "@/models/Product";
// import User from "@/models/User";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";

// export async function POST(request) {
//   try {
//     await connectDB();

//     const { userId } = getAuth(request);
//     const { address, items } = await request.json();

//     if (!address || !items || items.length === 0) {
//       return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
//     }

//     let totalAmount = 0;

//     // Validate stock and calculate total
//     for (const item of items) {
//       const product = await Product.findById(item.product);

//       if (!product) {
//         return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
//       }

//       if (product.stock < item.quantity) {
//         return NextResponse.json(
//           { success: false, message: `Insufficient stock for ${product.name}` },
//           { status: 400 }
//         );
//       }

//       totalAmount += product.price * item.quantity;

//       // Deduct stock
//       product.stock -= item.quantity;
//       await product.save();
//     }

//     const finalAmount = totalAmount + Math.floor(totalAmount * 0.02); // Optional: 2% fee

//     await inngest.send({
//       name: "order/created",
//       data: {
//         userId,
//         address,
//         items,
//         amount: finalAmount,
//         date: Date.now(),
//       },
//     });

//     // Clear user cart
//     const user = await User.findById(userId);
//     if (user) {
//       user.cartItems = {};
//       await user.save();
//     }

//     return NextResponse.json({ success: true, message: "Order Placed" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }
































































// import { inngest } from "@/config/inngest";
// import Product from "@/models/Product";
// import User from "@/models/User";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";

// export async function POST(request) {
//   try {
//     await connectDB();

//     const { userId } = getAuth(request);
//     if (!userId) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const { address, items } = await request.json();

//     if (!address || !items || items.length === 0) {
//       return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
//     }

//     let totalAmount = 0;

//     // Step 1: Validate products exist, have stock, and calculate total
//     for (const item of items) {
//       const product = await Product.findById(item.product);

//       if (!product) {
//         return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
//       }

//       if (product.stock < item.quantity) {
//         return NextResponse.json(
//           { success: false, message: `Insufficient stock for ${product.name}` },
//           { status: 400 }
//         );
//       }

//       totalAmount += product.price * item.quantity;
//     }

//     // Step 2: Deduct stock
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       product.stock -= item.quantity;
//       await product.save();
//     }

//     // Step 3: Add fee if needed
//     const finalAmount = totalAmount + Math.floor(totalAmount * 0.02); // Optional 2% fee

//     // Step 4: Trigger order event
//     await inngest.send({
//       name: "order/created",
//       data: {
//         userId,
//         address,
//         items,
//         amount: finalAmount,
//         date: Date.now(),
//       },
//     });

//     // Step 5: Clear user's cart
//     const user = await User.findById(userId);
//     if (user) {
//       user.cartItems = {};
//       await user.save();
//     }

//     return NextResponse.json({ success: true, message: "Order placed successfully" });
//   } catch (error) {
//     console.error("[ORDER_POST_ERROR]", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }




























