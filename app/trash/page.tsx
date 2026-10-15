'use client';
import { useEffect, useState } from 'react';
import { useEditMode } from '@/components/EditModeProvider';
import PageHead from '@/components/PageHead';

export default function TrashPage() {
  const { authed } = useEditMode();
  const [deleted, setDeleted] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  function refresh() {
    fetch('/api/entries').then((r) => r.json()).then((d) => setDeleted(d.deleted || [])).catch(() => {});
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

  return (<>
    <PageHead
      kicker="Editor"
      title="Trash"
      back={['Home', '/']}
      lede="Built-in entries are hidden rather than erased when you delete them, so you can bring them back here. Entries you added yourself are removed for good."
    />
    <section className="band band--bold">
      <div className="wrap narrow">
        {!authed && <p className="muted">Log in with the Editor button to view and restore deleted entries.</p>}
        {authed && (
          <ul className="rows">
            {deleted.length === 0 && <li className="muted empty">Nothing in the trash.</li>}
            {deleted.map((id) => {
              const [kind, ...rest] = id.split(':');
              return (
                <li key={id} className="rows__item">
                  <div className="row row--static row--trash">
                    <span className="mono">{kind === 'writing' ? 'Writing' : 'Cyber Lab'}</span>
                    <span className="row__title">{rest.join(':')}</span>
                  </div>
                  <button className="btn btn--sm" onClick={() => restore(id)} disabled={busy === id}>
                    {busy === id ? 'Restoring…' : 'Restore'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  </>);
}
