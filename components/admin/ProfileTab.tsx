'use client';
import { useRef, useState } from 'react';
import { useContent } from '../ContentProvider';
import { saveOverrideResult, resetOverrides } from '@/lib/saveOverride';
import { uploadImageFile } from '@/lib/clientImage';
import { PROFILE_FIELDS, profileFrom } from '@/lib/profile';
import Field from './Field';

const PHOTO = 'home:hero:photo';

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Could not read the file.'));
    r.readAsDataURL(file);
  });
}

export default function ProfileTab() {
  const { overrides, setLocalOverride, removeLocalOverride } = useContent();
  const photoInput = useRef<HTMLInputElement>(null);
  const cvInput = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<'photo' | 'cv' | null>(null);
  const profile = profileFrom(overrides);

  async function store(id: string, value: string) {
    if (value) setLocalOverride(id, value); else removeLocalOverride(id);
    const r = value ? await saveOverrideResult(id, value) : await resetOverrides([id]);
    setMsg(r.ok ? 'Saved' : r.error);
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy('photo'); setMsg(null);
    try { await store(PHOTO, await uploadImageFile(f, 1000)); }
    catch (err: any) { setMsg(err?.message || 'Upload failed.'); }
    setBusy(null);
  }

  async function onCv(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) { setMsg('Please pick a PDF file.'); return; }
    setBusy('cv'); setMsg(null);
    try {
      const dataUrl = (await readAsDataUrl(f)).replace(/^data:[^;]*;/, 'data:application/pdf;');
      const res = await fetch('/api/file', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'cv', dataUrl }) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) throw new Error(d.error || `Upload failed (${res.status}).`);
      await store('profile:cv', d.url);
    } catch (err: any) { setMsg(err?.message || 'Upload failed.'); }
    setBusy(null);
  }

  return (
    <div className="profile-tab">
      {msg && <p className="note">{msg}</p>}

      <section className="admin-card admin-card--row">
        <div className="profile-photo">
          {overrides[PHOTO] ? <img src={overrides[PHOTO]} alt="Your current profile photo" /> : <span className="avatar-mono">AA</span>}
        </div>
        <div>
          <h3>Profile photo</h3>
          <p className="note">Shown in the About section. Large photos are shrunk before upload.</p>
          <input ref={photoInput} type="file" accept="image/*" hidden onChange={onPhoto} />
          <div className="actions actions--tight">
            <button className="btn btn--sm" disabled={busy === 'photo'} onClick={() => photoInput.current?.click()}>{busy === 'photo' ? 'Uploading…' : overrides[PHOTO] ? 'Change photo' : 'Upload photo'}</button>
            {overrides[PHOTO] && <button className="btn btn--ghost btn--sm" onClick={() => store(PHOTO, '')}>Remove</button>}
          </div>
        </div>
      </section>

      <section className="admin-card">
        <h3>CV file</h3>
        <p className="note">The PDF behind every "Download CV" button. Up to 3 MB.</p>
        <input ref={cvInput} type="file" accept="application/pdf,.pdf" hidden onChange={onCv} />
        <div className="actions actions--tight">
          <button className="btn btn--sm" disabled={busy === 'cv'} onClick={() => cvInput.current?.click()}>{busy === 'cv' ? 'Uploading…' : 'Upload a new CV'}</button>
          <a className="btn btn--ghost btn--sm" href={profile.cv} target="_blank" rel="noreferrer">Open current CV</a>
          {overrides['profile:cv'] && <button className="btn btn--ghost btn--sm" onClick={() => store('profile:cv', '')}>Go back to the original</button>}
        </div>
      </section>

      <section className="admin-card">
        <h3>Name, contact and links</h3>
        <p className="note">Used in the home page, CV page and footer. Empty boxes keep the original (shown in grey). The name in the top bar is under Design.</p>
        <div className="form-grid">
          {PROFILE_FIELDS.filter((f) => f.key !== 'cv').map((f) => (
            <Field
              key={f.key} id={`profile:${f.key}`} label={f.label} placeholder={f.fallback}
              hint={f.key === 'github' || f.key === 'linkedin' ? 'Must start with https:// or the original is used.' : undefined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
