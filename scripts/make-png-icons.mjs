import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, isMaskable = false) {
  // Create RGBA pixel buffer
  const stride = width * 4 + 1; // 1 filter byte + RGBA pixels
  const rawBuffer = Buffer.alloc(stride * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.48 : 0.25);

  // Colors:
  // Indigo-600: [79, 70, 229, 255]
  // Indigo-800: [55, 48, 163, 255]
  // Indigo-950: [30, 27, 75, 255]
  // Amber-400: [251, 191, 36, 255]
  // Cyan-400: [56, 189, 248, 255]
  // White: [255, 255, 255, 255]

  const scale = isMaskable ? 0.72 : 0.88;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    rawBuffer[rowOffset] = 0; // None filter

    const dy = y - cy;
    const normY = y / height;

    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const pixelOffset = rowOffset + 1 + x * 4;

      // Base background gradient: Indigo to Deep Indigo
      const rGrad = Math.round(79 - normY * 35);
      const gGrad = Math.round(70 - normY * 30);
      const bGrad = Math.round(229 - normY * 70);

      let r = rGrad;
      let g = gGrad;
      let b = bGrad;
      let a = 255;

      if (!isMaskable) {
        // Rounded squircle mask
        const cornerRadius = width * 0.25;
        const qx = Math.max(0, Math.abs(dx) - (cx - cornerRadius));
        const qy = Math.max(0, Math.abs(dy) - (cy - cornerRadius));
        const dist = Math.sqrt(qx * qx + qy * qy);

        if (dist > cornerRadius) {
          // Outside squircle: transparent
          rawBuffer[pixelOffset] = 0;
          rawBuffer[pixelOffset + 1] = 0;
          rawBuffer[pixelOffset + 2] = 0;
          rawBuffer[pixelOffset + 3] = 0;
          continue;
        } else if (dist > cornerRadius - 1.5) {
          // Antialias edge
          a = Math.round(255 * (cornerRadius - dist + 1.5) / 1.5);
        }

        // Inner border highlight
        if (dist >= cornerRadius - 4 && dist <= cornerRadius - 1.5) {
          r = Math.min(255, r + 40);
          g = Math.min(255, g + 40);
          b = Math.min(255, b + 40);
        }
      }

      // Normalized coordinates inside icon graphic (-1 to +1)
      const nx = (dx / (cx * scale));
      const ny = (dy / (cy * scale));

      // 1. Left Bracket '<': lines from (-0.45, -0.4) to (-0.75, 0) to (-0.45, 0.4)
      const bracketThickness = 0.12;
      let inLeftBracket = false;
      if (nx <= -0.35 && nx >= -0.85 && Math.abs(ny) <= 0.45) {
        // Distance to ray from (-0.75, 0) along direction (0.3, 0.4) or (0.3, -0.4)
        const expectedX = -0.75 + Math.abs(ny) * 0.75;
        if (Math.abs(nx - expectedX) < bracketThickness) {
          inLeftBracket = true;
        }
      }

      // 2. Right Bracket '>': lines from (0.45, -0.4) to (0.75, 0) to (0.45, 0.4)
      let inRightBracket = false;
      if (nx >= 0.35 && nx <= 0.85 && Math.abs(ny) <= 0.45) {
        const expectedX = 0.75 - Math.abs(ny) * 0.75;
        if (Math.abs(nx - expectedX) < bracketThickness) {
          inRightBracket = true;
        }
      }

      // 3. Central Lightning Bolt:
      // points: (0.1, -0.55), (-0.2, 0.0), (0.02, 0.0), (-0.12, 0.55), (0.22, -0.05), (0.0, -0.05)
      let inBolt = false;
      if (Math.abs(nx) <= 0.35 && Math.abs(ny) <= 0.55) {
        // Upper segment of bolt
        if (ny <= 0 && ny >= -0.55) {
          const boltCenterX = 0.1 - (ny + 0.55) * 0.55;
          if (Math.abs(nx - boltCenterX) < 0.14) inBolt = true;
        }
        // Lower segment of bolt
        if (ny >= -0.05 && ny <= 0.55) {
          const boltCenterX = 0.05 - (ny + 0.05) * 0.4;
          if (Math.abs(nx - boltCenterX) < 0.13) inBolt = true;
        }
      }

      // 4. Little editor status dots at top (Red, Amber, Green)
      let inRedDot = Math.hypot(nx - (-0.35), ny - (-0.65)) < 0.06;
      let inAmberDot = Math.hypot(nx - (-0.2), ny - (-0.65)) < 0.06;
      let inGreenDot = Math.hypot(nx - (-0.05), ny - (-0.65)) < 0.06;

      // Render shapes
      if (inBolt) {
        // Amber spark
        r = 251;
        g = 191;
        b = 36;
      } else if (inLeftBracket || inRightBracket) {
        // White bracket with cyan accent
        r = 255;
        g = 255;
        b = 255;
      } else if (inRedDot) {
        r = 239; g = 68; b = 68;
      } else if (inAmberDot) {
        r = 245; g = 158; b = 11;
      } else if (inGreenDot) {
        r = 16; g = 185; b = 129;
      }

      rawBuffer[pixelOffset] = r;
      rawBuffer[pixelOffset + 1] = g;
      rawBuffer[pixelOffset + 2] = b;
      rawBuffer[pixelOffset + 3] = a;
    }
  }

  // PNG Construction
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression: Deflate
  ihdrData[11] = 0; // Filter: 0
  ihdrData[12] = 0; // Interlace: None

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk (Deflate compressed)
  const compressedData = zlib.deflateSync(rawBuffer, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);

  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);

  const crcTarget = Buffer.concat([typeBuf, data]);
  const crc = zlib.crc32(crcTarget);
  chunk.writeUInt32BE(crc, 8 + len);

  return chunk;
}

// Generate files
const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating PWA icons and favicons...');

// 1. pwa-192x192.png
const pwa192 = createPng(192, 192, false);
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), pwa192);
console.log('Created public/pwa-192x192.png');

// 2. pwa-512x512.png
const pwa512 = createPng(512, 512, false);
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), pwa512);
console.log('Created public/pwa-512x512.png');

// 3. pwa-maskable-512x512.png (Android Maskable with full bleed and 15% safe-zone margin)
const pwaMaskable = createPng(512, 512, true);
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), pwaMaskable);
console.log('Created public/pwa-maskable-512x512.png');

// 4. apple-touch-icon.png (180x180)
const appleIcon = createPng(180, 180, true);
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), appleIcon);
console.log('Created public/apple-touch-icon.png');

// 5. favicon-32x32.png
const fav32 = createPng(32, 32, false);
fs.writeFileSync(path.join(outDir, 'favicon-32x32.png'), fav32);
fs.writeFileSync(path.join(outDir, 'favicon.ico'), fav32);
console.log('Created public/favicon-32x32.png and public/favicon.ico');

console.log('All icons generated successfully!');
