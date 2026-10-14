export async function saveOverride(id: string, value: string): Promise<boolean> {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, value }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveOverrides(values: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
