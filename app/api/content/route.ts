import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import { externalizeImages } from '@/lib/images';
import { getOverrides, setOverride, setOverrides, deleteOverrides, isStoreConfigured } from '@/lib/store';

const COOKIE = 'edit_session';

export async function GET() {
  const overrides = await getOverrides();
  return NextResponse.json({ overrides, configured: isStoreConfigured() });
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE)?.value;
  if (!isValidSession(cookie)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  if (!isStoreConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Storage is not configured (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN missing).' },
      { status: 500 }
    );
  }
  const body = await req.json().catch(() => null);
  // { reset: [ids] } puts those fields back to their original text.
  if (Array.isArray(body?.reset)) {
    const ids = body.reset.filter((x: unknown): x is string => typeof x === 'string');
    return NextResponse.json({ ok: await deleteOverrides(ids) });
  }
  if (body?.values && typeof body.values === 'object') {
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(body.values)) if (typeof v === 'string') clean[k] = v;
    return NextResponse.json({ ok: await setOverrides(clean) });
  }
  const id = body?.id;
  const value = body?.value;
  if (typeof id !== 'string' || typeof value !== 'string') {
    return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
  }
  const saved = await setOverride(id, await externalizeImages(value));
  return NextResponse.json({ ok: saved });
}
