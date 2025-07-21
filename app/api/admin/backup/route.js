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
