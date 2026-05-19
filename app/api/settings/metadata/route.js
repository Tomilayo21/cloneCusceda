import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Settings from "@/models/Settings";


// ==============================
// POST: Create or Update Settings
// ==============================
export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    const {
      siteTitle,
      siteDescription,
      footerDescription,
      footerPhone,
      footerEmail,
      footerName,
      supportEmail,
      socialLinks,
      logoWidth,
      logoHeight,
    } = data;

    if (!siteTitle || !siteDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await Settings.findOneAndUpdate(
      {},
      {
        siteTitle,
        siteDescription,
        footerDescription,
        footerPhone,
        footerEmail,
        footerName,
        supportEmail,
        socialLinks,
        logoWidth,
        logoHeight,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json(
      { success: true, settings: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("Metadata Update Error:", err);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}


// ==============================
// GET: Fetch Settings
// ==============================
export async function GET() {
  try {
    await connectDB();

    let settings = await Settings.findOne();

    // ✅ If no document exists, create a default one
    if (!settings) {
      settings = await Settings.create({
        siteTitle: "",
        siteDescription: "",
        footerDescription: "",
        footerPhone: "",
        footerEmail: "",
        footerName: "",
        supportEmail: "",
        socialLinks: [],
        logoWidth: "120px",
        logoHeight: "auto",
      });
    }

    return NextResponse.json(
      {
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        footerDescription: settings.footerDescription,
        footerPhone: settings.footerPhone,
        footerEmail: settings.footerEmail,
        footerName: settings.footerName,
        supportEmail: settings.supportEmail,
        socialLinks: settings.socialLinks || [],
        logoWidth: settings.logoWidth || "120px",
        logoHeight: settings.logoHeight || "auto", 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /metadata error:", err);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}