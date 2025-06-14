import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/config/db';
import Order from '@/models/Order';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Note: This is a named export for POST, not default export!
export async function POST(req) {
  await connectDB();

  const contentType = req.headers.get('content-type');
  const buffer = Buffer.from(await req.arrayBuffer());
  const stream = Readable.from(buffer);
  stream.headers = {
    'content-type': contentType,
    'content-length': buffer.length.toString(),
  };

  const form = formidable({ keepExtensions: true, multiples: false });
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(stream, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const { orderId } = fields;
  const file = Array.isArray(files.proof) ? files.proof[0] : files.proof;

  const cloudRes = await cloudinary.uploader.upload(file.filepath, {
    folder: 'proofs',
    public_id: `${orderId}-proof`,
  });

  const updatedOrder = await Order.findOneAndUpdate(
    { orderId },
    { proofOfPaymentUrl: cloudRes.secure_url },
    { new: true }
  );

  fs.unlinkSync(file.filepath);

  if (!updatedOrder) {
    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, fileUrl: cloudRes.secure_url });
}
