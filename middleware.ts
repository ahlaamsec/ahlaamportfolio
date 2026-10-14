import { NextRequest, NextResponse } from 'next/server';

// CSRF guard: any request that changes data must come from this site itself.
export function middleware(req: NextRequest) {
  const m = req.method;
  if (m === 'GET' || m === 'HEAD' || m === 'OPTIONS') return NextResponse.next();
  const origin = req.headers.get('origin');
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (origin) {
    let ok = false;
    try { ok = new URL(origin).host === host; } catch {}
    if (!ok) return NextResponse.json({ ok: false, error: 'Blocked: cross-site request.' }, { status: 403 });
  } else if (req.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ ok: false, error: 'Blocked: cross-site request.' }, { status: 403 });
  }
  return NextResponse.next();
}

export const config = { matcher: '/api/:path*' };
