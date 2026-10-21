import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPassword, createSessionCookie, isValidSession, passwordMode,
  createFirstPassword, changePassword, forgetUnsetPassword, MIN_PASSWORD_LENGTH,
} from '@/lib/auth';
import { isStoreConfigured } from '@/lib/store';

const COOKIE = 'edit_session';

// Best-effort login throttle: 5 wrong guesses per IP, then a 15 minute pause.
const attempts = new Map<string, { n: number; until: number }>();
const MAX_TRIES = 5;
const LOCK_MS = 15 * 60 * 1000;

const ipOf = (req: NextRequest) => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

function locked(ip: string) {
  const rec = attempts.get(ip);
  return Boolean(rec && rec.n >= MAX_TRIES && Date.now() < rec.until);
}

async function failed(ip: string) {
  const rec = attempts.get(ip);
  const n = (rec && Date.now() < rec.until ? rec.n : 0) + 1;
  attempts.set(ip, { n, until: Date.now() + LOCK_MS });
  await new Promise((r) => setTimeout(r, 600));
}

function badNewPassword(p: unknown): string | null {
  if (typeof p !== 'string' || p.length < MIN_PASSWORD_LENGTH) return `The password needs at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (p.length > 200) return 'That password is too long.';
  return null;
}

function withSession(body: object) {
  const res = NextResponse.json(body);
  res.cookies.set(COOKIE, createSessionCookie(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

// POST /api/auth  { password }                -> log in
// POST /api/auth  { setup: true, password }   -> create the first password (only while none exists)
export async function POST(req: NextRequest) {
  const ip = ipOf(req);
  if (locked(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many wrong tries. Please wait 15 minutes.' }, { status: 429 });
  }
  if ((process.env.EDIT_SECRET || '').length < 16) {
    return NextResponse.json(
      { ok: false, error: 'EDIT_SECRET is missing or shorter than 16 characters in the deployment environment.' },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;
  const mode = await passwordMode();

  if (body?.setup) {
    if (!isStoreConfigured()) {
      return NextResponse.json({ ok: false, error: 'Storage is not configured, so a password cannot be saved.' }, { status: 500 });
    }
    if (mode !== 'none') {
      return NextResponse.json({ ok: false, error: 'A password already exists. Log in instead.' }, { status: 409 });
    }
    const problem = badNewPassword(password);
    if (problem) return NextResponse.json({ ok: false, error: problem }, { status: 400 });
    if (!(await createFirstPassword(password))) {
      return NextResponse.json({ ok: false, error: 'A password was just created. Log in instead.' }, { status: 409 });
    }
    return withSession({ ok: true });
  }

  if (mode === 'none') {
    return NextResponse.json({ ok: false, needsSetup: true, error: 'No password exists yet. Create one on /admin.' }, { status: 409 });
  }
  if (typeof password !== 'string' || !(await verifyPassword(password))) {
    await failed(ip);
    return NextResponse.json({ ok: false, error: 'Wrong password.' }, { status: 401 });
  }
  attempts.delete(ip);
  if (mode === 'env') await forgetUnsetPassword();
  return withSession({ ok: true });
}

export async function GET(req: NextRequest) {
  const authed = isValidSession(req.cookies.get(COOKIE)?.value);
  const needsSetup = !authed && isStoreConfigured() && (await passwordMode()) === 'none';
  return NextResponse.json({ authed, needsSetup });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}

// PATCH /api/auth  { current, next }  -> change the password from the dashboard
export async function PATCH(req: NextRequest) {
  if (!isValidSession(req.cookies.get(COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  if (!isStoreConfigured()) {
    return NextResponse.json({ ok: false, error: 'Storage is not configured, so a new password cannot be saved.' }, { status: 500 });
  }
  const ip = ipOf(req);
  if (locked(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many wrong tries. Please wait 15 minutes.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const current = body?.current;
  const next = body?.next;
  if (typeof current !== 'string' || !(await verifyPassword(current))) {
    await failed(ip);
    return NextResponse.json({ ok: false, error: 'Your current password is not right.' }, { status: 401 });
  }
  const problem = badNewPassword(next);
  if (problem) return NextResponse.json({ ok: false, error: problem }, { status: 400 });
  if (next === current) {
    return NextResponse.json({ ok: false, error: 'The new password is the same as the current one.' }, { status: 400 });
  }

  attempts.delete(ip);
  if (!(await changePassword(next))) return NextResponse.json({ ok: false, error: 'Could not save the new password.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
