const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks

export async function uploadFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
    const start = (chunkNumber - 1) * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('file', chunk, file.name);
    formData.append('chunkNumber', chunkNumber.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('originalFilename', file.name);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file chunk');
    }

    if (onProgress) {
      onProgress((chunkNumber / totalChunks) * 100);
    }
  }

  return file.name;
}

