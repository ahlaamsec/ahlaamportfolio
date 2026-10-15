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
// Each field is its own hash entry, so saves to different fields (the block
// editor, colour pickers) never overwrite each other. Values saved before this
// change live in the old single-JSON key and are merged in underneath.

const OVERRIDES_HASH_KEY = 'portfolio:overrides:h';

async function command(args: string[]): Promise<{ ok: boolean; result: unknown }> {
  if (!STORE_URL || !STORE_TOKEN) return { ok: false, result: null };
  try {
    const res = await fetch(STORE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${STORE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      cache: 'no-store',
    });
    if (!res.ok) return { ok: false, result: null };
    const data = await res.json();
    return { ok: !data?.error, result: data?.result ?? null };
  } catch {
    return { ok: false, result: null };
  }
}

export async function getOverrides(): Promise<Record<string, string>> {
  const [legacy, flat] = await Promise.all([
    getJSON<Record<string, string>>(OVERRIDES_KEY, {}),
    command(['HGETALL', OVERRIDES_HASH_KEY]).then((r) => r.result),
  ]);
  const out: Record<string, string> = { ...legacy };
  if (Array.isArray(flat)) for (let i = 0; i + 1 < flat.length; i += 2) out[String(flat[i])] = String(flat[i + 1]);
  return out;
}

export async function setOverride(id: string, value: string): Promise<boolean> {
  return (await command(['HSET', OVERRIDES_HASH_KEY, id, value])).ok;
}

export async function setOverrides(values: Record<string, string>): Promise<boolean> {
  const pairs = Object.entries(values).flat();
  if (pairs.length === 0) return true;
  return (await command(['HSET', OVERRIDES_HASH_KEY, ...pairs])).ok;
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

export async function deleteCustomEntry(kind: 'writing' | 'lab', slug: string): Promise<boolean> {
  if (kind === 'writing') {
    const list = await getCustomWriting();
    return setJSON(CUSTOM_WRITING_KEY, list.filter((e) => e.slug !== slug));
  }
  const list = await getCustomLabs();
  return setJSON(CUSTOM_LABS_KEY, list.filter((e) => e.slug !== slug));
}

// ---- soft-delete for built-in (data.ts) entries ----
// Built-in entries can't be removed from source at runtime, so we keep a
// "hidden" id list instead. Anything in here is treated as deleted everywhere.

const DELETED_KEY = 'portfolio:deleted';

export async function getDeletedIds(): Promise<string[]> {
  return getJSON<string[]>(DELETED_KEY, []);
}

export async function softDelete(id: string): Promise<boolean> {
  const list = await getDeletedIds();
  if (!list.includes(id)) list.push(id);
  return setJSON(DELETED_KEY, list);
}

export async function restoreDeleted(id: string): Promise<boolean> {
  const list = await getDeletedIds();
  return setJSON(DELETED_KEY, list.filter((x) => x !== id));
}

// ---- uploaded images ----
// Images are stored once under their own key and referenced from text as
// /api/image/<id>, so write-ups stay small and fast to load.

const IMG_PREFIX = 'portfolio:img:';

export async function saveImageData(id: string, dataUrl: string): Promise<boolean> {
  return setJSON(IMG_PREFIX + id, dataUrl);
}

export async function getImageData(id: string): Promise<string | null> {
  return getJSON<string | null>(IMG_PREFIX + id, null);
}

// ---- contact messages ----

const MESSAGES_KEY = 'portfolio:messages';
export type ContactMessage = { id: string; name: string; email: string; message: string; at: string };

export async function getMessages(): Promise<ContactMessage[]> {
  return getJSON<ContactMessage[]>(MESSAGES_KEY, []);
}
export async function addMessage(m: ContactMessage): Promise<boolean> {
  const list = await getMessages();
  list.unshift(m);
  return setJSON(MESSAGES_KEY, list.slice(0, 300));
}
export async function deleteMessage(id: string): Promise<boolean> {
  const list = await getMessages();
  return setJSON(MESSAGES_KEY, list.filter((m) => m.id !== id));
}
