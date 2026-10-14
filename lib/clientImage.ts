// Browser-side helpers: shrink a picked image, send it to the server, get a short URL back.

export function compressImage(file: File, maxSide = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const original = String(reader.result);
      if (file.type === 'image/gif') return resolve(original);
      if (file.type === 'image/svg+xml') return reject(new Error('SVG images are not accepted. Use PNG or JPG.'));
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not an image the browser can open.'));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(original);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = original;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(file: File, maxSide = 1600): Promise<string> {
  const dataUrl = await compressImage(file, maxSide);
  const res = await fetch('/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || 'Image upload failed.');
  return data.url as string;
}

export async function importDocument(file: File): Promise<string[]> {
  const form = new FormData();
  form.append('files', file);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  const r = data?.results?.[0];
  if (!res.ok || !r?.ok) throw new Error(r?.error || data?.error || 'Could not read that document.');
  return r.content as string[];
}
