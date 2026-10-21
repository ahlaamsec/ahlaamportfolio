'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lab } from '@/content/data';
import { useEditMode } from './EditModeProvider';
import { useContent } from './ContentProvider';
import { withLabMeta } from '@/lib/profile';

type GridLab = Pick<Lab, 'slug' | 'title' | 'platform' | 'status' | 'objective' | 'findings'> & { tools?: string[]; full?: unknown; builtin?: boolean };

export default function LabsGrid({ staticLabs }: { staticLabs: Lab[] }) {
  const [custom, setCustom] = useState<GridLab[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const { authed } = useEditMode();
  const { overrides } = useContent();
  const [managing, setManaging] = useState(false);

  function refresh() {
    fetch('/api/entries')
      .then((r) => r.json())
      .then((d) => {
        setCustom((d.labs || []).map((l: GridLab) => ({ ...l, builtin: false })));
        setDeleted(d.deleted || []);
      })
      .catch(() => {});
  }
  useEffect(refresh, []);

  const all: GridLab[] = [
    ...custom,
    ...staticLabs.map((l) => ({ ...l, builtin: true })),
  ].filter((l) => !deleted.includes(`lab:${l.slug}`)).map((l) => withLabMeta({ ...l, tools: l.tools || [] }, overrides));

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
        <div className="actions" style={{ margin: '0 0 1.5rem' }}>
          <button className="btn btn--ghost btn--sm" onClick={() => setManaging((m) => !m)}>{managing ? 'Done' : 'Manage entries'}</button>
        </div>
      )}
      <div className="card-grid card-grid--2">
        {all.map((l, i) => {
          const full = Boolean(l.full);
          return (
            <div key={l.slug} className="lab-card-wrap" data-reveal style={{ '--d': i % 2 } as React.CSSProperties}>
              <Link className={`lab-card${full ? ' lab-card--full' : ''}`} href={`/cyber-lab/${l.slug}`}>
                <div className="lab-card__top">
                  <span className="mono">{l.platform}</span>
                  <span className={`status${full ? ' status--done' : ''}`}>{l.status}</span>
                </div>
                <h3>{l.title}</h3>
                <p className="muted">{full ? l.findings : l.objective}</p>
                {l.tools && l.tools.length > 0 && <ul className="tags">{l.tools.map((t) => <li key={t}>{t}</li>)}</ul>}
                <span className="arrow" aria-hidden>→</span>
              </Link>
              {managing && <button className="btn btn--sm btn--danger lab-card__delete" onClick={(e) => remove(l, e)}>Delete</button>}
            </div>
          );
        })}
      </div>
    </>
  );
}
