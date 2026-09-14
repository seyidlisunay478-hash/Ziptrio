import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PWA and Favicon PNG assets...');

  // 192x192 standard icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('Created public/pwa-192x192.png');

  // 512x512 standard icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('Created public/pwa-512x512.png');

  // 180x180 Apple Touch Icon (iOS Safari compliant)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png');

  // 32x32 Favicon PNG / ICO fallback
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.resolve('public/favicon-32x32.png'));
  
  // Also copy to favicon.ico for standard browser requests
  fs.copyFileSync(path.resolve('public/favicon-32x32.png'), path.resolve('public/favicon.ico'));
  console.log('Created public/favicon.ico and favicon-32x32.png');

  // Maskable 512x512 icon:
  // Android crops maskable icons into circles or squircles with 10-15% margin.
  // Full-bleed #4338ca background, with central graphic resized to ~80% (410x410)
  const innerGraphic = await sharp(svgBuffer)
    .resize(410, 410)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 67, g: 56, b: 202, alpha: 1 } // #4338ca
    }
  })
    .composite([
      {
        input: innerGraphic,
        top: 51,
        left: 51
      }
    ])
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));

  console.log('Created public/pwa-maskable-512x512.png (maskable safe zone compliant)');
  console.log('All icons generated successfully!');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
