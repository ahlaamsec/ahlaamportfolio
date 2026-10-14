'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditMode } from './EditModeProvider';

type Kind = 'writing' | 'lab';
type Parsed = {
  filename: string; ok: boolean; error?: string;
  title?: string; content?: string[];
};
type Draft = Parsed & { kind: Kind; category: string; type: string; tags: string; published?: boolean; publishing?: boolean; publishError?: string };

export default function UploadPanel() {
  const { authed } = useEditMode();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!authed) return null;

  async function onFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    Array.from(fileList).forEach((f) => form.append('files', f));
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Upload failed.');
        setUploading(false);
        return;
      }
      const newDrafts: Draft[] = (data.results as Parsed[]).map((r) => ({
        ...r,
        kind: 'writing',
        category: '',
        type: '',
        tags: '',
      }));
      setDrafts((d) => [...d, ...newDrafts]);
    } catch {
      setError('Network error. Please try again.');
    }
    setUploading(false);
  }

  function updateDraft(i: number, patch: Partial<Draft>) {
    setDrafts((ds) => ds.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  }

  async function publish(i: number) {
    const d = drafts[i];
    if (!d.ok || !d.content) return;
    updateDraft(i, { publishing: true, publishError: undefined });
    const payload =
      d.kind === 'writing'
        ? { kind: 'writing', title: d.title, category: d.category, type: d.type, tags: d.tags, content: d.content }
        : { kind: 'lab', title: d.title, platform: d.category || 'Independent practice', status: 'Write-up pending', tools: d.tags, objective: d.content![0] || '', findings: d.content!.join('\n\n') };
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        updateDraft(i, { publishing: false, publishError: data.error || 'Could not publish.' });
        return;
      }
      updateDraft(i, { publishing: false, published: true });
    } catch {
      updateDraft(i, { publishing: false, publishError: 'Network error. Please try again.' });
    }
  }

  function removeDraft(i: number) {
    setDrafts((ds) => ds.filter((_, idx) => idx !== i));
  }

  const unpublished = drafts.filter((d) => d.ok && !d.published).length;

  return (
    <>
      <button className="upload-fab" onClick={() => setOpen(true)} aria-label="Upload writeups">Upload</button>
      {open && (
        <div className="add-modal-backdrop" onClick={() => drafts.length === 0 && setOpen(false)}>
          <div className="add-modal" style={{ maxWidth: '40rem' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Upload writeups</h2>
            <p className="note">
              .docx, .md or .txt. Pick a whole folder or a handful of files. Each one gets parsed with its
              images kept exactly where they sit in the document, then you confirm where each one goes before
              it publishes.
            </p>
            <div className="hero-actions" style={{ margin: '.8rem 0' }}>
              <button className="btn" type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
                {uploading ? 'Reading files…' : 'Choose files or a folder'}
              </button>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".docx,.md,.txt"
                // @ts-ignore - non-standard but widely supported folder-select attribute
                webkitdirectory=""
                style={{ display: 'none' }}
                onChange={(e) => onFiles(e.target.files)}
              />
            </div>
            {error && <p className="note edit-error">{error}</p>}

            {drafts.map((d, i) => (
              <div key={d.filename + i} className="upload-draft">
                <p className="mono" style={{ marginBottom: '.3rem' }}>{d.filename}</p>
                {!d.ok ? (
                  <p className="note edit-error">{d.error}</p>
                ) : d.published ? (
                  <p className="note" style={{ color: 'var(--green)' }}>Published ✓</p>
                ) : (
                  <>
                    <div className="chips" style={{ marginBottom: '.5rem' }}>
                      <button type="button" aria-pressed={d.kind === 'writing'} onClick={() => updateDraft(i, { kind: 'writing' })}>Writing</button>
                      <button type="button" aria-pressed={d.kind === 'lab'} onClick={() => updateDraft(i, { kind: 'lab' })}>Cyber Lab</button>
                    </div>
                    <label className="mono">Title</label>
                    <input value={d.title || ''} onChange={(e) => updateDraft(i, { title: e.target.value })} />
                    <label className="mono">{d.kind === 'writing' ? 'Category' : 'Platform'}</label>
                    <input value={d.category} onChange={(e) => updateDraft(i, { category: e.target.value })} placeholder={d.kind === 'writing' ? 'e.g. Cybersecurity' : 'e.g. TryHackMe'} />
                    {d.kind === 'writing' && (
                      <>
                        <label className="mono">Type</label>
                        <input value={d.type} onChange={(e) => updateDraft(i, { type: e.target.value })} placeholder="e.g. Essay, Case Study" />
                      </>
                    )}
                    <label className="mono">Tags (comma-separated)</label>
                    <input value={d.tags} onChange={(e) => updateDraft(i, { tags: e.target.value })} />
                    <p className="note" style={{ marginTop: '.4rem' }}>{d.content?.length} block(s) parsed, images included inline.</p>
                    {d.publishError && <p className="note edit-error">{d.publishError}</p>}
                    <div className="hero-actions" style={{ marginTop: '.6rem' }}>
                      <button className="btn" type="button" onClick={() => publish(i)} disabled={d.publishing}>
                        {d.publishing ? 'Publishing…' : 'Publish this one'}
                      </button>
                      <button className="btn ghost" type="button" onClick={() => removeDraft(i)}>Discard</button>
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="hero-actions" style={{ marginTop: '1rem' }}>
              <button
                className="btn ghost"
                type="button"
                onClick={() => { setDrafts([]); setOpen(false); if (unpublished === 0) router.refresh(); }}
              >
                {unpublished === 0 && drafts.length > 0 ? 'Done' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
