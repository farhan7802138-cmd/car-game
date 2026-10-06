import fs from 'fs';
import zlib from 'zlib';

function createSolidPng(width, height, r, g, b, a = 255) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // Compute CRC32
    let crc = 0 ^ (-1);
    const combined = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < combined.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ combined[i]) & 0xff];
    }
    crc = (crc ^ (-1)) >>> 0;
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, combined, crcBuf]);
  }

  // Precompute CRC table
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }

  // Raw image scanlines
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      // Create a nice gradient with neon racing colors
      const distFromCenter = Math.hypot(x - width / 2, y - height / 2) / (width / 2);
      const isCorner = Math.abs(x - width/2) > (width * 0.44) && Math.abs(y - height/2) > (height * 0.44);
      
      let pr = r, pg = g, pb = b;
      if (distFromCenter < 0.6) {
        // glowing center
        pr = Math.min(255, r + 40);
        pg = Math.min(255, g + 80);
        pb = 255;
      } else if (distFromCenter < 0.85) {
        pr = 255;
        pg = 80;
        pb = 120;
      }
      
      rawData[offset++] = pr;
      rawData[offset++] = pg;
      rawData[offset++] = pb;
      rawData[offset++] = isCorner ? 0 : a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const icon192 = createSolidPng(192, 192, 15, 23, 42);
const icon512 = createSolidPng(512, 512, 15, 23, 42);

fs.writeFileSync('./public/pwa-192x192.png', icon192);
fs.writeFileSync('./public/pwa-512x512.png', icon512);
fs.writeFileSync('./public/apple-touch-icon.png', icon192);
fs.writeFileSync('./public/favicon.ico', icon192);
console.log('PWA PNG Icons generated successfully!');
