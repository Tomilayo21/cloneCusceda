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




















// import nodemailer from "nodemailer";
// import Contact from "@/models/Contact";
// import connectDB from "@/config/db";
// import { UAParser } from "ua-parser-js";
// import fetch from "node-fetch";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name, email, subject, message } = body;

//     if (!name || !email || !subject || !message) {
//       return new Response(JSON.stringify({ error: "All fields are required" }), {
//         status: 400,
//       });
//     }

//     await connectDB();

//     // Get user-agent and IP
//     const userAgent = req.headers.get("user-agent") || "";
//     let ip =
//       req.headers.get("x-forwarded-for")?.split(",")[0] ||
//       req.headers.get("x-real-ip") ||
//       "8.8.8.8"; // fallback for localhost/dev


//     // Parse device info
//     const parser = new UAParser(userAgent);
//     const device = `${parser.getBrowser().name} on ${parser.getOS().name}`;

//     // Get location info via IP
//     // let location = "Unknown";
//     // try {
//     //   const res = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`);
//     //   if (res.ok) {
//     //     const data = await res.json();
//     //     location = `${data.city}, ${data.region}, ${data.country}`;
//     //   }
//     // } catch (err) {
//     //   console.warn("IP lookup failed:", err.message);
//     // }
//     let location = "Unknown";
//     try {
//       const res = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`);
//       if (res.ok) {
//         const data = await res.json();
//         const { city, region, country } = data || {};
//         if (city || region || country) {
//           location = [city, region, country].filter(Boolean).join(", ");
//         }
//       } else {
//         console.warn("IPInfo failed with status:", res.status);
//       }
//     } catch (err) {
//       console.warn("IP lookup failed:", err.message);
//     }


//     // Save to DB
//     const saved = await Contact.create({
//       name,
//       email,
//       subject,
//       message,
//       device,
//       location,
//       archived: false,
//       read: false,
//       deleted: false,
//     });

//     // Send email
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
//         <h2>New Message Received</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Subject:</strong> ${subject}</p>
//         <p><strong>Device:</strong> ${device}</p>
//         <p><strong>Location:</strong> ${location}</p>
//         <p><strong>Message:</strong><br/>${message}</p>
//       `,
//     });

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     console.error("Submit error:", error);
//     return new Response(JSON.stringify({ error: "Failed to submit message" }), {
//       status: 500,
//     });
//   }
// }




































import nodemailer from "nodemailer";
import Contact from "@/models/Contact";
import connectDB from "@/config/db";
import { UAParser } from "ua-parser-js";
import fetch from "node-fetch";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
      });
    }

    await connectDB();

    // Get user-agent and IP
    const userAgent = req.headers.get("user-agent") || "";
    let ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "8.8.8.8";

    // Parse device info
    const parser = new UAParser(userAgent);
    const device = `${parser.getBrowser().name} on ${parser.getOS().name}`;

    // Location lookup
    let location = "Unknown";
    try {
      const res = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`);
      if (res.ok) {
        const data = await res.json();
        const { city, region, country } = data || {};
        if (city || region || country) {
          location = [city, region, country].filter(Boolean).join(", ");
        }
      }
    } catch (err) {
      console.warn("IP lookup failed:", err.message);
    }

    // Save to DB
    await Contact.create({
      name,
      email,
      subject,
      message,
      device,
      location,
      archived: false,
      read: false,
      deleted: false,
    });

    // Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // SAFER 'from' — do NOT use the user's email in the "from" field.
    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Customer Inquiry: ${subject}`,
      // replyTo: email,
      html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Device:</strong> ${device}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Submit error:", error);
    return new Response(JSON.stringify({ error: "Failed to submit message" }), {
      status: 500,
    });
  }
}
