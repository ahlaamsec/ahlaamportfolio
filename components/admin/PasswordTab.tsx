'use client';
import { useState } from 'react';

const MIN = 10;

export default function PasswordTab() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const problem =
    next && next.length < MIN ? `At least ${MIN} characters.` :
    again && next !== again ? 'The two new passwords are different.' : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (problem || !current || !next || next !== again) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, next }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) {
        setMsg({ ok: true, text: 'Password changed. Use the new one next time you log in.' });
        setCurrent(''); setNext(''); setAgain('');
      } else {
        setMsg({ ok: false, text: d.error || `Could not change the password (${res.status}).` });
      }
    } catch {
      setMsg({ ok: false, text: 'Network error. Please try again.' });
    }
    setBusy(false);
  }

  const type = show ? 'text' : 'password';
  return (
    <div>
      <section className="admin-card">
        <h3>Change your password</h3>
        <form className="password-form" onSubmit={submit}>
          <label className="field-row">
            <span className="mono field-row__label">Current password</span>
            <input type={type} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
          </label>
          <label className="field-row">
            <span className="mono field-row__label">New password (at least {MIN} characters)</span>
            <input type={type} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
          </label>
          <label className="field-row">
            <span className="mono field-row__label">New password again</span>
            <input type={type} value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" required />
          </label>
          <label className="password-form__show">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show passwords
          </label>
          {problem && <p className="note edit-error">{problem}</p>}
          {msg && <p className={`note ${msg.ok ? 'ok-text' : 'edit-error'}`}>{msg.text}</p>}
          <button className="btn" type="submit" disabled={busy || Boolean(problem) || !current || !next || next !== again}>
            {busy ? 'Saving…' : 'Change password'}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <h3>If you forget it</h3>
        <p className="note">
          In Vercel, open this project, go to Settings, then Environment Variables, and give <code>EDIT_PASSWORD</code> a new value.
          Then redeploy (Deployments, the three dots on the latest one, Redeploy). The new value becomes your password and
          replaces any password set here.
        </p>
      </section>
    </div>
  );
}
