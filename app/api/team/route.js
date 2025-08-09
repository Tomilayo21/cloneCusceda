import connectDB from "@/config/db";
import authSeller from "@/lib/authAdmin";
import Team from "@/models/Team";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all team entries (sorted by section & position)
export async function GET() {
  await connectDB();
  const teams = await Team.find().sort({ position: 1 });

  return NextResponse.json(teams);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const heading = formData.get("heading");
    const subheading = formData.get("subheading");
    const section = formData.get("section");
    const description = formData.get("description");
    const position = formData.get("position");
    const files = formData.getAll("images");

    // Get existing images if provided (when editing)
    const existingImages = JSON.parse(formData.get("existingImages") || "[]");

    // Validate file types
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)
    );

    // Upload new files to Cloudinary
    const newUploadedImages = await Promise.all(
      validFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(buffer);
        });
      })
    );

    // Merge old + new images
    const allImages = [...existingImages, ...newUploadedImages];

    // Save to DB
    const newTeam = await Team.create({
      title: formData.get("title"),
      description: formData.get("description"),
      image: allImages,
      heading,
      subheading,
      section,
      description,
      position,
    });

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const updates = await request.json();
    await connectDB();

    const updatePromises = updates.map(({ _id, position }) =>
      Team.findByIdAndUpdate(_id, { position })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
