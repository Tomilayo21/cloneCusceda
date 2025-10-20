// // app/api/admin/notifications/route.js
// import connectDB from "@/config/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import Notification from "@/models/Notification";
// import Order from "@/models/Order";
// import Product from "@/models/Product";
// import { Transaction } from "@/models/Transaction";
// import Contact from "@/models/Contact";
// import User from "@/models/User";
// import Review from "@/models/Review";
// // import Coupon from "@/models/Coupon";

// export async function GET() {
//   await connectDB();
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//   }

//   try {
//     const notifications = [];

//     // -------------------- 1. Orders --------------------
//     const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).lean();
//     recentOrders.forEach((order) => {
//       if (order.orderStatus === "Order Placed") {
//         notifications.push({
//           _id: order._id.toString(),
//           type: "order",
//           message: `New order ${order.orderId} received.`,
//           relatedId: order._id,
//           isRead: false,
//           createdAt: order.createdAt,
//         });
//       }
//       if (["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus)) {
//         notifications.push({
//           _id: `${order._id}-status`,
//           type: "order",
//           message: `Order ${order.orderId} has been ${order.orderStatus}.`,
//           relatedId: order._id,
//           isRead: false,
//           createdAt: order.updatedAt,
//         });
//       }
//       if (["Failed", "Refunded"].includes(order.paymentStatus)) {
//         notifications.push({
//           _id: `${order._id}-payment`,
//           type: "payment",
//           message: `Payment for order ${order.orderId} ${order.paymentStatus.toLowerCase()}.`,
//           relatedId: order._id,
//           isRead: false,
//           createdAt: order.updatedAt,
//         });
//       }
//     });

//     // -------------------- 2. Stock & Inventory --------------------
//     const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).lean();
//     lowStockProducts.forEach((p) => {
//       notifications.push({
//         _id: `${p._id}-stock`,
//         type: "stock",
//         message: `Only ${p.stock} units left of ${p.name}.`,
//         relatedId: p._id,
//         isRead: false,
//         createdAt: p.date,
//       });
//     });
//     const outOfStock = await Product.find({ stock: { $lte: 0 } }).lean();
//     outOfStock.forEach((p) => {
//       notifications.push({
//         _id: `${p._id}-out`,
//         type: "stock",
//         message: `${p.name} is out of stock.`,
//         relatedId: p._id,
//         isRead: false,
//         createdAt: p.date,
//       });
//     });

//     // -------------------- 3. Customer & User --------------------
//     const newUsers = await User.find().sort({ createdAt: -1 }).limit(5).lean();
//     newUsers.forEach((u) => {
//       notifications.push({
//         _id: `${u._id}-user`,
//         type: "user",
//         message: `${u.name} just signed up.`,
//         relatedId: u._id,
//         isRead: false,
//         createdAt: u.createdAt,
//       });
//     });
//     const newReviews = await Review.find({ approved: false }).lean();
//     newReviews.forEach((r) => {
//       notifications.push({
//         _id: `${r._id}-review`,
//         type: "review",
//         message: `New review submitted for ${r.productName}.`,
//         relatedId: r._id,
//         isRead: false,
//         createdAt: r.createdAt,
//       });
//     });
//     const newContacts = await Contact.find({ read: false, archived: false }).lean();
//     newContacts.forEach((c) => {
//       notifications.push({
//         _id: `${c._id}-contact`,
//         type: "user",
//         message: `New support message from ${c.name}.`,
//         relatedId: c._id,
//         isRead: false,
//         createdAt: c.createdAt,
//       });
//     });

//     // -------------------- 4. Promotions & Marketing --------------------
//     // const expiringCoupons = await Coupon.find({
//     //   expiresAt: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
//     // }).lean();
//     // expiringCoupons.forEach((c) => {
//     //   notifications.push({
//     //     _id: `${c._id}-coupon`,
//     //     type: "promo",
//     //     message: `Coupon ${c.code} is about to expire.`,
//     //     relatedId: c._id,
//     //     isRead: false,
//     //     createdAt: c.createdAt,
//     //   });
//     // });

