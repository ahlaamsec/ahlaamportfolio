import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createSessionCookie, isValidSession } from '@/lib/auth';

const COOKIE = 'edit_session';

// Best-effort login throttle: 5 wrong guesses per IP, then a 15 minute pause.
const attempts = new Map<string, { n: number; until: number }>();
const MAX_TRIES = 5;
const LOCK_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rec = attempts.get(ip);
  if (rec && rec.n >= MAX_TRIES && Date.now() < rec.until) {
    return NextResponse.json({ ok: false, error: 'Too many wrong tries. Please wait 15 minutes.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (!process.env.EDIT_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: 'EDIT_PASSWORD is not set in the deployment environment.' },
      { status: 500 }
    );
  }
  if ((process.env.EDIT_SECRET || '').length < 16) {
    return NextResponse.json(
      { ok: false, error: 'EDIT_SECRET is missing or shorter than 16 characters in the deployment environment.' },
      { status: 500 }
    );
  }
  if (typeof password !== 'string' || !checkPassword(password)) {
    const n = (rec && Date.now() < rec.until ? rec.n : 0) + 1;
    attempts.set(ip, { n, until: Date.now() + LOCK_MS });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: 'Wrong password.' }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, createSessionCookie(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE)?.value;
  return NextResponse.json({ authed: isValidSession(cookie) });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
