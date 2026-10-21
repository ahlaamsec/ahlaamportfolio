import crypto from 'crypto';
import { pipeline } from './store';

// Private, cookie-free visitor counting kept in the same Redis as everything else.
// A visitor is a daily hash of IP + browser, so the same person counts once per
// day and nobody can be followed from one day to the next. Raw IPs are never stored.

const P = 'portfolio:a:';
const KEEP_SECONDS = 400 * 24 * 60 * 60;
const LIVE_WINDOW_MS = 5 * 60 * 1000;

export type Visit = {
  path: string;
  referrer: string;
  country: string;
  device: 'mobile' | 'tablet' | 'desktop';
  ip: string;
  ua: string;
};

export function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function visitorId(ip: string, ua: string, day: string): string {
  const salt = process.env.EDIT_SECRET || 'portfolio';
  return crypto.createHash('sha256').update(`${salt}|${day}|${ip}|${ua}`).digest('hex').slice(0, 16);
}

export function deviceOf(ua: string): Visit['device'] {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function isBot(ua: string): boolean {
  return !ua || /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|quora|pinterest|whatsapp|telegram|discord|headless|lighthouse|curl|wget|python|axios|node-fetch|go-http/i.test(ua);
}

export async function recordVisit(v: Visit): Promise<boolean> {
  const now = new Date();
  const day = dayKey(now);
  const id = visitorId(v.ip, v.ua, day);
  const cmds: (string | number)[][] = [
    ['INCR', `${P}pv:${day}`],
    ['PFADD', `${P}uv:${day}`, id],
    ['HINCRBY', `${P}path:${day}`, v.path, 1],
    ['HINCRBY', `${P}dev:${day}`, v.device, 1],
    ['INCR', `${P}pv:all`],
    ['PFADD', `${P}uv:all`, id],
    ['ZADD', `${P}live`, now.getTime(), id],
    ['ZREMRANGEBYSCORE', `${P}live`, 0, now.getTime() - LIVE_WINDOW_MS],
  ];
  if (v.referrer) cmds.push(['HINCRBY', `${P}ref:${day}`, v.referrer, 1]);
  if (v.country) cmds.push(['HINCRBY', `${P}cc:${day}`, v.country, 1]);
  for (const k of ['pv', 'uv', 'path', 'dev', 'ref', 'cc']) cmds.push(['EXPIRE', `${P}${k}:${day}`, KEEP_SECONDS]);
  return (await pipeline(cmds)) !== null;
}

export type Stats = {
  days: { date: string; views: number; visitors: number }[];
  totals: {
    live: number;
    todayViews: number; todayVisitors: number;
    rangeViews: number; rangeVisitors: number;
    weekVisitors: number;
    allViews: number; allVisitors: number;
  };
  pages: [string, number][];
  referrers: [string, number][];
  countries: [string, number][];
  devices: [string, number][];
};

function toPairs(flat: unknown): [string, number][] {
  if (!Array.isArray(flat)) return [];
  const out: [string, number][] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) out.push([String(flat[i]), Number(flat[i + 1]) || 0]);
  return out;
}

function sumInto(acc: Map<string, number>, pairs: [string, number][]) {
  for (const [k, n] of pairs) acc.set(k, (acc.get(k) || 0) + n);
}

const top = (m: Map<string, number>, n = 12) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

export async function getStats(range: number): Promise<Stats | null> {
  const now = Date.now();
  const dates: string[] = [];
  for (let i = range - 1; i >= 0; i--) dates.push(dayKey(new Date(now - i * 86400000)));
  const uvKeys = dates.map((d) => `${P}uv:${d}`);

  const cmds: (string | number)[][] = [
    ['ZREMRANGEBYSCORE', `${P}live`, 0, now - LIVE_WINDOW_MS],
    ['ZCARD', `${P}live`],
    ['GET', `${P}pv:all`],
    ['PFCOUNT', `${P}uv:all`],
    ['PFCOUNT', ...uvKeys],
    ['PFCOUNT', ...uvKeys.slice(-7)],
  ];
  const base = cmds.length;
  for (const d of dates) {
    cmds.push(['GET', `${P}pv:${d}`], ['PFCOUNT', `${P}uv:${d}`], ['HGETALL', `${P}path:${d}`],
      ['HGETALL', `${P}ref:${d}`], ['HGETALL', `${P}cc:${d}`], ['HGETALL', `${P}dev:${d}`]);
  }
  const r = await pipeline(cmds);
  if (!r) return null;

  const pages = new Map<string, number>(), refs = new Map<string, number>(),
    countries = new Map<string, number>(), devices = new Map<string, number>();
  const days = dates.map((date, i) => {
    const o = base + i * 6;
    sumInto(pages, toPairs(r[o + 2]));
    sumInto(refs, toPairs(r[o + 3]));
    sumInto(countries, toPairs(r[o + 4]));
    sumInto(devices, toPairs(r[o + 5]));
    return { date, views: Number(r[o]) || 0, visitors: Number(r[o + 1]) || 0 };
  });
  const today = days[days.length - 1];

  return {
    days,
    totals: {
      live: Number(r[1]) || 0,
      todayViews: today.views,
      todayVisitors: today.visitors,
      rangeViews: days.reduce((s, d) => s + d.views, 0),
      rangeVisitors: Number(r[4]) || 0,
      weekVisitors: Number(r[5]) || 0,
      allViews: Number(r[2]) || 0,
      allVisitors: Number(r[3]) || 0,
    },
    pages: top(pages, 15),
    referrers: top(refs),
    countries: top(countries),
    devices: top(devices, 3),
  };
}
