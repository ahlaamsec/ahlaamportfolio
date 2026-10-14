'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState('sending'); setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) { setError(out.error || 'Something went wrong.'); setState('idle'); return; }
      form.reset(); setState('sent');
    } catch {
      setError('Network error. Please try again.'); setState('idle');
    }
  }

  if (state === 'sent') return <p className="note">Thank you. Your message has been sent and I will reply by email.</p>;
  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="mono" htmlFor="cf-name">Your name</label>
      <input id="cf-name" name="name" required maxLength={120} />
      <label className="mono" htmlFor="cf-email">Your email</label>
      <input id="cf-email" name="email" type="email" required maxLength={200} />
      <label className="mono" htmlFor="cf-msg">Message</label>
      <textarea id="cf-msg" name="message" rows={5} required maxLength={4000} />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      {error && <p className="note edit-error">{error}</p>}
      <button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
