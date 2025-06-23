import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function GET(req) {
  await connectDB();

  try {
    const products = await Product.find({
      stock: { $gt: 0 },
      visible: true,
    });

    return NextResponse.json({ success: true, products });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  const headers = Object.fromEntries(req.headers.entries());

  const authHeader = headers.authorization || '';
  const token = authHeader.split(' ')[1];
  const userId = headers.userid;

  if (!token || !userId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Missing credentials' },
      { status: 401 }
    );
  }

  const isAdmin = await authSeller(userId);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: Admins only' },
      { status: 403 }
    );
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  await connectDB();

  const { id } = params;
  const body = await req.json();
  const headers = Object.fromEntries(req.headers.entries());

  const authHeader = headers.authorization || "";
  const token = authHeader.split(" ")[1];
  const userId = headers.userid;

  if (!token || !userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Missing credentials" },
      { status: 401 }
    );
  }

  const isAdmin = await authSeller(userId);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  try {
    if (body.toggleVisibility) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      product.visible = !product.visible;
      await product.save();

      return NextResponse.json({
        success: true,
        message: "Product visibility toggled",
        visible: product.visible,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Missing toggleVisibility flag" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
  
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const contentType = req.headers.get("content-type");

    // 📦 Handle JSON (stock update)
    if (contentType?.includes("application/json")) {
      const body = await req.json();
      const { stock } = body;

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { stock },
        { new: true }
      );

      if (!updatedProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, product: updatedProduct });
    }

    // 🖼 Handle multipart/form-data (full product edit with images)
    const formData = await req.formData();

    const name = formData.get("name");
    const category = formData.get("category");
    const brand = formData.get("brand");
    const color = formData.get("color");
    const price = Number(formData.get("price"));
    const offerPrice = Number(formData.get("offerPrice"));
    const stock = Number(formData.get("stock"));
    const visible = formData.get("visible") === "true";
    const description = formData.get("description");
    const existingImages = JSON.parse(formData.get("existingImages") || "[]");

    const newImages = formData.getAll("newImages");

    let uploadedImageUrls = [];

    for (const file of newImages) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const stream = bufferToStream(buffer);

      const uploadResult = await new Promise((resolve, reject) => {
        const streamUpload = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "image",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.pipe(streamUpload);
      });

      uploadedImageUrls.push(uploadResult.secure_url);
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        brand,
        color,
        price,
        offerPrice,
        stock,
        visible,
        description,
        image: [...existingImages, ...uploadedImageUrls],
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
