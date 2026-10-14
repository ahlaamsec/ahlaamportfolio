'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useEditMode } from '@/components/EditModeProvider';

export default function TrashPage() {
  const { authed } = useEditMode();
  const [deleted, setDeleted] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  function refresh() {
    fetch('/api/entries').then(r => r.json()).then(d => setDeleted(d.deleted || [])).catch(() => {});
  }
  useEffect(refresh, []);

  async function restore(id: string) {
    setBusy(id);
    await fetch('/api/entries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore', id }),
    }).catch(() => {});
    setBusy(null);
    refresh();
  }

  if (!authed) {
    return <article><h1>Trash</h1><p className="note">Log in with the 🔒 button to view and restore deleted entries.</p></article>;
  }

  return (<article>
    <h1>Trash</h1>
    <p className="lede">Only built-in entries (the ones baked into the site's source) show up here — deleting one of those just hides it rather than erasing it, so you can always bring it back. Entries you added yourself through the + button are removed for good when deleted.</p>
    <ul className="list">
      {deleted.length === 0 && <li>Nothing in the trash.</li>}
      {deleted.map((id) => {
        const [kind, ...rest] = id.split(':');
        const slug = rest.join(':');
        const href = kind === 'writing' ? `/writing/${slug}` : `/cyber-lab/${slug}`;
        return (
          <li key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono">{id}</span>
            <span style={{ display: 'flex', gap: '.6rem' }}>
              <Link className="btn ghost" href={href}>View (hidden)</Link>
              <button className="btn" onClick={() => restore(id)} disabled={busy === id}>
                {busy === id ? 'Restoring…' : 'Restore'}
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  </article>);
}
