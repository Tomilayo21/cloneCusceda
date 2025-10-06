// import axios from "axios";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Order from "@/models/Order";

// export async function POST(req) {
//   try {
//     const { orderId, shipmentId, rateId } = await req.json();
//     if (!orderId || !shipmentId || !rateId) {
//       return NextResponse.json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     await connectDB();

//     // 1. Create transaction (book label)
//     const { data } = await axios.post(
//       "https://api.goshippo.com/transactions/",
//       {
//         shipment: shipmentId,
//         rate: rateId,
//         label_file_type: "PDF",
//         async: false,
//       },
//       {
//         headers: {
//           Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const transaction = data;

//     // 2. Extract tracking + label
//     const trackingNumber = transaction.tracking_number;
//     const carrier = transaction.tracking_carrier;
//     const labelUrl = transaction.label_url;
//     const status = transaction.tracking_status?.status || "Pending";

//     // 3. Save to DB
//     const order = await Order.findOneAndUpdate(
//       { orderId },
//       {
//         trackingNumber,
//         shippingCarrier: carrier,
//         shippingLabelUrl: labelUrl,
//         deliveryStatus: status,
//       },
//       { new: true }
//     );

//     return NextResponse.json({
//       success: true,
//       transaction,
//       order,
//     });
//   } catch (error) {
//     console.error("Shippo book error:", error.response?.data || error.message);
//     return NextResponse.json({
//       success: false,
//       message: error.response?.data || error.message,
//     });
//   }
// }











import connectDB from "@/config/db";
import Order from "@/models/Order";

const shippo = require("shippo")(process.env.SHIPPO_API_KEY);

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { orderId, rateId } = body;

    if (!orderId || !rateId) {
      return new Response(JSON.stringify({ error: "orderId and rateId are required" }), { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    // Purchase the shipment using the selected rate
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

    // Save label + tracking details to the order
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
