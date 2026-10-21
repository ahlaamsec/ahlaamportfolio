'use client';
import { useMemo, useState } from 'react';
import { useContent } from '../ContentProvider';
import { resetOverrides } from '@/lib/saveOverride';

const GROUPS: [string, string][] = [
  ['home:', 'Home page'],
  ['writing:', 'Writing'],
  ['lab:', 'Cyber Lab'],
  ['cv:', 'CV page'],
  ['page:', 'Page headers'],
  ['profile:', 'Profile'],
  ['theme:', 'Design'],
  ['nav:', 'Menu'],
  ['footer:', 'Footer'],
];

function groupOf(id: string) {
  return GROUPS.find(([p]) => id.startsWith(p))?.[1] || 'Other';
}

function preview(v: string) {
  const t = v.replace(/!\[[^\]]*\]\([^)]*\)/g, '[picture]').replace(/\s+/g, ' ').trim();
  return t.length > 140 ? `${t.slice(0, 140)}…` : t || '(empty)';
}

// Every change saved so far, each with its own undo.
export default function EditsTab() {
  const { overrides, removeLocalOverride } = useContent();
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => Object.entries(overrides)
    .filter(([id, v]) => `${id} ${v}`.toLowerCase().includes(q.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b)), [overrides, q]);

  async function reset(id: string) {
    if (!confirm('Undo this change and show the original again?')) return;
    setBusy(id); setError(null);
    const r = await resetOverrides([id]);
    if (r.ok) removeLocalOverride(id); else setError(r.error);
    setBusy(null);
  }

  return (
    <div>
      <p className="note">Everything you have changed from the original site. Undo puts the original back for that one item.</p>
      <input type="search" className="field" placeholder="Search your edits" value={q} onChange={(e) => setQ(e.target.value)} />
      {error && <p className="admin-warn">{error}</p>}
      <ul className="entry-list">
        {rows.map(([id, v]) => (
          <li key={id} className="entry">
            <div className="entry__main">
              <span className="mono entry__kind">{groupOf(id)}</span>
              <span className="mono">{id}</span>
              <span className="edit-preview">{preview(v)}</span>
            </div>
            <div className="entry__actions">
              <button className="btn btn--ghost btn--sm" disabled={busy === id} onClick={() => reset(id)}>Undo</button>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="muted empty">No edits yet.</li>}
      </ul>
    </div>
  );
}
