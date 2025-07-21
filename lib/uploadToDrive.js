// // utils/uploadToDrive.js
// import { google } from 'googleapis';
// import fs from 'fs';

// export async function uploadToGoogleDrive(buffer, fileName, mimeType = 'application/zip') {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: 'lib/credentials.json',
//     scopes: ['https://www.googleapis.com/auth/drive'],
//   });

//   const drive = google.drive({ version: 'v3', auth });

//   const fileMetadata = {
//     name: fileName,
//     parents: [process.env.GDRIVE_FOLDER_ID], // target folder
//   };

//   const media = {
//     mimeType,
//     body: bufferToStream(buffer),
//   };

//   const file = await drive.files.create({
//     resource: fileMetadata,
//     media,
//     fields: 'id, webViewLink',
//   });

//   return file.data.webViewLink;
// }

// // Convert Buffer to readable stream
// function bufferToStream(buffer) {
//   const { Readable } = require('stream');
//   const stream = new Readable();
//   stream.push(buffer);
//   stream.push(null);
//   return stream;
// }










































// // lib/uploadToDrive.js
// import { google } from 'googleapis';
// import fs from 'fs';

// export const uploadToGoogleDrive = async (filePath, fileName) => {
//   const credentials = JSON.parse(
//     fs.readFileSync('/lib/credentials.json', 'utf-8')
//   );

//   const auth = new google.auth.JWT(
//     credentials.client_email,
//     null,
//     credentials.private_key,
//     ['https://www.googleapis.com/auth/drive.file'] // Or 'https://www.googleapis.com/auth/drive'
//   );

//   const drive = google.drive({ version: 'v3', auth });

//   const fileMetadata = {
//     name: fileName,
//   };

//   const media = {
//     mimeType: 'application/json',
//     body: fs.createReadStream(filePath),
//   };

//   const file = await drive.files.create({
//     resource: fileMetadata,
//     media,
//     fields: 'id, webViewLink',
//   });

//   return file.data;
// };












































// import { google } from 'googleapis';
// import { PassThrough } from 'stream';

// function bufferToStream(buffer) {
//   const stream = new PassThrough();
//   stream.end(buffer);
//   return stream;
// }

// export const uploadToGoogleDrive = async (buffer, filename) => {
//   const auth = new google.auth.JWT(
//     process.env.GOOGLE_CLIENT_EMAIL,
//     null,
//     process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     ['https://www.googleapis.com/auth/drive.file']
//   );

//   const drive = google.drive({ version: 'v3', auth });

//   try {
//     const res = await drive.files.create({
//       requestBody: {
//         name: filename,
//         mimeType: 'application/zip',
//       },
//       media: {
//         mimeType: 'application/zip',
//         body: bufferToStream(buffer),
//       },
//     });

//     return `https://drive.google.com/file/d/${res.data.id}/view`;
//   } catch (error) {
//     console.error('Drive upload failed:', error);
//     throw error;
//   }
// };
























import { google } from 'googleapis';
import { PassThrough } from 'stream';

function bufferToStream(buffer) {
  const stream = new PassThrough();
  stream.end(buffer);
  return stream;
}

async function createBackupFolderIfNeeded(drive, folderName = 'MongoDB Backups') {
  // Check if folder already exists
  const res = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
    fields: 'files(id, name)',
  });

  if (res.data.files.length > 0) {
    return res.data.files[0].id; // Folder already exists
  }

  // Create the folder
  const folder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  return folder.data.id;
}

export const uploadToGoogleDrive = async (buffer, filename) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive']
  );

  const drive = google.drive({ version: 'v3', auth });

  try {
    const folderId = await createBackupFolderIfNeeded(drive, 'MongoDB Backups');

    const res = await drive.files.create({
      requestBody: {
        name: filename,
        parents: [folderId],
        mimeType: 'application/zip',
      },
      media: {
        mimeType: 'application/zip',
        body: bufferToStream(buffer),
      },
      fields: 'id',
    });

    return `https://drive.google.com/file/d/${res.data.id}/view`;
  } catch (error) {
    console.error('Drive upload failed:', error.response?.data || error.message);
    throw error;
  }
};
