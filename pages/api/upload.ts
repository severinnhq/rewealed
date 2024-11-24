import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
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

    const chunkNumber = parseInt(Array.isArray(fields.chunkNumber) ? fields.chunkNumber[0] : fields.chunkNumber || '0', 10);
    const totalChunks = parseInt(Array.isArray(fields.totalChunks) ? fields.totalChunks[0] : fields.totalChunks || '0', 10);
    const originalFilename = Array.isArray(fields.originalFilename) ? fields.originalFilename[0] : fields.originalFilename || 'unnamed_file';

    const chunkDir = path.join(uploadDir, originalFilename + '.chunks');
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    const chunkPath = path.join(chunkDir, `chunk.${chunkNumber}`);
    await fs.promises.rename(file.filepath, chunkPath);

    if (chunkNumber === totalChunks) {
      // All chunks received, combine them
      const filePath = path.join(uploadDir, originalFilename);
      const writeStream = fs.createWriteStream(filePath);

      for (let i = 1; i <= totalChunks; i++) {
        const chunkPath = path.join(chunkDir, `chunk.${i}`);
        const chunkBuffer = await fs.promises.readFile(chunkPath);
        writeStream.write(chunkBuffer);
        await fs.promises.unlink(chunkPath);
      }

      writeStream.end();
      await fs.promises.rmdir(chunkDir);

      res.status(200).json({ message: 'File uploaded successfully', fileName: originalFilename });
    } else {
      res.status(200).json({ message: 'Chunk received' });
    }
  } catch (error) {
    console.error('Error handling file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

