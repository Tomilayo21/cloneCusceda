import axios from "axios";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Address from "@/models/Address"; // assuming you have this model

export async function POST(req) {
  try {
    const { orderId, parcel } = await req.json();
    await connectDB();

    // 1. Get the order and populate the address
    const order = await Order.findOne({ orderId }).populate("address");

    if (!order || !order.address) {
      return NextResponse.json({ success: false, message: "Order or address not found" });
    }

    // 2. Prepare Shippo-compatible address
    const addressTo = {
      name: order.address.fullName,
      street1: order.address.area,
      city: order.address.city,
      state: order.address.state,
      zip: order.pincode ? String(order.pincode) : "100001",
      country: "NG", // Set manually
      phone: order.address.phoneNumber,
    };

    // 3. Static sender address
    const addressFrom = {
      name: "Cusceda",
      street1: "Lagos",
      city: "Lagos",
      state: "Lagos",
      zip: "100001",
      country: "NG",
      phone: "+2348012345678",
    };

    const { data } = await axios.post(
      "https://api.goshippo.com/shipments/",
      {
        address_from: addressFrom,
        address_to: addressTo,
        parcels: [parcel],
        async: false,
      },
      {
        headers: {
          Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, shipment: data });
  } catch (error) {
    console.error("Shippo error:", error.response?.data || error.message);
    return NextResponse.json({ success: false, message: error.message });
  }
}
