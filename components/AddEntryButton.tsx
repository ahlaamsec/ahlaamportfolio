'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditMode } from './EditModeProvider';
import BlockEditor, { splitBlocks } from './BlockEditor';

type Kind = 'writing' | 'lab' | 'report';

// The standard report layout from the content bible.
const REPORT_SECTIONS = [
  'Objective', 'Environment', 'Reconnaissance', 'Methodology', 'Findings',
  'Evidence', 'Technical notes', 'What I learned', 'Full write-up',
];

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
  const [sections, setSections] = useState<Record<string, string>>({});

  // The dashboard opens this form with a window event, optionally on a given tab.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const k = (e as CustomEvent).detail;
      if (k === 'writing' || k === 'lab' || k === 'report') setKind(k);
      setOpen(true);
    };
    window.addEventListener('open-add-entry', onOpen);
    return () => window.removeEventListener('open-add-entry', onOpen);
  }, []);

  if (!authed) return null;

  function reset() {
    setTitle(''); setCategory(''); setType(''); setTags(''); setContent('');
    setPlatform(''); setStatus('Write-up pending'); setTools(''); setObjective(''); setFindings(''); setSections({});
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    let payload: any;
    if (kind === 'writing') payload = { kind, title, category, type, tags, content };
    else if (kind === 'lab') payload = { kind, title, platform, status, tools, objective, findings };
    else {
      const parts: string[] = [];
      let obj = '';
      for (const name of REPORT_SECTIONS) {
        const blocks = splitBlocks(sections[name] || '');
        if (!blocks.length) continue;
        if (name === 'Objective') obj = blocks.find((b) => !b.startsWith('![') && !b.startsWith('#')) || '';
        parts.push(`## ${name}`, ...blocks);
      }
      payload = { kind: 'lab', title, platform, status, tools, objective: obj, findings: parts.join('\n\n') };
    }
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
      setError('Network error. Please try again.');
      setBusy(false);
    }
  }

  return (
    <>
      <button className="add-fab" onClick={() => setOpen(true)} aria-label="Add a new writeup">Add</button>
      {open && (
        <div className="add-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="chips" role="group" aria-label="Entry type">
              <button type="button" aria-pressed={kind === 'writing'} onClick={() => setKind('writing')}>Writing</button>
              <button type="button" aria-pressed={kind === 'lab'} onClick={() => setKind('lab')}>Cyber Lab (quick)</button>
              <button type="button" aria-pressed={kind === 'report'} onClick={() => setKind('report')}>Report (standard format)</button>
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
              ) : kind === 'report' ? (
                <>
                  <label className="mono">Platform (e.g. TryHackMe, EchoCTF, Independent)</label>
                  <input value={platform} onChange={(e) => setPlatform(e.target.value)} />
                  <label className="mono">Status and difficulty</label>
                  <input value={status} onChange={(e) => setStatus(e.target.value)} />
                  <label className="mono">Tools (comma-separated)</label>
                  <input value={tools} onChange={(e) => setTools(e.target.value)} />
                  <p className="note" style={{ margin: '.8rem 0 .2rem' }}>
                    Fill in only the sections you need. In each one, add text, headings and screenshots in the order you want them to appear. You can also add a Word document to any section. Empty sections are left out.
                  </p>
                  {REPORT_SECTIONS.map((name) => (
                    <details key={name} className="report-section" open={name === 'Objective'}>
                      <summary>{name}{sections[name] ? ' ✓' : ''}</summary>
                      <BlockEditor
                        value={sections[name] || ''}
                        onChange={(v) => setSections((prev) => ({ ...prev, [name]: v }))}
                      />
                    </details>
                  ))}
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
