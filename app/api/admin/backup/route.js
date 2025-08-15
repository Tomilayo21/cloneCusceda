// // app/api/admin/backup/route.js
// import { getAuth } from "@clerk/nextjs/server";
// import authSeller from "@/lib/authAdmin";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import mongoose from "mongoose";
// import archiver from "archiver";
// import { PassThrough } from "stream";

// // Secure admin backup password from env
// const ADMIN_BACKUP_PASSWORD = process.env.ADMIN_BACKUP_PASSWORD || "changeme";

// export async function POST(request) {
//   try {
//     // 1️⃣ Clerk Authentication & Role Check
//     const { userId } = getAuth(request);
//     const isAdmin = await authSeller(userId);

//     if (!isAdmin) {
//       return NextResponse.json({ message: "Not authorized" }, { status: 403 });
//     }

//     // 2️⃣ Password Verification
//     const { password } = await request.json();
//     if (password !== ADMIN_BACKUP_PASSWORD) {
//       return NextResponse.json({ message: "Invalid password" }, { status: 403 });
//     }

//     // 3️⃣ Connect to MongoDB
//     await connectDB();

//     // 4️⃣ Create a zip archive of all collections
//     const collections = await mongoose.connection.db.collections();
//     const archive = archiver("zip", { zlib: { level: 9 } });
//     const passthrough = new PassThrough();

//     archive.pipe(passthrough);

//     for (const collection of collections) {
//       const data = await collection.find({}).toArray();
//       archive.append(JSON.stringify(data, null, 2), { name: `${collection.collectionName}.json` });
//     }

//     archive.finalize();

//     // 5️⃣ Send the zip file as a download
//     return new Response(passthrough, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/zip",
//         "Content-Disposition": "attachment; filename=mongodb-backup.zip",
//       },
//     });

//   } catch (error) {
//     console.error("Backup Error:", error);
//     return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
//   }
// }































import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authAdmin from "@/lib/authAdmin";

const ADMIN_PASSWORD = process.env.ADMIN_BACKUP_PASSWORD || "changeme";

export async function POST(request) {
  try {
    // 1️⃣ Authenticate admin via Clerk metadata
    const isAdmin = await authAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    // 2️⃣ Verify password from request
    const { password } = await request.json();
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "Invalid password" }, { status: 403 });
    }

    // 3️⃣ Connect to DB
    await connectDB(); // uses your centralized mongoose connection

    // 4️⃣ Create backup
    // Example: export collections to JSON
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupData = {};

    for (const { name } of collections) {
      backupData[name] = await mongoose.connection.db.collection(name).find().toArray();
    }

    // 5️⃣ Convert to Blob (zip if needed)
    const json = JSON.stringify(backupData, null, 2);
    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=backup.json",
      },
    });

  } catch (error) {
    console.error("Backup error:", error);
    return NextResponse.json({ message: "Backup failed", error: error.message }, { status: 500 });
  }
}
