'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useEditMode } from '../EditModeProvider';
import { useContent } from '../ContentProvider';
import OverviewTab from './OverviewTab';
import ContentTab from './ContentTab';
import HomeTab from './HomeTab';
import ProfileTab from './ProfileTab';
import MessagesTab from './MessagesTab';
import EditsTab from './EditsTab';
import PasswordTab from './PasswordTab';
import SettingsForm from '../SettingsForm';

export type BuiltinEntry =
  | { kind: 'writing'; slug: string; title: string; category: string; type: string; date: string; tags: string[] }
  | { kind: 'lab'; slug: string; title: string; platform: string; status: string; objective: string; tools: string[] };

const TABS = [
  { key: 'overview', label: 'Visitors' },
  { key: 'content', label: 'Write-ups & labs' },
  { key: 'home', label: 'Home page' },
  { key: 'profile', label: 'Profile & CV' },
  { key: 'design', label: 'Design' },
  { key: 'messages', label: 'Messages' },
  { key: 'edits', label: 'All edits' },
  { key: 'password', label: 'Password' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export default function AdminDashboard({ builtins }: { builtins: BuiltinEntry[] }) {
  const { authed, ready, needsSetup, login, setup, logout, editing, setEditing } = useEditMode();
  const { configured } = useContent();
  const [tab, setTab] = useState<TabKey>('overview');
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(0);

  // The tab lives in the address (#content etc.) so reloads and the back button keep it.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (TABS.some((t) => t.key === h)) setTab(h as TabKey);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  // The floating editor buttons repeat what the dashboard already has, so hide them here.
  useEffect(() => {
    document.body.classList.add('is-admin');
    return () => document.body.classList.remove('is-admin');
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/contact').then((r) => r.json()).then((d) => setUnread((d.messages || []).length)).catch(() => {});
  }, [authed]);

  function go(k: TabKey) {
    setTab(k);
    history.replaceState(null, '', `#${k}`);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (needsSetup) {
      if (password.length < 10) { setError('Use at least 10 characters.'); return; }
      if (password !== again) { setError('The two passwords are different.'); return; }
    }
    setBusy(true);
    const err = needsSetup ? await setup(password) : await login(password);
    setBusy(false);
    if (err) setError(err); else { setPassword(''); setAgain(''); }
  }

  if (!authed) {
    return (
      <section className="band band--black admin admin--login">
        <div className="wrap narrow">
          <p className="kicker">Owner only</p>
          <h1 className="display display--page">Dashboard</h1>
          {ready && (
            <form className="admin-login" onSubmit={submit}>
              {needsSetup && (
                <>
                  <h2 className="subhead">Create your admin password</h2>
                  <p className="note">There is no password yet. The one you choose here is what you will use to log in from now on. Pick something only you know, at least 10 characters.</p>
                </>
              )}
              <label htmlFor="admin-pw" className="mono">{needsSetup ? 'New password' : 'Password'}</label>
              <input id="admin-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus autoComplete={needsSetup ? 'new-password' : 'current-password'} />
              {needsSetup && (
                <>
                  <label htmlFor="admin-pw2" className="mono">Type it again</label>
                  <input id="admin-pw2" type="password" value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" />
                </>
              )}
              <button className="btn" type="submit" disabled={busy}>
                {busy ? (needsSetup ? 'Creating…' : 'Checking…') : needsSetup ? 'Create password and log in' : 'Log in'}
              </button>
              {error && <p className="note edit-error">{error}</p>}
              {!needsSetup && (
                <p className="note">Forgot it? In Vercel, delete EDIT_PASSWORD (or give it a new value) under Settings, Environment Variables, then redeploy and come back here.</p>
              )}
            </form>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="band band--black admin">
      <div className="wrap">
        <header className="admin__head">
          <div>
            <p className="kicker">Owner only</p>
            <h1 className="display admin__title">Dashboard</h1>
          </div>
          <div className="actions actions--tight">
            <button className="btn btn--sm" onClick={() => setEditing(!editing)}>{editing ? 'Stop editing' : 'Edit pages in place'}</button>
            <Link className="btn btn--ghost btn--sm" href="/">View site</Link>
            <button className="btn btn--ghost btn--sm" onClick={logout}>Log out</button>
          </div>
        </header>

        {!configured && (
          <p className="admin-warn">
            Storage is not connected (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are missing), so nothing here can be saved and no visits are counted yet. See the README.
          </p>
        )}

        <nav className="admin-tabs" aria-label="Dashboard sections">
          {TABS.map((t) => (
            <button key={t.key} type="button" aria-current={tab === t.key ? 'page' : undefined} onClick={() => go(t.key)}>
              {t.label}{t.key === 'messages' && unread > 0 && <span className="admin-badge">{unread}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-panel">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'content' && <ContentTab builtins={builtins} />}
          {tab === 'home' && <HomeTab builtins={builtins} />}
          {tab === 'profile' && <ProfileTab />}
          {tab === 'design' && <SettingsForm />}
          {tab === 'messages' && <MessagesTab onCount={setUnread} />}
          {tab === 'edits' && <EditsTab />}
          {tab === 'password' && <PasswordTab />}
        </div>
      </div>
    </section>
  );
}
