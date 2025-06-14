import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';
import authSeller from '@/lib/authSeller';

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
  const data = await req.json();

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
