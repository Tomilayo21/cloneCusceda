// import { v2 as cloudinary } from 'cloudinary';
// import { NextResponse } from 'next/server';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const POST = async (req) => {
//   const formData = await req.formData();
//   const file = formData.get("file");

//   if (!file) {
//     return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//   }

//   // Convert blob to buffer
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   try {
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream({ folder: "site-logos" }, (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }).end(buffer);
//     });

//     return NextResponse.json({ url: result.secure_url }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
//   }
// };











































import { v2 as cloudinary } from 'cloudinary';
import Settings from '@/models/Settings'; // Mongo model for settings
import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import os from 'os';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save temporarily to disk (required by cloudinary)
    const tempFilePath = path.join(os.tmpdir(), file.name);
    await writeFile(tempFilePath, buffer);

    const uploadRes = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'site-logos',
    });

    await connectDB();

    // Update logo URL in Settings collection (create if doesn't exist)
    await Settings.findOneAndUpdate(
      {},
      { logoUrl: uploadRes.secure_url },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, logoUrl: uploadRes.secure_url });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
