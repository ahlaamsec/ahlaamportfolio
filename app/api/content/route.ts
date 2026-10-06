import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import { getOverrides, setOverride, isStoreConfigured } from '@/lib/store';

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
  const id = body?.id;
  const value = body?.value;
  if (typeof id !== 'string' || typeof value !== 'string') {
    return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
  }
  const saved = await setOverride(id, value);
  return NextResponse.json({ ok: saved });
}
