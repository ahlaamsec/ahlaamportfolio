'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useEditMode } from '@/components/EditModeProvider';

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

  if (!authed) return <article><h1>Inbox</h1><p className="note">Log in with the lock button to read your messages.</p></article>;
  return (
    <article>
      <p><Link href="/">&larr; Home</Link></p>
      <h1>Inbox</h1>
      {msgs === null && <p className="note">Loading…</p>}
      {msgs && msgs.length === 0 && <p className="note">No messages yet.</p>}
      {msgs?.map((m) => (
        <div className="card" key={m.id} style={{ marginTop: '1rem' }}>
          <p><strong>{m.name}</strong> · <a href={`mailto:${m.email}`}>{m.email}</a></p>
          <p className="note">{new Date(m.at).toLocaleString()}</p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>
          <button className="btn ghost" onClick={() => remove(m.id)}>Delete</button>
        </div>
      ))}
    </article>
  );
}
