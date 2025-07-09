import nodemailer from "nodemailer";
import Subscriber from "@/models/Subscriber";
import connectDB from "@/config/db";

export async function POST(req) {
  await connectDB();
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
  }

  const existing = await Subscriber.findOne({ email });
  if (existing) {
    return new Response(JSON.stringify({ message: "You’re already subscribed.", alreadySubscribed: true }), { status: 200 });
  }

  const newSubscriber = new Subscriber({ email });
  await newSubscriber.save();

  // Send welcome email
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Cusceda NG" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to Cusceda NG!",
      html: `
        <div style="max-width: 600px; margin: 30px auto; padding: 30px; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 10px; font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center;">
            <h1 style="color: #2c3e50;">🎉 Welcome to Cusceda NG!</h1>
            <p style="font-size: 16px;">Thanks for subscribing to our newsletter.</p>
          </div>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

          <div>
            <p style="font-size: 15px; line-height: 1.6;">
              We're thrilled to have you on board! Here's what you'll enjoy:
            </p>
           <ul style="padding-left: 0; list-style: none; font-size: 15px; line-height: 1.6;">
              <li>📰 Updates on new products & services</li>
              <li>💡 Expert tips and insights</li>
              <li>🎁 Special subscriber-only deals</li>
            </ul>
            <p style="font-size: 15px; line-height: 1.6;">
              We promise to deliver only high-value content, no spam.
            </p>
          </div>

          <div style="margin-top: 30px;">
            <h3 style="color: #2c3e50;">🔗 Quick Links</h3>
            <ul style="list-style: none; padding: 0; font-size: 15px;">
              <li><a href="https://cusceda.ng/blog" style="color: #007BFF; text-decoration: none;">📝 Our Blog</a></li>
              <li><a href="https://cusceda.ng/products" style="color: #007BFF; text-decoration: none;">🛍️ View Products</a></li>
              <li><a href="https://cusceda.ng/contact" style="color: #007BFF; text-decoration: none;">📞 Contact Support</a></li>

            </ul>
          </div>

          <div style="margin-top: 40px; text-align: center;">
            <p style="font-size: 15px;">Follow us on social media:</p>
            <div style="margin-top: 10px;">
              <a href="https://facebook.com/cusceda" style="margin: 0 10px;"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" width="24" /></a>
              <a href="https://twitter.com/cusceda" style="margin: 0 10px;"><img src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg" alt="Twitter" width="24" /></a>
              <a href="https://instagram.com/cusceda" style="margin: 0 10px;"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="24" /></a>
              <a href="https://linkedin.com/company/cusceda" style="margin: 0 10px;"><img src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg" alt="LinkedIn" width="24" /></a>
            </div>
          </div>

          <div style="margin-top: 40px; font-size: 13px; color: #999; text-align: center;">
            <p>If you didn’t sign up for this, you can unsubscribe<a href="https://quick-carty.vercel.app/unsubscribe?email=${encodeURIComponent(email)}" style="color: #007BFF;"> here</a>.</p>
            <p>&copy; ${new Date().getFullYear()} Cusceda NG. All rights reserved.</p>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err.message);
    return new Response(JSON.stringify({ message: "Subscription saved, but failed to send welcome email." }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Subscribed successfully!" }), { status: 201 });
}
