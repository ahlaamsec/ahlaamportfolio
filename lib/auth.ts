import crypto from 'crypto';
import { getPasswordRecord, setPasswordRecord, claimPasswordRecord, deletePasswordRecord } from './store';

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

// ---- admin password ----
// The password is normally created on /admin and stored only as a salted scrypt
// hash. It is tied to the current EDIT_PASSWORD value (which may be empty):
// adding, changing or removing EDIT_PASSWORD in Vercel makes the stored one stop
// counting, which is the way back in if it is forgotten.

export const MIN_PASSWORD_LENGTH = 10;

function envTag(envPassword = process.env.EDIT_PASSWORD || ''): string {
  return crypto.createHmac('sha256', getSecret() || '').update(`pw|${envPassword}`).digest('hex').slice(0, 24);
}

function scrypt(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

async function hashPassword(password: string): Promise<{ salt: string; hash: string; envTag: string; at: string }> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt)).toString('hex');
  return { salt, hash, envTag: envTag(), at: new Date().toISOString() };
}

async function activeRecord() {
  const rec = await getPasswordRecord(envTag());
  return rec && rec.salt && rec.hash ? rec : null;
}

// 'stored': a password made on /admin is in use. 'env': EDIT_PASSWORD is in use.
// 'none': no password exists yet, so /admin offers to create one.
export async function passwordMode(): Promise<'stored' | 'env' | 'none'> {
  if (await activeRecord()) return 'stored';
  return process.env.EDIT_PASSWORD ? 'env' : 'none';
}

export async function verifyPassword(input: string): Promise<boolean> {
  const rec = await activeRecord();
  if (rec) {
    const got = await scrypt(input, rec.salt);
    const want = Buffer.from(rec.hash, 'hex');
    return got.length === want.length && crypto.timingSafeEqual(got, want);
  }
  return checkPassword(input);
}

// Creates the very first password. Fails if one already exists.
export async function createFirstPassword(password: string): Promise<boolean> {
  if (await passwordMode() !== 'none') return false;
  return claimPasswordRecord(envTag(), await hashPassword(password));
}

export async function changePassword(password: string): Promise<boolean> {
  return setPasswordRecord(envTag(), await hashPassword(password));
}

// After a reset through EDIT_PASSWORD, forget the password that was made on
// /admin without it, so removing EDIT_PASSWORD later reopens "create a password"
// instead of bringing a forgotten one back.
export async function forgetUnsetPassword(): Promise<void> {
  if (process.env.EDIT_PASSWORD) await deletePasswordRecord(envTag(''));
}
