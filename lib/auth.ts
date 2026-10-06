import crypto from 'crypto';

const SESSION_HOURS = 12;

function sign(expiry: number): string {
  const secret = process.env.EDIT_SECRET || '';
  return crypto.createHmac('sha256', secret).update(String(expiry)).digest('hex');
}

export function createSessionCookie(): string {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const sig = sign(expiry);
  return `${expiry}.${sig}`;
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split('.');
  if (parts.length !== 2) return false;
  const [expiryStr, sig] = parts;
  const expiry = Number(expiryStr);
  if (!expiry || Number.isNaN(expiry) || !sig || Date.now() > expiry) return false;
  const expected = sign(expiry);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function checkPassword(input: string): boolean {
  const real = process.env.EDIT_PASSWORD || '';
  if (!real) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(real);
  if (a.length !== b.length) {
    try { crypto.timingSafeEqual(Buffer.alloc(b.length), Buffer.alloc(b.length)); } catch {}
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}
