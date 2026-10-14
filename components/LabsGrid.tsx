'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lab } from '@/content/data';
import { useEditMode } from './EditModeProvider';

type GridLab = Pick<Lab, 'slug' | 'title' | 'platform' | 'status' | 'objective' | 'findings'> & { full?: unknown; builtin?: boolean };

export default function LabsGrid({ staticLabs }: { staticLabs: Lab[] }) {
  const [custom, setCustom] = useState<GridLab[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const { authed } = useEditMode();
  const [managing, setManaging] = useState(false);
  const router = useRouter();

  function refresh() {
    fetch('/api/entries')
      .then((r) => r.json())
      .then((d) => {
        setCustom((d.labs || []).map((l: any) => ({ ...l, builtin: false })));
        setDeleted(d.deleted || []);
      })
      .catch(() => {});
  }
  useEffect(refresh, []);

  const all: GridLab[] = [
    ...custom,
    ...staticLabs.map((l) => ({ ...l, builtin: true })),
  ].filter((l) => !deleted.includes(`lab:${l.slug}`));

  async function remove(l: GridLab, e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm(`Delete "${l.title}"? This can be undone from the trash.`)) return;
    await fetch('/api/entries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'lab', slug: l.slug, builtin: Boolean(l.builtin) }),
    }).catch(() => {});
    refresh();
  }

  return (
    <>
      {authed && (
        <div className="hero-actions" style={{ margin: '1rem 0 0' }}>
          <button className="btn ghost" onClick={() => setManaging((m) => !m)}>{managing ? 'Done' : 'Manage entries'}</button>
        </div>
      )}
      <div className="rows" style={{ marginTop: "1rem" }}>
        {all.map((l) => (
          <div key={l.slug} style={{ position: 'relative' }}>
            <Link className="tile" href={`/cyber-lab/${l.slug}`} style={'full' in l && l.full ? undefined : { opacity: 0.85 }}>
              <div className={'full' in l && l.full ? 'thumb alt' : 'thumb'} style={'full' in l && l.full ? undefined : { background: 'var(--surface-2)' }} />
              <p className="tag">{'full' in l && l.full ? l.platform : `${l.platform} · ${l.status}`}</p>
              <h3>{l.title}</h3>
              <p className="note">{'full' in l && l.full ? l.findings : l.objective}</p>
            </Link>
            {managing && <button className="btn ghost" style={{ position: 'absolute', top: '.6rem', right: '.6rem' }} onClick={(e) => remove(l, e)}>Delete</button>}
          </div>
        ))}
      </div>
    </>
  );
}
