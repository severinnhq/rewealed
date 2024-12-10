import sharp from 'sharp';

async function optimizeImage(buffer) {
  try {
    // Resize the image to a maximum width of 1200px while maintaining aspect ratio
    // Convert to JPEG format with 80% quality
    const optimized = await sharp(buffer)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({
        quality: 80,
        mozjpeg: true
      })
      .toBuffer();

    console.log(`Optimized image size: ${(optimized.length / 1024 / 1024).toFixed(2)}MB`);
    return optimized;
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
}

// Example usage with a sample image
const sampleImageUrl = 'https://picsum.photos/2000/2000';
console.log('Fetching and optimizing a sample image...');

try {
  const response = await fetch(sampleImageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  console.log(`Original image size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
  
  const optimized = await optimizeImage(buffer);
  console.log(`Size reduction: ${(((buffer.length - optimized.length) / buffer.length) * 100).toFixed(2)}%`);
} catch (error) {
  console.error('Error:', error);
}