// import connectDB from "@/config/db";
// import Order from "@/models/Order";

// const shippo = require("shippo")(process.env.SHIPPO_API_KEY);

// export async function POST(req) {
//   await connectDB();

//   try {
//     const body = await req.json();
//     const { orderId, rateId } = body;

//     if (!orderId || !rateId) {
//       return new Response(JSON.stringify({ error: "orderId and rateId are required" }), { status: 400 });
//     }

//     const order = await Order.findOne({ orderId });
//     if (!order) {
//       return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
//     }

//     // Purchase the shipment using the selected rate
//     const transaction = await shippo.transaction.create({
//       rate: rateId,
//       label_file_type: "PDF",
//       async: false,
//     });

//     if (transaction.status !== "SUCCESS") {
//       return new Response(
//         JSON.stringify({ error: "Failed to purchase shipment", messages: transaction.messages }),
//         { status: 400 }
//       );
//     }

//     // Save label + tracking details to the order
//     order.shipping = {
//       rateId,
//       shipmentId: transaction.shipment,
//       trackingNumber: transaction.tracking_number,
//       trackingUrl: transaction.tracking_url_provider,
//       labelUrl: transaction.label_url,
//     };

//     await order.save();

//     return new Response(
//       JSON.stringify({
//         success: true,
//         trackingNumber: transaction.tracking_number,
//         trackingUrl: transaction.tracking_url_provider,
//         labelUrl: transaction.label_url,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error booking shipment:", error);
//     return new Response(JSON.stringify({ error: "Failed to book shipment" }), { status: 500 });
//   }
// }






















// import connectDB from "@/config/db";
// import Order from "@/models/Order";
// import Shippo from "shippo";

// const shippo = Shippo(process.env.SHIPPO_API_KEY);

// export async function POST(req) {
//   await connectDB();

//   try {
//     const body = await req.json();
//     const { orderId, rateId } = body;

//     if (!orderId || !rateId) {
//       return new Response(JSON.stringify({ error: "orderId and rateId are required" }), { status: 400 });
//     }

//     const order = await Order.findOne({ orderId });
//     if (!order) {
//       return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
//     }

//     const transaction = await shippo.transaction.create({
//       rate: rateId,
//       label_file_type: "PDF",
//       async: false,
//     });

//     if (transaction.status !== "SUCCESS") {
//       return new Response(
//         JSON.stringify({ error: "Failed to purchase shipment", messages: transaction.messages }),
//         { status: 400 }
//       );
//     }

//     order.shipping = {
//       rateId,
//       shipmentId: transaction.shipment,
//       trackingNumber: transaction.tracking_number,
//       trackingUrl: transaction.tracking_url_provider,
//       labelUrl: transaction.label_url,
//     };

//     await order.save();

//     return new Response(
//       JSON.stringify({
//         success: true,
//         trackingNumber: transaction.tracking_number,
//         trackingUrl: transaction.tracking_url_provider,
//         labelUrl: transaction.label_url,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error booking shipment:", error);
//     return new Response(JSON.stringify({ error: "Failed to book shipment" }), { status: 500 });
//   }
// }



























import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function POST(req) {
  await connectDB();

  try {
    // ⛔ dynamically import shippo inside the handler to prevent build errors
    const Shippo = (await import("shippo")).default;
    const shippo = Shippo(process.env.SHIPPO_API_KEY);

    const body = await req.json();
    const { orderId, rateId } = body;

    if (!orderId || !rateId) {
      return new Response(JSON.stringify({ error: "orderId and rateId are required" }), { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    const transaction = await shippo.transaction.create({
      rate: rateId,
      label_file_type: "PDF",
      async: false,
    });

    if (transaction.status !== "SUCCESS") {
      return new Response(
        JSON.stringify({ error: "Failed to purchase shipment", messages: transaction.messages }),
        { status: 400 }
      );
    }

    order.shipping = {
      rateId,
      shipmentId: transaction.shipment,
      trackingNumber: transaction.tracking_number,
      trackingUrl: transaction.tracking_url_provider,
      labelUrl: transaction.label_url,
    };

    await order.save();

    return new Response(
      JSON.stringify({
        success: true,
        trackingNumber: transaction.tracking_number,
        trackingUrl: transaction.tracking_url_provider,
        labelUrl: transaction.label_url,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error booking shipment:", error);
    return new Response(JSON.stringify({ error: "Failed to book shipment" }), { status: 500 });
  }
}
