'use client';
import { useEffect, useState } from 'react';

type Msg = { id: string; name: string; email: string; message: string; at: string };

export default function MessagesTab({ onCount }: { onCount: (n: number) => void }) {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);

  function load() {
    fetch('/api/contact').then((r) => r.json()).then((d) => {
      const list = d.messages || [];
      setMsgs(list);
      onCount(list.length);
    }).catch(() => setMsgs([]));
  }
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    await fetch('/api/contact', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  }

  if (msgs === null) return <p className="muted">Loading…</p>;
  if (msgs.length === 0) return <p className="muted">No messages yet. They arrive here from the contact form on the home page.</p>;
  return (
    <div>
      {msgs.map((m) => (
        <article className="card message" key={m.id}>
          <div className="message__head">
            <p><strong>{m.name}</strong> · <a href={`mailto:${m.email}`}>{m.email}</a></p>
            <p className="mono">{new Date(m.at).toLocaleString()}</p>
          </div>
          <p className="message__body">{m.message}</p>
          <div className="actions actions--tight">
            <a className="btn btn--sm" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}>Reply by email</a>
            <button className="btn btn--ghost btn--sm" onClick={() => remove(m.id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
