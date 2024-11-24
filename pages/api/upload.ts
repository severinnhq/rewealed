import { NextApiRequest, NextApiResponse } from 'next';
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

  const chunks: Buffer[] = [];
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    const data = Buffer.concat(chunks);
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return res.status(400).json({ message: 'Invalid content type' });
    }
    const parts = parseParts(data, boundary);

    const file = parts.find((part) => part.name === 'file');
    const chunkIndex = parseInt(parts.find((part) => part.name === 'chunk')?.value || '0', 10);
    const totalChunks = parseInt(parts.find((part) => part.name === 'chunks')?.value || '1', 10);

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.filename || 'unnamed_file');

    if (chunkIndex === 0) {
      fs.writeFileSync(filePath, file.data);
    } else {
      fs.appendFileSync(filePath, file.data);
    }

    if (chunkIndex === totalChunks - 1) {
      // All chunks received, file is complete
      res.status(200).json({ message: 'File uploaded successfully' });
    } else {
      res.status(200).json({ message: 'Chunk received' });
    }
  });
}

function parseParts(data: Buffer, boundary: string) {
  const parts = data.toString().split(`--${boundary}`);
  return parts
    .filter((part) => part.trim() !== '' && part.trim() !== '--')
    .map((part) => {
      const [headers, body] = part.split('\r\n\r\n');
      const name = headers.match(/name="([^"]+)"/)?.[1];
      const filename = headers.match(/filename="([^"]+)"/)?.[1];
      return { name, filename, value: body.trim(), data: Buffer.from(body.trim()) };
    });
}

