// /app/api/backup/route.js
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import archiver from 'archiver';
import { PassThrough } from 'stream';
import { Readable } from 'stream';

const ADMIN_PASSWORD = process.env.ADMIN_BACKUP_PASSWORD;

export async function POST(req) {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
  }

  // Connect to DB
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = new PassThrough();

  archive.pipe(stream);

  for (const coll of collections) {
    const data = await db.collection(coll.name).find().toArray();
    const json = JSON.stringify(data, null, 2);
    archive.append(json, { name: `${coll.name}.json` });
  }

  await archive.finalize();

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="mongodb-backup.zip"',
    },
  });
}






















// import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
// import mongoose from 'mongoose';
// import archiver from 'archiver';
// import { PassThrough } from 'stream';
// import { Resend } from 'resend';
// import { Readable } from 'stream';

// const ADMIN_PASSWORD = process.env.ADMIN_BACKUP_PASSWORD;
// const MONGODB_URI = process.env.MONGODB_URI;
// const resend = new Resend(process.env.RESEND_API_KEY); // email service

// export async function POST(req) {
//   const user = await currentUser();
//   const { password } = await req.json();

//   // Auth Check
//   if (!user || user.publicMetadata?.role !== 'admin') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
//   if (password !== ADMIN_PASSWORD) {
//     return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
//   }

//   // Mongo Connection
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(MONGODB_URI);
//   }
//   const db = mongoose.connection.db;

//   // Setup archive
//   const archive = archiver('zip', { zlib: { level: 9 } });
//   const stream = new PassThrough();
//   archive.pipe(stream);

//   const collections = await db.listCollections().toArray();
//   const summary = {
//     generatedAt: new Date().toISOString(),
//     totalCollections: collections.length,
//     collections: [],
//   };

//   for (const coll of collections) {
//     const data = await db.collection(coll.name).find().toArray();
//     summary.collections.push({
//       name: coll.name,
//       documentCount: data.length,
//     });
//     const json = JSON.stringify(data, null, 2);
//     archive.append(json, { name: `${coll.name}.json` });
//   }

//   // Add summary.json
//   archive.append(JSON.stringify(summary, null, 2), { name: 'summary.json' });

//   await archive.finalize();

//   // Notify Admin via Email (Resend)
//   await resend.emails.send({
//     from: 'backup@yourdomain.com',
//     to: user.emailAddresses[0].emailAddress,
//     subject: 'MongoDB Backup Generated',
//     html: `
//       <p>Hello ${user.firstName || 'Admin'},</p>
//       <p>A new MongoDB backup has been generated at <strong>${summary.generatedAt}</strong>.</p>
//       <p><strong>Collections:</strong> ${summary.totalCollections}</p>
//       <ul>
//         ${summary.collections
//           .map(
//             (c) => `<li>${c.name}: ${c.documentCount} documents</li>`
//           )
//           .join('')}
//       </ul>
//       <p><em>This backup was downloaded directly from your dashboard.</em></p>
//     `,
//   });

//   // Return ZIP stream
//   return new NextResponse(stream, {
//     headers: {
//       'Content-Type': 'application/zip',
//       'Content-Disposition': 'attachment; filename="mongodb-backup.zip"',
//     },
//   });
// }




































// import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
// import mongoose from 'mongoose';
// import archiver from 'archiver';
// import { PassThrough } from 'stream';
// import nodemailer from 'nodemailer';

// const ADMIN_PASSWORD = process.env.ADMIN_BACKUP_PASSWORD;
// const MONGODB_URI = process.env.MONGODB_URI;

// export async function POST(req) {
//   const user = await currentUser();
//   const { password } = await req.json();

//   // ✅ Auth check
//   if (!user || user.publicMetadata?.role !== 'admin') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   if (password !== ADMIN_PASSWORD) {
//     return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
//   }

//   // ✅ MongoDB Connect
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(MONGODB_URI);
//   }
//   const db = mongoose.connection.db;

//   const archive = archiver('zip', { zlib: { level: 9 } });
//   const stream = new PassThrough();
//   archive.pipe(stream);

//   const collections = await db.listCollections().toArray();
//   const summary = {
//     generatedAt: new Date().toISOString(),
//     totalCollections: collections.length,
//     collections: [],
//   };

//   for (const coll of collections) {
//     const data = await db.collection(coll.name).find().toArray();
//     summary.collections.push({
//       name: coll.name,
//       documentCount: data.length,
//     });
//     const json = JSON.stringify(data, null, 2);
//     archive.append(json, { name: `${coll.name}.json` });
//   }

//   archive.append(JSON.stringify(summary, null, 2), { name: 'summary.json' });
//   await archive.finalize();

