// app/api/contact/route.js
import connectDB from "@/config/db";
import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400,
      });
    }

    const saved = await Contact.create({ name, email, subject, message });

    return new Response(JSON.stringify({ success: true, saved }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}
