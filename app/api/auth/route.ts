import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createSessionCookie, isValidSession } from '@/lib/auth';

const COOKIE = 'edit_session';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (!process.env.EDIT_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: 'EDIT_PASSWORD is not set in the deployment environment.' },
      { status: 500 }
    );
  }
  if (typeof password !== 'string' || !checkPassword(password)) {
    return NextResponse.json({ ok: false, error: 'Wrong password.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, createSessionCookie(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
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
