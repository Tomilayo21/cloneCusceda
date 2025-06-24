import axios from "axios";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const { orderId, shipmentId, rateObjectId } = await req.json();

    if (!orderId || !shipmentId || !rateObjectId) {
      return NextResponse.json({ success: false, message: "Missing data" });
    }

    await connectDB();

    const { data } = await axios.post(
      "https://api.goshippo.com/transactions/",
      {
        shipment: shipmentId,
        rate: rateObjectId,
        label_file_type: "PDF",
        async: false,
      },
      {
        headers: {
          Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const transaction = data;

    // Extract tracking info
    const trackingNumber = transaction.tracking_number;
    const carrier = transaction.tracking_carrier;
    const labelUrl = transaction.label_url;
    const status = transaction.tracking_status?.status || "Pending";

    // Save to order schema
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        trackingNumber,
        shippingCarrier: carrier,
        shippingLabelUrl: labelUrl,
        deliveryStatus: status,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, transaction, order });
  } catch (error) {
    console.error("Shipping booking error:", error.response?.data || error.message);
    return NextResponse.json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
}
