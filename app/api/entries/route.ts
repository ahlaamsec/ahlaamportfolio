import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import {
  getCustomWriting, addCustomWriting,
  getCustomLabs, addCustomLab,
  isStoreConfigured,
} from '@/lib/store';
import { slugify, uniqueSlug } from '@/lib/slug';
import { fullWriting, labs } from '@/content/data';

const COOKIE = 'edit_session';

export async function GET() {
  const [writing, customLabs] = await Promise.all([getCustomWriting(), getCustomLabs()]);
  return NextResponse.json({ writing, labs: customLabs, configured: isStoreConfigured() });
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE)?.value;
  if (!isValidSession(cookie)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  if (!isStoreConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Storage is not configured (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN missing).' },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || (body.kind !== 'writing' && body.kind !== 'lab')) {
    return NextResponse.json({ ok: false, error: 'Invalid entry kind.' }, { status: 400 });
  }

  const title = String(body.title || '').trim();
  if (!title) {
    return NextResponse.json({ ok: false, error: 'Title is required.' }, { status: 400 });
  }

  if (body.kind === 'writing') {
    const content: string[] = Array.isArray(body.content)
      ? body.content
      : String(body.content || '').split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
    if (content.length === 0) {
      return NextResponse.json({ ok: false, error: 'Content is required.' }, { status: 400 });
    }

    const existingCustom = await getCustomWriting();
    const taken = new Set<string>([
      ...fullWriting.map((p) => p.slug),
      ...existingCustom.map((p) => p.slug),
    ]);
    const slug = uniqueSlug(slugify(title), taken);

    const wordCount = content.join(' ').split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(wordCount / 200));

    const entry = {
      slug,
      title,
      category: String(body.category || 'Uncategorized').trim(),
      type: String(body.type || 'Note').trim(),
      tags: String(body.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      mins,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      status: 'Published',
      content,
    };

    const saved = await addCustomWriting(entry);
    return NextResponse.json({ ok: saved, slug, path: `/writing/${slug}` });
  }

  // kind === 'lab'
  const existingCustomLabs = await getCustomLabs();
  const taken = new Set<string>([
    ...labs.map((l) => l.slug),
    ...existingCustomLabs.map((l) => l.slug),
  ]);
  const slug = uniqueSlug(slugify(title), taken);

  const entry = {
    slug,
    title,
    platform: String(body.platform || 'Independent practice').trim(),
    status: String(body.status || 'Write-up pending').trim(),
    tools: String(body.tools || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    objective: String(body.objective || '').trim(),
    findings: String(body.findings || '').trim(),
  };

  const saved = await addCustomLab(entry);
  return NextResponse.json({ ok: saved, slug, path: `/cyber-lab/${slug}` });
}
