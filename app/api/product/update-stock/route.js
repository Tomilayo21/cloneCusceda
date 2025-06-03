// // import connectDB from "@/lib/connectDB";
// import connectDB from "@/config/db";
// import Product from "@/models/Product";

// export default async function handler(req, res) {
//   if (req.method !== "PATCH") {
//     return res.status(405).end("Method Not Allowed");
//   }

//   try {
//     await connectDB();
//     const { productId, stock } = req.body;

//     if (stock < 0) {
//       return res.status(400).json({ error: "Stock cannot be negative" });
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       { stock },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     return res.status(200).json({ message: "Stock updated", product: updatedProduct });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Server error" });
//   }
// }






























import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    await connectDB();

    const { productId, stock } = await req.json();

    if (stock < 0) {
      return NextResponse.json(
        { error: "Stock cannot be negative" },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Stock updated", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
