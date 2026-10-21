import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import { isStoreConfigured } from '@/lib/store';
import { recordVisit, deviceOf, isBot } from '@/lib/analytics';

const COOKIE = 'edit_session';
const SKIP = /^\/(admin|inbox|trash|api)(\/|$)/;

// Best-effort flood guard so one client cannot inflate the numbers.
const recent = new Map<string, { n: number; at: number }>();

export async function POST(req: NextRequest) {
  const done = new NextResponse(null, { status: 204 });
  if (!isStoreConfigured()) return done;
  // Your own visits while logged in are not counted.
  if (isValidSession(req.cookies.get(COOKIE)?.value)) return done;
  if (req.headers.get('dnt') === '1' || req.headers.get('sec-gpc') === '1') return done;

  const ua = req.headers.get('user-agent') || '';
  if (isBot(ua)) return done;

  const body = await req.json().catch(() => null);
  const rawPath = typeof body?.path === 'string' ? body.path : '';
  const path = rawPath.split(/[?#]/)[0].slice(0, 200);
  if (!path.startsWith('/') || SKIP.test(path)) return done;

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const r = recent.get(ip);
  if (r && now - r.at < 60_000) {
    if (r.n >= 30) return done;
    r.n++;
  } else {
    recent.set(ip, { n: 1, at: now });
    if (recent.size > 5000) recent.clear();
  }

  // Only the referring site's name is kept, never the full address.
  let referrer = '';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  try {
    const h = new URL(String(body?.referrer || '')).hostname.replace(/^www\./, '');
    if (h && h !== host.split(':')[0].replace(/^www\./, '')) referrer = h.slice(0, 100);
  } catch {}

  const country = (req.headers.get('x-vercel-ip-country') || '').toUpperCase().slice(0, 2);

  await recordVisit({ path, referrer, country: /^[A-Z]{2}$/.test(country) ? country : '', device: deviceOf(ua), ip, ua });
  return done;
}
