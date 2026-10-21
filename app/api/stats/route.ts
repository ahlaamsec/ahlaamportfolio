import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import { isStoreConfigured } from '@/lib/store';
import { getStats } from '@/lib/analytics';

const COOKIE = 'edit_session';

export async function GET(req: NextRequest) {
  if (!isValidSession(req.cookies.get(COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  if (!isStoreConfigured()) {
    return NextResponse.json({ ok: false, error: 'Storage is not configured, so visits cannot be counted yet.' }, { status: 500 });
  }
  const range = [7, 30, 90].includes(Number(req.nextUrl.searchParams.get('days'))) ? Number(req.nextUrl.searchParams.get('days')) : 30;
  const stats = await getStats(range);
  if (!stats) return NextResponse.json({ ok: false, error: 'Could not read visitor numbers.' }, { status: 502 });
  return NextResponse.json({ ok: true, range, ...stats }, { headers: { 'Cache-Control': 'no-store' } });
}
