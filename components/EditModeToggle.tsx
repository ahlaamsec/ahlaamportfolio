'use client';
import { useState } from 'react';
import { useEditMode } from './EditModeProvider';

export default function EditModeToggle() {
  const { authed, editing, login, logout, setEditing } = useEditMode();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await login(password);
    setBusy(false);
    if (err) {
      setError(err);
    } else {
      setPassword('');
      setOpen(false);
    }
  }

  return (
    <div className="edit-toggle">
      {!authed && (
        <>
          <button className="edit-fab" onClick={() => setOpen((o) => !o)} aria-label="Site editor login">
            🔒
          </button>
          {open && (
            <form className="edit-panel" onSubmit={submit}>
              <label htmlFor="edit-pw" className="mono">Edit password</label>
              <input
                id="edit-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button className="btn" type="submit" disabled={busy}>
                {busy ? 'Checking…' : 'Unlock'}
              </button>
              {error && <p className="note edit-error">{error}</p>}
            </form>
          )}
        </>
      )}
      {authed && (
        <div className="edit-panel edit-panel-active">
          <button className="btn" onClick={() => setEditing(!editing)}>
            {editing ? 'Stop editing' : 'Edit this site'}
          </button>
          <button className="btn ghost" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
