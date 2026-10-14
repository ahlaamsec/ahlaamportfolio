import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import { isStoreConfigured } from '@/lib/store';
import { storeImage } from '@/lib/images';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isValidSession(req.cookies.get('edit_session')?.value)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  if (!isStoreConfigured()) {
    return NextResponse.json({ ok: false, error: 'Storage is not configured.' }, { status: 500 });
  }
  const body = await req.json().catch(() => null);
  const dataUrl = body?.dataUrl;
  if (typeof dataUrl !== 'string' || !/^data:image\/(png|jpeg|webp|gif);base64,/.test(dataUrl)) {
    return NextResponse.json({ ok: false, error: 'That does not look like an image.' }, { status: 400 });
  }
  const url = await storeImage(dataUrl);
  if (!url) return NextResponse.json({ ok: false, error: 'Image is too large or could not be saved.' }, { status: 413 });
  return NextResponse.json({ ok: true, url });
}
