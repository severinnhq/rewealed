import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const fileArray = files.file;
    if (!fileArray || (Array.isArray(fileArray) && fileArray.length === 0)) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!('filepath' in file)) {
      return res.status(400).json({ message: 'Invalid file object' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.originalFilename}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.promises.copyFile(file.filepath, filePath);
    await fs.promises.unlink(file.filepath);

    res.status(200).json({ message: 'File uploaded successfully', fileName: `/uploads/${fileName}` });
  } catch (error) {
    console.error('Error handling file:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ message: 'Error uploading file', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

