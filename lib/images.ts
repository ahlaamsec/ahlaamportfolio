import { randomBytes } from 'crypto';
import { saveImageData, isStoreConfigured } from './store';

const DATA_IMG = /!\[([^\]]*)\]\((data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+)\)/g;
export const MAX_IMAGE_CHARS = 3_000_000; // ~2.2 MB of image once decoded

export function newImageId(): string {
  return randomBytes(9).toString('hex');
}

async function shrink(dataUrl: string): Promise<string> {
  // Large docx screenshots are shrunk so they fit in the store. If the
  // optional image library is missing, the original is kept.
  if (dataUrl.length < 600_000 || dataUrl.startsWith('data:image/gif')) return dataUrl;
  try {
    const sharp = (await import('sharp')).default;
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    const out = await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    return `data:image/webp;base64,${out.toString('base64')}`;
  } catch {
    return dataUrl;
  }
}

export async function storeImage(dataUrl: string): Promise<string | null> {
  const small = await shrink(dataUrl);
  if (small.length > MAX_IMAGE_CHARS) return null;
  const id = newImageId();
  const ok = await saveImageData(id, small);
  return ok ? `/api/image/${id}` : null;
}

// Replaces any inline base64 image in a block of text with a stored image URL.
export async function externalizeImages(text: string): Promise<string> {
  if (!isStoreConfigured() || !text.includes('data:image/')) return text;
  const matches = [...text.matchAll(DATA_IMG)];
  let out = text;
  for (const m of matches) {
    const url = await storeImage(m[2]);
    if (url) out = out.replace(m[0], `![${m[1]}](${url})`);
  }
  return out;
}
