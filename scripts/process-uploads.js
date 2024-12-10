const { readdir, stat } = require('fs').promises;
const { join } = require('path');
const sharp = require('sharp');

async function optimizeImages(directory) {
  try {
    const files = await readdir(directory);
    const imageFiles = files.filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    );

    console.log(`Found ${imageFiles.length} images to process in ${directory}`);

    for (const file of imageFiles) {
      const filePath = join(directory, file);
      const stats = await stat(filePath);
      const originalSize = stats.size / (1024 * 1024); // Convert to MB

      try {
        const outputPath = join(directory, `optimized-${file}`);
        await sharp(filePath)
          .resize(1200, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({
            quality: 80,
            mozjpeg: true
          })
          .toFile(outputPath);

        const optimizedStats = await stat(outputPath);
        const optimizedSize = optimizedStats.size / (1024 * 1024); // Convert to MB
        const savings = ((originalSize - optimizedSize) / originalSize) * 100;

        console.log(`✓ Optimized: ${file}`);
        console.log(`  Original: ${originalSize.toFixed(2)} MB`);
        console.log(`  Optimized: ${optimizedSize.toFixed(2)} MB`);
        console.log(`  Savings: ${savings.toFixed(2)}%`);
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

// Specify the path to your uploads/reviews directory
const uploadsPath = './public/uploads/reviews';

(async () => {
  console.log(`Processing images in: ${uploadsPath}`);
  await optimizeImages(uploadsPath);
})();