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
    const form = new formidable.IncomingForm();
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !(file instanceof formidable.File)) {
      return res.status(400).json({ message: 'No file provided or invalid file type' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.originalFilename || 'unnamed_file');

    await fs.promises.rename(file.filepath, filePath);

    res.status(200).json({ message: 'File uploaded successfully', fileName: path.basename(filePath) });
  } catch (error) {
    console.error('Error handling file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

