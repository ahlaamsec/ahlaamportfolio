import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import {
  getCustomWriting, addCustomWriting,
  getCustomLabs, addCustomLab,
  deleteCustomEntry, getDeletedIds, softDelete, restoreDeleted,
  isStoreConfigured,
} from '@/lib/store';
import { externalizeImages } from '@/lib/images';
import { slugify, uniqueSlug } from '@/lib/slug';
import { fullWriting, labs } from '@/content/data';

const COOKIE = 'edit_session';

export async function GET() {
  const [writing, customLabs, deleted] = await Promise.all([
    getCustomWriting(), getCustomLabs(), getDeletedIds(),
  ]);
  return NextResponse.json({ writing, labs: customLabs, deleted, configured: isStoreConfigured() });
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
    for (let i = 0; i < content.length; i++) content[i] = await externalizeImages(content[i]);
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
    findings: await externalizeImages(String(body.findings || '').trim()),
  };

  const saved = await addCustomLab(entry);
  return NextResponse.json({ ok: saved, slug, path: `/cyber-lab/${slug}` });
}

// DELETE /api/entries  body: { kind: 'writing'|'lab', slug: string, builtin: boolean }
// builtin=true means it comes from content/data.ts and can't be removed from
// source, so we soft-delete (hide) it instead of removing a record.
export async function DELETE(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE)?.value;
  if (!isValidSession(cookie)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const kind = body?.kind;
  const slug = body?.slug;
  const builtin = Boolean(body?.builtin);
  if ((kind !== 'writing' && kind !== 'lab') || typeof slug !== 'string' || !slug) {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  if (!isStoreConfigured()) {
    return NextResponse.json({ ok: false, error: 'Storage is not configured.' }, { status: 500 });
  }
  const ok = builtin
    ? await softDelete(`${kind}:${slug}`)
    : await deleteCustomEntry(kind, slug);
  return NextResponse.json({ ok });
}

// PATCH /api/entries  body: { action: 'restore', id: string }  — undoes a soft-delete
export async function PATCH(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE)?.value;
  if (!isValidSession(cookie)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (body?.action !== 'restore' || typeof body?.id !== 'string') {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  const ok = await restoreDeleted(body.id);
  return NextResponse.json({ ok });
}
