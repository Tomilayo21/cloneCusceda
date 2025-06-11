import connectDB from "@/config/db";
import Contact from "@/models/Contact";

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    await Contact.findByIdAndDelete(params.id);
    return new Response("Message deleted", { status: 200 });
  } catch {
    return new Response("Failed to delete", { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await connectDB();
  try {
    await Contact.findByIdAndUpdate(params.id, { archived: true });
    return new Response("Message archived", { status: 200 });
  } catch {
    return new Response("Failed to archive", { status: 500 });
  }
}
