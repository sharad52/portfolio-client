/**
 * One-off image optimizer for public/images.
 * Downscales to a sane max dimension and re-encodes JPEG (mozjpeg) so cover
 * images stop shipping multiple megabytes for a ~176px-tall card / ~768px hero.
 *
 * Run: node scripts/compress-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('public/images');
const MAX_DIM = 1280; // longest edge — plenty for cards (176px) and hero (≤768px)
const QUALITY = 78;
const EXT = new Set(['.jpg', '.jpeg', '.png']);

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

const files = (await readdir(DIR)).filter((f) => EXT.has(path.extname(f).toLowerCase()));

for (const file of files) {
  const src = path.join(DIR, file);
  const before = (await stat(src)).size;
  const tmp = path.join(DIR, `.tmp-${file}`);

  await sharp(src)
    .rotate() // respect EXIF orientation before stripping metadata
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp);

  const after = (await stat(tmp)).size;

  // Only keep the recompressed file if it's actually smaller.
  if (after < before) {
    await rename(tmp, src);
    console.log(`${file.padEnd(20)} ${kb(before).padStart(8)} -> ${kb(after).padStart(8)}  (-${(100 - (after / before) * 100).toFixed(0)}%)`);
  } else {
    await unlink(tmp);
    console.log(`${file.padEnd(20)} ${kb(before).padStart(8)} -> kept original (already optimal)`);
  }
}
