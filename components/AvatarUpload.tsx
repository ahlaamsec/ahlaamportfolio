'use client';
import { useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import { uploadImageFile } from '@/lib/clientImage';

const ID = 'home:hero:photo';

export default function AvatarUpload() {
  const { overrides, setLocalOverride } = useContent();
  const { authed } = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photo = overrides[ID];

  async function persist(value: string) {
    setLocalOverride(ID, value);
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ID, value }),
    }).catch(() => {});
  }
  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true); setError(null);
    try { await persist(await uploadImageFile(f, 1000)); }
    catch (err: any) { setError(err?.message || 'Upload failed.'); }
    setBusy(false);
  }

  const inner = photo
    ? <img className="avatar-img" src={photo} alt="Ahlaam Abdallah" />
    : <span className="avatar-mono">AA</span>;

  if (!authed) return <div className="avatar-card">{inner}</div>;

  return (
    <div
      className="avatar-card avatar-clickable"
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      aria-label="Upload a profile photo"
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />
      {inner}
      <span className="avatar-hint">{busy ? 'Uploading…' : photo ? 'Click to change photo' : 'Click to upload your photo'}</span>
      {photo && !busy && (
        <button type="button" className="avatar-remove" onClick={(e) => { e.stopPropagation(); persist(''); }}>Remove</button>
      )}
      {error && <span className="avatar-error">{error}</span>}
    </div>
  );
}
