'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Piece } from '@/content/data';
type ArchivePiece = Piece & { slug?: string; builtin?: boolean };
export default function Archive({ items }: { items: ArchivePiece[] }) {
  const [q, setQ] = useState(''); const [cat, setCat] = useState('All');
  const [custom, setCustom] = useState<ArchivePiece[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);

  function refresh() {
    fetch('/api/entries')
      .then((r) => r.json())
      .then((d) => {
        const mapped: ArchivePiece[] = (d.writing || []).map((e: any) => ({
          title: e.title, date: e.date, category: e.category, type: e.type,
          tags: e.tags, mins: e.mins, status: e.status, slug: e.slug, builtin: false,
        }));
        setCustom(mapped);
        setDeleted(d.deleted || []);
      })
      .catch(() => {});
  }
  useEffect(refresh, []);

  // mark static items as builtin + give them a slug by re-deriving from content id scheme if present
  const staticItems = useMemo(
    () => items.map((i) => ({ ...i, builtin: true, slug: (i as any).slug })),
    [items]
  );

  const all = useMemo(() => {
    const merged = [...custom, ...staticItems];
    return merged.filter((p) => !p.slug || !deleted.includes(`writing:${p.slug}`));
  }, [custom, staticItems, deleted]);

  const cats = ['All', ...Array.from(new Set(all.map((i) => i.category)))];
  const shown = useMemo(
    () => all.filter((i) => (cat === 'All' || i.category === cat) && (i.title + i.tags.join(' ')).toLowerCase().includes(q.toLowerCase())),
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
    <div className="hero-actions" style={{ marginBottom: '.6rem' }}>
      <button className="btn ghost" onClick={() => setEditing((e) => !e)}>{editing ? 'Done' : 'Manage entries'}</button>
    </div>
    <label className="mono" htmlFor="s">Search the archive</label>
    <input id="s" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="title or tag" />
    <div role="group" aria-label="Filter by category" className="chips">
      {cats.map(c => <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
    </div>
    <p className="mono" aria-live="polite" style={{ margin: '.8rem 0' }}>{shown.length} of {all.length} entries</p>
    <ul className="list">{shown.map(p => (
      <li key={p.slug || p.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h3>{p.slug ? <Link href={`/writing/${p.slug}`}>{p.title}</Link> : p.title}</h3>
          <p className="mono">{p.date} · {p.type} · {p.category} · {p.mins} min · {p.status}</p>
        </div>
        {editing && p.slug && <button className="btn ghost" onClick={() => remove(p)}>Delete</button>}
      </li>
    ))}
      {shown.length === 0 && <li>No entries match. Clear the search or pick another category.</li>}</ul>
  </div>);
}