//     // -------------------- 6. Sales & Performance --------------------
//     const topProducts = await Product.find().sort({ stock: -1 }).limit(3).lean();
//     topProducts.forEach((p) => {
//       notifications.push({
//         _id: `${p._id}-top`,
//         type: "order",
//         message: `${p.name} is trending!`,
//         relatedId: p._id,
//         isRead: false,
//         createdAt: p.date,
//       });
//     });

//     // Sort by newest first
//     notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     return new Response(JSON.stringify({ success: true, data: notifications }), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
//   }
// }


// export async function PATCH(req) {
//   await connectDB();
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//   }

//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return new Response(JSON.stringify({ success: false, error: "ID is required" }), { status: 400 });
//     }

//     const updated = await Notification.findByIdAndUpdate(
//       id,
//       { isRead: true },
//       { new: true }
//     );

//     if (!updated) {
//       return new Response(JSON.stringify({ success: false, error: "Notification not found" }), { status: 404 });
//     }

//     return new Response(JSON.stringify({ success: true, data: updated }), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ success: false, error: "Failed to mark as read" }), { status: 500 });
//   }
// }

























import connectDB from "@/config/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Notification from "@/models/Notification";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Review from "@/models/Review";
import Contact from "@/models/Contact";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const notifications = [];

    // -------------------- 1. Dynamic Notifications --------------------
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).lean();
    recentOrders.forEach((order) => {
      if (order.orderStatus === "Order Placed") {
        notifications.push({
          _id: `order-${order._id}`,
          type: "order",
          message: `New order ${order.orderId} received.`,
          relatedId: order._id,
          isRead: false,
          dynamic: true,
          createdAt: order.createdAt,
        });
      }
      if (["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus)) {
        notifications.push({
          _id: `order-${order._id}-status`,
          type: "order",
          message: `Order ${order.orderId} has been ${order.orderStatus}.`,
          relatedId: order._id,
          isRead: false,
          dynamic: true,
          createdAt: order.updatedAt,
        });
      }
    });

    const lowStock = await Product.find({ stock: { $lte: 5 } }).lean();
    lowStock.forEach(p => {
      notifications.push({
        _id: `stock-${p._id}`,
        type: "stock",
        message: `Only ${p.stock} units left of ${p.name}.`,
        relatedId: p._id,
        isRead: false,
        dynamic: true,
        createdAt: p.date,
      });
    });

    const newUsers = await User.find().sort({ createdAt: -1 }).limit(5).lean();
    newUsers.forEach(u => {
      notifications.push({
        _id: `user-${u._id}`,
        type: "user",
        message: `${u.name} just signed up.`,
        relatedId: u._id,
        isRead: false,
        dynamic: true,
        createdAt: u.createdAt,
      });
    });

    const newReviews = await Review.find({ approved: false }).lean();
    newReviews.forEach(r => {
      notifications.push({
        _id: `review-${r._id}`,
        type: "review",
        message: `New review submitted for ${r.productName}.`,
        relatedId: r._id,
        isRead: false,
        dynamic: true,
        createdAt: r.createdAt,
      });
    });

    const newContacts = await Contact.find({ read: false, archived: false }).lean();
    newContacts.forEach(c => {
      notifications.push({
        _id: `contact-${c._id}`,
        type: "user",
        message: `New support message from ${c.name}.`,
        relatedId: c._id,
        isRead: false,
        dynamic: true,
        createdAt: c.createdAt,
      });
    });

    // -------------------- 2. Real MongoDB Notifications --------------------
    const storedNotifs = await Notification.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
    storedNotifs.forEach(n => notifications.push({ ...n, dynamic: false }));

    // Sort by newest first
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify({ success: true, data: notifications }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}

// -------------------- PATCH: Mark as Read --------------------
export async function PATCH(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return new Response(JSON.stringify({ success: false, error: "ID required" }), { status: 400 });

    // Only allow marking real Mongo notifications
    if (!id.startsWith("mongo-")) {
      return new Response(JSON.stringify({ success: true, message: "Dynamic notifications are read-only" }), { status: 200 });
    }

    const notifId = id.replace("mongo-", "");
    const updated = await Notification.findByIdAndUpdate(notifId, { isRead: true }, { new: true });

    if (!updated) return new Response(JSON.stringify({ success: false, error: "Notification not found" }), { status: 404 });

    return new Response(JSON.stringify({ success: true, data: updated }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Failed to mark as read" }), { status: 500 });
  }
}
