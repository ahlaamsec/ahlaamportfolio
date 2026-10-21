import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import { isStoreConfigured, saveFileData } from '@/lib/store';

export const runtime = 'nodejs';

const MAX_CHARS = 4_000_000; // about 3 MB of PDF

// POST /api/file  body: { name: 'cv', dataUrl: 'data:application/pdf;base64,...' }
export async function POST(req: NextRequest) {
  if (!isValidSession(req.cookies.get('edit_session')?.value)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  if (!isStoreConfigured()) {
    return NextResponse.json({ ok: false, error: 'Storage is not configured.' }, { status: 500 });
  }
  const body = await req.json().catch(() => null);
  const name = body?.name;
  const dataUrl = body?.dataUrl;
  if (name !== 'cv') return NextResponse.json({ ok: false, error: 'Unknown file.' }, { status: 400 });
  const m = typeof dataUrl === 'string' ? dataUrl.match(/^data:application\/pdf;base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!m || !Buffer.from(m[1].slice(0, 12), 'base64').toString('latin1').startsWith('%PDF-')) {
    return NextResponse.json({ ok: false, error: 'That is not a PDF file.' }, { status: 400 });
  }
  if (dataUrl.length > MAX_CHARS) {
    return NextResponse.json({ ok: false, error: 'The PDF is larger than 3 MB. Compress it and try again.' }, { status: 413 });
  }
  const ok = await saveFileData(name, dataUrl);
  if (!ok) return NextResponse.json({ ok: false, error: 'Could not save the file.' }, { status: 502 });
  return NextResponse.json({ ok: true, url: `/api/file/${name}?v=${Date.now()}` });
}
