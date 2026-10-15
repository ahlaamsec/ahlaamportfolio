export type SaveResult = { ok: true } | { ok: false; error: string };

async function post(body: unknown): Promise<SaveResult> {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true };
    if (res.status === 401) return { ok: false, error: 'Your login expired. Log in again.' };
    return { ok: false, error: data.error || `Save failed (${res.status}).` };
  } catch {
    return { ok: false, error: 'Network error.' };
  }
}

export async function saveOverrideResult(id: string, value: string): Promise<SaveResult> {
  return post({ id, value });
}

export async function saveOverride(id: string, value: string): Promise<boolean> {
  return (await post({ id, value })).ok;
}

export async function saveOverrides(values: Record<string, string>): Promise<boolean> {
  return (await post({ values })).ok;
}
