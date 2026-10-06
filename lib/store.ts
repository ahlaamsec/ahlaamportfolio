const STORE_URL = process.env.UPSTASH_REDIS_REST_URL;
const STORE_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const OVERRIDES_KEY = 'portfolio:overrides';
const CUSTOM_WRITING_KEY = 'portfolio:custom-writing';
const CUSTOM_LABS_KEY = 'portfolio:custom-labs';

export function isStoreConfigured(): boolean {
  return Boolean(STORE_URL && STORE_TOKEN);
}

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  if (!STORE_URL || !STORE_TOKEN) return fallback;
  try {
    const res = await fetch(`${STORE_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${STORE_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    if (!data || !data.result) return fallback;
    return JSON.parse(data.result);
  } catch {
    return fallback;
  }
}

async function setJSON(key: string, value: unknown): Promise<boolean> {
  if (!STORE_URL || !STORE_TOKEN) return false;
  try {
    const res = await fetch(`${STORE_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${STORE_TOKEN}`, 'Content-Type': 'text/plain' },
      body: JSON.stringify(value),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ---- text overrides (existing edit-in-place feature) ----

export async function getOverrides(): Promise<Record<string, string>> {
  return getJSON<Record<string, string>>(OVERRIDES_KEY, {});
}

export async function setOverride(id: string, value: string): Promise<boolean> {
  const current = await getOverrides();
  current[id] = value;
  return setJSON(OVERRIDES_KEY, current);
}

// ---- custom (user-added) entries ----

export type CustomWritingEntry = {
  slug: string;
  title: string;
  category: string;
  type: string;
  tags: string[];
  mins: number;
  date: string;
  status: string;
  content: string[];
};

export type CustomLabEntry = {
  slug: string;
  title: string;
  platform: string;
  status: string;
  tools: string[];
  objective: string;
  findings: string;
};

export async function getCustomWriting(): Promise<CustomWritingEntry[]> {
  return getJSON<CustomWritingEntry[]>(CUSTOM_WRITING_KEY, []);
}

export async function addCustomWriting(entry: CustomWritingEntry): Promise<boolean> {
  const list = await getCustomWriting();
  list.unshift(entry);
  return setJSON(CUSTOM_WRITING_KEY, list);
}

export async function getCustomLabs(): Promise<CustomLabEntry[]> {
  return getJSON<CustomLabEntry[]>(CUSTOM_LABS_KEY, []);
}

export async function addCustomLab(entry: CustomLabEntry): Promise<boolean> {
  const list = await getCustomLabs();
  list.unshift(entry);
  return setJSON(CUSTOM_LABS_KEY, list);
}
