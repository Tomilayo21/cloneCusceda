import connectDB from '@/config/db';
import Otp from '@/models/Otp';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  await connectDB();

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Generate OTP and expiration
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Clear old OTPs and save new one
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp, expiresAt });

  // Create mail transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Cusceda Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Admin OTP Code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;background:#fff;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#4b0082;">Admin Access OTP</h2>
          <p style="font-size:16px;">Your One-Time Password (OTP) is:</p>
          <div style="font-size:28px;font-weight:bold;margin:20px 0;">${otp}</div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you did not request this, please ignore this message.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
  }
}
