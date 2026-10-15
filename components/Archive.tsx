'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Piece } from '@/content/data';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';

type ArchivePiece = Piece & { slug?: string; builtin?: boolean };

export default function Archive({ items }: { items: ArchivePiece[] }) {
  const { overrides } = useContent();
  const { authed } = useEditMode();
  const [q, setQ] = useState(''); const [cat, setCat] = useState('All');
  const [custom, setCustom] = useState<ArchivePiece[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [managing, setManaging] = useState(false);

  function refresh() {
    fetch('/api/entries')
      .then((r) => r.json())
      .then((d) => {
        const mapped: ArchivePiece[] = (d.writing || []).map((e: ArchivePiece) => ({
          title: e.title, date: e.date, category: e.category, type: e.type,
          tags: e.tags, mins: e.mins, status: e.status, slug: e.slug, builtin: false,
        }));
        setCustom(mapped);
        setDeleted(d.deleted || []);
      })
      .catch(() => {});
  }
  useEffect(refresh, []);

  const all = useMemo(() => {
    const merged = [...custom, ...items.map((i) => ({ ...i, builtin: true }))];
    return merged
      .filter((p) => !p.slug || !deleted.includes(`writing:${p.slug}`))
      // Show edited titles in the list, not just on the piece's own page.
      .map((p) => (p.slug ? { ...p, title: overrides[`writing:${p.slug}:title`] || p.title } : p));
  }, [custom, items, deleted, overrides]);

  const cats = useMemo(() => ['All', ...Array.from(new Set(all.map((i) => i.category)))], [all]);
  const shown = useMemo(
    () => all.filter((i) => (cat === 'All' || i.category === cat) && (i.title + ' ' + i.tags.join(' ')).toLowerCase().includes(q.toLowerCase())),
    [all, q, cat]
  );

  async function remove(p: ArchivePiece) {
    if (!p.slug) return;
    if (!confirm(`Delete "${p.title}"? This can be undone from the trash.`)) return;
    await fetch('/api/entries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'writing', slug: p.slug, builtin: Boolean(p.builtin) }),
    }).catch(() => {});
    refresh();
  }

  return (<div>
    <div className="archive-tools">
      <label className="kicker" htmlFor="s">Search the archive</label>
      <input id="s" type="search" className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title or tag" />
      {cats.length > 2 && (
        <div role="group" aria-label="Filter by category" className="chips">
          {cats.map((c) => <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      )}
      <div className="archive-tools__meta">
        <p className="mono" aria-live="polite">{shown.length} of {all.length} entries</p>
        {authed && <button className="btn btn--ghost btn--sm" onClick={() => setManaging((m) => !m)}>{managing ? 'Done' : 'Manage entries'}</button>}
      </div>
    </div>
    <ul className="rows rows--archive">
      {shown.map((p) => (
        <li key={p.slug || p.title} className="rows__item">
          {p.slug ? (
            <Link href={`/writing/${p.slug}`} className="row">
              <span className="mono">{p.date}</span>
              <span className="row__title">{p.title}</span>
              <span className="mono">{p.mins} min</span>
              <span className="arrow" aria-hidden>→</span>
            </Link>
          ) : (
            <div className="row row--static">
              <span className="mono">{p.date}</span>
              <span className="row__title">{p.title}</span>
              <span className="mono">{p.status}</span>
            </div>
          )}
          {managing && p.slug && <button className="btn btn--sm btn--danger" onClick={() => remove(p)}>Delete</button>}
        </li>
      ))}
      {shown.length === 0 && <li className="muted empty">No entries match. Clear the search or pick another category.</li>}
    </ul>
  </div>);
}
