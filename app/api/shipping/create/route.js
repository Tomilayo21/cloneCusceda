// import axios from "axios";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Order from "@/models/Order";

// export async function POST(req) {
//   try {
//     const { orderId, parcel } = await req.json();
//     await connectDB();

//     // 1. Find order + address
//     const order = await Order.findOne({ orderId }).populate("address");
//     if (!order || !order.address) {
//       return NextResponse.json({
//         success: false,
//         message: "Order or address not found",
//       });
//     }

//     // 2. Build Shippo-compatible address objects
//     const addressTo = {
//       name: order.address.fullName,
//       street1: order.address.area,
//       city: order.address.city,
//       state: order.address.state,
//       zip: order.address.pincode
//         ? String(order.address.pincode)
//         : "100001",
//       country: "NG",
//       phone: order.address.phoneNumber,
//     };

//     const addressFrom = {
//       name: "Cusceda",
//       street1: "Lagos",
//       city: "Lagos",
//       state: "Lagos",
//       zip: "100001",
//       country: "NG",
//       phone: "+2348012345678",
//     };

//     // 3. Create shipment on Shippo
//     const { data } = await axios.post(
//       "https://api.goshippo.com/shipments/",
//       {
//         address_from: addressFrom,
//         address_to: addressTo,
//         parcels: [parcel],
//         async: false,
//       },
//       {
//         headers: {
//           Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // 4. Return shipment + available rates
//     return NextResponse.json({
//       success: true,
//       shipmentId: data.object_id,
//       rates: data.rates, // list of carrier rates with amounts
//     });
//   } catch (error) {
//     console.error("Shippo create error:", error.response?.data || error.message);
//     return NextResponse.json({
//       success: false,
//       message: error.response?.data || error.message,
//     });
//   }
// }

























// import connectDB from "@/config/db";
// import Order from "@/models/Order";
// import Address from "@/models/Address";

// const shippo = require("shippo")(process.env.SHIPPO_API_KEY);

// export async function POST(req) {
//   await connectDB();

//   try {
//     const body = await req.json();
//     const { orderId } = body;

//     if (!orderId) {
//       return new Response(JSON.stringify({ error: "orderId is required" }), { status: 400 });
//     }

//     const order = await Order.findOne({ orderId }).populate("address");
//     if (!order) {
//       return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
//     }

//     const address = await Address.findById(order.address);
//     if (!address) {
//       return new Response(JSON.stringify({ error: "Address not found" }), { status: 404 });
//     }

//     const fromAddress = {
//       name: "Your Store",
//       street1: "123 Main St",
//       city: "New York",
//       state: "NY",
//       zip: "10001",
//       country: "US",
//       phone: "5551234567",
//       email: "support@yourstore.com",
//     };

//     const toAddress = {
//       name: address.fullName,
//       street1: address.area,
//       city: address.city,
//       state: address.state,
//       zip: address.zipcode,
//       country: address.country || "US",
//       phone: address.phoneNumber,
//       email: address.email,
//     };

//     const parcel = {
//       length: "10",
//       width: "7",
//       height: "4",
//       distance_unit: "in",
//       weight: "2",
//       mass_unit: "lb",
//     };

//     const shipment = await shippo.shipment.create({
//       address_from: fromAddress,
//       address_to: toAddress,
//       parcels: [parcel],
//       async: false,
//     });

//     return new Response(JSON.stringify({ rates: shipment.rates, shipmentId: shipment.object_id }), { status: 200 });
//   } catch (error) {
//     console.error("Error creating shipment:", error);
//     return new Response(JSON.stringify({ error: "Failed to create shipment" }), { status: 500 });
//   }
// }






















import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function POST(req) {
  await connectDB();

  try {
    const Shippo = (await import("shippo")).default;
    const shippo = Shippo(process.env.SHIPPO_API_KEY);

    const body = await req.json();
    const { orderId, shipmentData } = body;

    if (!orderId || !shipmentData) {
      return new Response(JSON.stringify({ error: "orderId and shipmentData are required" }), { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    // Create a shipment
    const shipment = await shippo.shipment.create({
      address_from: shipmentData.address_from,
      address_to: shipmentData.address_to,
      parcels: shipmentData.parcels,
      async: false,
    });

    // Save the shipment ID
    order.shipping = {
      ...order.shipping,
      shipmentId: shipment.object_id,
    };

    await order.save();

    return new Response(
      JSON.stringify({ success: true, shipment }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating shipment:", error);
    return new Response(JSON.stringify({ error: "Failed to create shipment" }), { status: 500 });
  }
}
