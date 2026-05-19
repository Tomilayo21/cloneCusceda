import { NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      email,
      pdfBuffer,
      invoiceNumber,
      orderId,
    } = body;

    await sendInvoiceEmail({
      to: email,
      invoiceNumber,
      text: "Thank you for your order. Your invoice is attached.",
      html: `
        <h2>Thank you for your order 🎉</h2>
        <p>Your invoice <b>${invoiceNumber}</b> is attached.</p>
        <p>Order ID: ${orderId}</p>
      `,
      pdfBuffer: Buffer.from(pdfBuffer),
    });

    return NextResponse.json({
      success: true,
      message: "Invoice sent successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Email failed" },
      { status: 500 }
    );
  }
}