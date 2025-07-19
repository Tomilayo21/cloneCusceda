import { v2 as cloudinary } from 'cloudinary';
import Settings from '@/models/Settings';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE() {
  try {
    await connectDB();

    const settings = await Settings.findOne();
    if (!settings || !settings.logoUrl) {
      return NextResponse.json({ error: 'No logo found' }, { status: 404 });
    }

    // Extract public_id from the Cloudinary URL
    const urlParts = settings.logoUrl.split('/');
    const publicIdWithExtension = urlParts.slice(-1)[0]; // e.g., logo.png
    const folder = 'site-logos';
    const publicId = `${folder}/${publicIdWithExtension.split('.')[0]}`; // Remove extension

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove logoUrl from MongoDB
    settings.logoUrl = undefined;
    await settings.save();

    return NextResponse.json({ success: true, message: 'Logo deleted' });
  } catch (err) {
    console.error('Delete Error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
