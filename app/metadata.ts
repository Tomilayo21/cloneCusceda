import connectDB from "@/config/db";
import Settings from "@/models/Settings";

export async function generateMetadata() {
  try {
    await connectDB(); // ensure connection

    const settings = await Settings.findOne(); // underline should now disappear
    return {
      title: settings?.siteTitle || "Cusceda",
      description: settings?.siteDescription || "Innovative, Resilient, Growing",
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "Cusceda",
      description: "Innovative, Resilient, Growing",
    };
  }
}
