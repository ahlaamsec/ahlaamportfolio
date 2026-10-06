'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditMode } from './EditModeProvider';

type Kind = 'writing' | 'lab';

export default function AddEntryButton() {
  const { authed } = useEditMode();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>('writing');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('Write-up pending');
  const [tools, setTools] = useState('');
  const [objective, setObjective] = useState('');
  const [findings, setFindings] = useState('');

  if (!authed) return null;

  function reset() {
    setTitle(''); setCategory(''); setType(''); setTags(''); setContent('');
    setPlatform(''); setStatus('Write-up pending'); setTools(''); setObjective(''); setFindings('');
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload =
      kind === 'writing'
        ? { kind, title, category, type, tags, content }
        : { kind, title, platform, status, tools, objective, findings };
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not save that entry.');
        setBusy(false);
        return;
      }
      setOpen(false);
      reset();
      setBusy(false);
      router.push(data.path);
    } catch {
      setError('Network error — try again.');
      setBusy(false);
    }
  }

  return (
    <>
      <button className="add-fab" onClick={() => setOpen(true)} aria-label="Add a new writeup">+</button>
      {open && (
        <div className="add-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="chips" role="group" aria-label="Entry type">
              <button type="button" aria-pressed={kind === 'writing'} onClick={() => setKind('writing')}>Writing</button>
              <button type="button" aria-pressed={kind === 'lab'} onClick={() => setKind('lab')}>Cyber Lab</button>
            </div>
            <form onSubmit={submit}>
              <label className="mono">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />

              {kind === 'writing' ? (
                <>
                  <label className="mono">Category (e.g. Cybersecurity, Fiction, Reflections)</label>
                  <input value={category} onChange={(e) => setCategory(e.target.value)} />
                  <label className="mono">Type (e.g. Essay, Tutorial, Short Story)</label>
                  <input value={type} onChange={(e) => setType(e.target.value)} />
                  <label className="mono">Tags (comma-separated)</label>
                  <input value={tags} onChange={(e) => setTags(e.target.value)} />
                  <label className="mono">Content (separate paragraphs with a blank line)</label>
                  <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} required />
                </>
              ) : (
                <>
                  <label className="mono">Platform (e.g. TryHackMe, EchoCTF, Independent)</label>
                  <input value={platform} onChange={(e) => setPlatform(e.target.value)} />
                  <label className="mono">Status</label>
                  <input value={status} onChange={(e) => setStatus(e.target.value)} />
                  <label className="mono">Tools (comma-separated)</label>
                  <input value={tools} onChange={(e) => setTools(e.target.value)} />
                  <label className="mono">Objective</label>
                  <textarea rows={2} value={objective} onChange={(e) => setObjective(e.target.value)} />
                  <label className="mono">Findings / write-up</label>
                  <textarea rows={8} value={findings} onChange={(e) => setFindings(e.target.value)} />
                </>
              )}

              {error && <p className="note edit-error">{error}</p>}
              <div className="hero-actions" style={{ marginTop: '.8rem' }}>
                <button className="btn" type="submit" disabled={busy}>{busy ? 'Publishing…' : 'Publish'}</button>
                <button className="btn ghost" type="button" onClick={() => { setOpen(false); reset(); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