//   // ✅ Nodemailer: Yahoo SMTP config
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: parseInt(process.env.EMAIL_PORT),
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const emailBody = `
//     <p>Hi ${user.firstName || 'Admin'},</p>
//     <p>A MongoDB backup was generated at <strong>${summary.generatedAt}</strong>.</p>
//     <p><strong>Total Collections:</strong> ${summary.totalCollections}</p>
//     <ul>
//       ${summary.collections.map(c => `<li>${c.name}: ${c.documentCount} documents</li>`).join('')}
//     </ul>
//     <p><em>This backup was downloaded directly from the dashboard.</em></p>
//   `;

//   await transporter.sendMail({
//     from: `"Backup System" <${process.env.EMAIL_USER}>`,
//     to: process.env.ADMIN_EMAIL,
//     subject: 'MongoDB Backup Notification',
//     html: emailBody,
//   });

//   return new NextResponse(stream, {
//     headers: {
//       'Content-Type': 'application/zip',
//       'Content-Disposition': 'attachment; filename="mongodb-backup.zip"',
//     },
//   });
// }











































// import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
// import mongoose from 'mongoose';
// import archiver from 'archiver';
// import nodemailer from 'nodemailer';
// import { uploadToGoogleDrive } from '@/lib/uploadToDrive';
// import { PassThrough } from 'stream';

// export async function POST(req) {
//   const user = await currentUser();
//   const { password } = await req.json();

//   if (!user || user.publicMetadata?.role !== 'admin') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   if (password !== process.env.ADMIN_BACKUP_PASSWORD) {
//     return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
//   }

//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGODB_URI);
//   }

//   const db = mongoose.connection.db;
//   const collections = await db.listCollections().toArray();

//   const summary = {
//     generatedAt: new Date().toISOString(),
//     totalCollections: collections.length,
//     collections: [],
//   };

//   const archive = archiver('zip', { zlib: { level: 9 } });
//   const chunks = [];

//   archive.on('data', chunk => chunks.push(chunk));

//   for (const coll of collections) {
//     const data = await db.collection(coll.name).find().toArray();
//     summary.collections.push({
//       name: coll.name,
//       documentCount: data.length,
//     });
//     archive.append(JSON.stringify(data, null, 2), { name: `${coll.name}.json` });
//   }

//   archive.append(JSON.stringify(summary, null, 2), { name: 'summary.json' });

//   await archive.finalize();

//   const zipBuffer = Buffer.concat(chunks);
//   const driveLink = await uploadToGoogleDrive(zipBuffer, `backup-${Date.now()}.zip`);

//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: parseInt(process.env.EMAIL_PORT),
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Backup System" <${process.env.EMAIL_USER}>`,
//     to: process.env.ADMIN_EMAIL,
//     subject: 'MongoDB Backup Uploaded',
//     html: `
//       <p>Hi ${user.firstName || 'Admin'},</p>
//       <p>A new MongoDB backup was uploaded to Google Drive:</p>
//       <p><a href="${driveLink}" target="_blank">View Backup in Drive</a></p>
//       <p><strong>Summary:</strong></p>
//       <ul>
//         ${summary.collections.map(c => `<li>${c.name}: ${c.documentCount} documents</li>`).join('')}
//       </ul>
//       <p><em>Generated: ${summary.generatedAt}</em></p>
//     `,
//   });

//   return NextResponse.json({ success: true, driveLink });
// }






























// import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
// import mongoose from 'mongoose';
// import archiver from 'archiver';
// import fs from 'fs';
// import path from 'path';
// import { uploadToGoogleDrive } from '@/lib/uploadToDrive';

// const ADMIN_PASSWORD = process.env.ADMIN_BACKUP_PASSWORD;

// export async function POST(req) {
//   const user = await currentUser();
//   if (!user || user.publicMetadata?.role !== 'admin') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { password } = await req.json();
//   if (password !== ADMIN_PASSWORD) {
//     return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
//   }

//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGODB_URI);
//   }

//   const db = mongoose.connection.db;
//   const collections = await db.listCollections().toArray();
//   const backupFile = path.join(process.cwd(), 'mongodb-backup.zip');

//   const output = fs.createWriteStream(backupFile);
//   const archive = archiver('zip', { zlib: { level: 9 } });

//   archive.pipe(output);

//   for (const coll of collections) {
//     const data = await db.collection(coll.name).find().toArray();
//     archive.append(JSON.stringify(data, null, 2), { name: `${coll.name}.json` });
//   }

//   await archive.finalize();

//   await new Promise((resolve, reject) => {
//     output.on('close', resolve);
//     archive.on('error', reject);
//   });

//   // Upload to Google Drive
//   const driveResponse = await uploadToGoogleDrive(backupFile, 'mongodb-backup.zip');

//   // Optional: delete local zip after upload
//   fs.unlinkSync(backupFile);

//   return NextResponse.json({
//     message: 'Backup created and uploaded',
//     driveLink: driveResponse.webViewLink,
//     downloadLink: driveResponse.webContentLink,
//   });
// }
