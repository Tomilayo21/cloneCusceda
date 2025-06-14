// import nodemailer from "nodemailer";
// import Contact from "@/models/Contact";
// import connectDB from "@/config/db";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name, email, subject, message } = body;

//     if (!name || !email || !subject || !message) {
//       return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
//     }

//     // 1. Save to MongoDB
//     await connectDB();
//     await Contact.create({ name, email, subject, message, archived: false });

//     // 2. Send Email
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: Number(process.env.EMAIL_PORT),
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"${name}" <${process.env.EMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       replyTo: email,
//       subject: `Customer Inquiry: ${subject}`,
//       html: `
//         <h2>You've Received a New Inquiry</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Subject:</strong> ${subject}</p>
//         <p><strong>Message:</strong><br/>${message}</p>
//       `,
//     });


//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     console.error("Submit error:", error);
//     return new Response(JSON.stringify({ error: "Failed to submit message" }), { status: 500 });
//   }
// }
































import { UAParser } from "ua-parser-js";
import nodemailer from "nodemailer";
import Contact from "@/models/Contact";
import connectDB from "@/config/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    // Parse user-agent and IP address
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "Unknown IP";

    const parser = new UAParser(userAgent);
    const parsedUA = parser.getResult();
    const device = `${parsedUA.browser.name || "Unknown Browser"} on ${parsedUA.os.name || "Unknown OS"}`;

    // Get location from IP
    let location = "Unknown location";
    try {
      const res = await fetch(`https://ipapi.co/${ip}/json/`);
      if (res.ok) {
        const data = await res.json();
        location = `${data.city || "Unknown City"}, ${data.region || "Unknown Region"}, ${data.country_name || "Unknown Country"}`;
      }
    } catch (err) {
      console.warn("Location fetch failed:", err.message);
    }

    // Connect to DB and save message
    await connectDB();
    await Contact.create({
      name,
      email,
      subject,
      message,
      archived: false,
      device,
      location,
    });

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Customer Inquiry: ${subject}`,
      html: `
        <h2>You've Received a New Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <hr />
        <p><strong>Device:</strong> ${device}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>IP Address:</strong> ${ip}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Submit error:", error);
    return new Response(JSON.stringify({ error: "Failed to submit message" }), { status: 500 });
  }
}
