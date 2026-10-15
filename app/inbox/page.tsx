'use client';
import { useEffect, useState } from 'react';
import { useEditMode } from '@/components/EditModeProvider';
import PageHead from '@/components/PageHead';

type Msg = { id: string; name: string; email: string; message: string; at: string };

export default function Inbox() {
  const { authed } = useEditMode();
  const [msgs, setMsgs] = useState<Msg[] | null>(null);

  function load() {
    fetch('/api/contact').then((r) => r.json()).then((d) => setMsgs(d.messages || [])).catch(() => setMsgs([]));
  }
  useEffect(() => { if (authed) load(); }, [authed]);

  async function remove(id: string) {
    await fetch('/api/contact', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  }

  return (<>
    <PageHead kicker="Editor" title="Inbox" back={['Home', '/']} />
    <section className="band band--bold">
      <div className="wrap narrow">
        {!authed && <p className="muted">Log in with the Editor button to read your messages.</p>}
        {authed && msgs === null && <p className="muted">Loading…</p>}
        {authed && msgs && msgs.length === 0 && <p className="muted">No messages yet.</p>}
        {authed && msgs?.map((m) => (
          <article className="card message" key={m.id}>
            <div className="message__head">
              <p><strong>{m.name}</strong> · <a href={`mailto:${m.email}`}>{m.email}</a></p>
              <p className="mono">{new Date(m.at).toLocaleString()}</p>
            </div>
            <p className="message__body">{m.message}</p>
            <button className="btn btn--ghost btn--sm" onClick={() => remove(m.id)}>Delete</button>
          </article>
        ))}
      </div>
    </section>
  </>);
}
