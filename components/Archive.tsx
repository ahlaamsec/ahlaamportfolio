'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Piece } from '@/content/data';
type ArchivePiece = Piece & { slug?: string };
export default function Archive({ items }: { items: ArchivePiece[] }) {
  const [q, setQ] = useState(''); const [cat, setCat] = useState('All');
  const [custom, setCustom] = useState<ArchivePiece[]>([]);

  useEffect(() => {
    fetch('/api/entries')
      .then((r) => r.json())
      .then((d) => {
        const mapped: ArchivePiece[] = (d.writing || []).map((e: any) => ({
          title: e.title, date: e.date, category: e.category, type: e.type,
          tags: e.tags, mins: e.mins, status: e.status, slug: e.slug,
        }));
        setCustom(mapped);
      })
      .catch(() => {});
  }, []);

  const all = useMemo(() => [...custom, ...items], [custom, items]);
  const cats = ['All', ...Array.from(new Set(all.map((i) => i.category)))];
  const shown = useMemo(
    () => all.filter((i) => (cat === 'All' || i.category === cat) && (i.title + i.tags.join(' ')).toLowerCase().includes(q.toLowerCase())),
    [all, q, cat]
  );

  return (<div>
    <label className="mono" htmlFor="s">Search the archive</label>
    <input id="s" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="title or tag" />
    <div role="group" aria-label="Filter by category" className="chips">
      {cats.map(c => <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
    </div>
    <p className="mono" aria-live="polite" style={{ margin: '.8rem 0' }}>{shown.length} of {all.length} entries</p>
    <ul className="list">{shown.map(p => (
      <li key={p.slug || p.title}>
        <h3>{p.slug ? <Link href={`/writing/${p.slug}`}>{p.title}</Link> : p.title}</h3>
        <p className="mono">{p.date} · {p.type} · {p.category} · {p.mins} min · {p.status}</p>
      </li>
    ))}
      {shown.length === 0 && <li>No entries match. Clear the search or pick another category.</li>}</ul>
  </div>);
}
