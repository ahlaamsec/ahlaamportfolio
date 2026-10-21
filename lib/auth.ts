import crypto from 'crypto';
import { getPasswordRecord } from './store';

const SESSION_HOURS = 12;

// A missing or short secret would let anyone forge a login cookie, so
// signing and checking both refuse to work without a proper one.
function getSecret(): string | null {
  const secret = process.env.EDIT_SECRET || '';
  return secret.length >= 16 ? secret : null;
}

function sign(expiry: number): string {
  const secret = getSecret() as string;
  return crypto.createHmac('sha256', secret).update(String(expiry)).digest('hex');
}

export function createSessionCookie(): string {
  if (!getSecret()) throw new Error('EDIT_SECRET must be set to at least 16 characters.');
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const sig = sign(expiry);
  return `${expiry}.${sig}`;
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue || !getSecret()) return false;
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

// ---- password set from the dashboard ----
// It is tied to the current EDIT_PASSWORD: changing EDIT_PASSWORD in Vercel
// makes the stored one stop counting, which is the way back in if it is forgotten.

export const MIN_PASSWORD_LENGTH = 10;

function envTag(): string {
  return crypto.createHmac('sha256', getSecret() || '').update(`pw|${process.env.EDIT_PASSWORD || ''}`).digest('hex').slice(0, 24);
}

function scrypt(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<{ salt: string; hash: string; envTag: string; at: string }> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt)).toString('hex');
  return { salt, hash, envTag: envTag(), at: new Date().toISOString() };
}

// Checks against the dashboard password when one is active, otherwise EDIT_PASSWORD.
export async function verifyPassword(input: string): Promise<boolean> {
  const rec = await getPasswordRecord();
  if (rec && rec.envTag === envTag() && rec.salt && rec.hash) {
    const got = await scrypt(input, rec.salt);
    const want = Buffer.from(rec.hash, 'hex');
    return got.length === want.length && crypto.timingSafeEqual(got, want);
  }
  return checkPassword(input);
}
