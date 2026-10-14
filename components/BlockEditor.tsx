'use client';
import { useRef, useState } from 'react';
import { importDocument, uploadImageFile } from '@/lib/clientImage';

const IMG_RE = /^!\[([^\]]*)\]\((.+)\)$/;

type Kind = 'p' | 'h2' | 'h3' | 'li' | 'img';

function kindOf(b: string): Kind {
  if (IMG_RE.test(b)) return 'img';
  if (b.startsWith('## ')) return 'h2';
  if (b.startsWith('### ')) return 'h3';
  if (b.startsWith('- ')) return 'li';
  return 'p';
}
function bodyOf(b: string, k: Kind): string {
  if (k === 'h2') return b.slice(3);
  if (k === 'h3') return b.slice(4);
  if (k === 'li') return b.slice(2);
  return b;
}
function build(k: Exclude<Kind, 'img'>, text: string): string {
  const t = text.replace(/\n{2,}/g, '\n');
  return (k === 'h2' ? '## ' : k === 'h3' ? '### ' : k === 'li' ? '- ' : '') + t;
}

export function splitBlocks(value: string): string[] {
  return value.split('\n\n').filter((b) => b.trim().length > 0);
}

type Props = {
  value: string;                       // blocks joined with a blank line
  onChange: (next: string) => void;    // called on every structural edit and on text blur
};

export default function BlockEditor({ value, onChange }: Props) {
  const blocks = splitBlocks(value);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pickRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const pendingAt = useRef(0);

  function commit(next: string[]) {
    onChange(next.join('\n\n'));
  }
  function setAt(i: number, text: string) {
    const next = [...blocks];
    next[i] = text;
    // allow typing a blank line to split into two blocks
    commit(next.flatMap((b) => splitBlocks(b)));
  }
  function remove(i: number) {
    commit(blocks.filter((_, j) => j !== i));
  }
  function move(i: number, d: number) {
    const j = i + d;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  }
  function insert(i: number, text: string) {
    const next = [...blocks];
    next.splice(i, 0, text);
    commit(next);
  }

  function pickImage(at: number) {
    pendingAt.current = at;
    setError(null);
    pickRef.current?.click();
  }
  async function onImagePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setBusy('Uploading image…');
    try {
      const added: string[] = [];
      for (const f of files) {
        const url = await uploadImageFile(f);
        added.push(`![](${url})`);
      }
      const next = [...blocks];
      next.splice(pendingAt.current, 0, ...added);
      commit(next);
    } catch (err: any) {
      setError(err?.message || 'Image upload failed.');
    }
    setBusy(null);
  }

  function pickDoc() {
    setError(null);
    docRef.current?.click();
  }
  async function onDocPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy('Reading document…');
    try {
      const imported = await importDocument(f);
      commit([...blocks, ...imported]);
    } catch (err: any) {
      setError(err?.message || 'Could not read that document.');
    }
    setBusy(null);
  }

  const Add = ({ at }: { at: number }) => (
    <div className="be-add">
      <button type="button" onClick={() => insert(at, 'New paragraph')}>＋ Text</button>
      <button type="button" onClick={() => insert(at, '## New heading')}>＋ Heading</button>
      <button type="button" onClick={() => pickImage(at)}>＋ Image</button>
    </div>
  );

  return (
    <div className="block-editor">
      <input ref={pickRef} type="file" accept="image/*" multiple hidden onChange={onImagePicked} />
      <input ref={docRef} type="file" accept=".docx,.md,.txt" hidden onChange={onDocPicked} />
      <div className="be-toolbar">
        <button type="button" className="btn ghost" onClick={pickDoc}>Add a document at the end</button>
        {busy && <span className="note">{busy}</span>}
        {error && <span className="note edit-error">{error}</span>}
      </div>
      <Add at={0} />
      {blocks.map((b, i) => {
        const k = kindOf(b);
        return (
          <div key={i + ':' + b.slice(0, 20)}>
            <div className={`be-row be-${k}`}>
              <div className="be-body">
                {k === 'img' ? (() => {
                  const m = b.match(IMG_RE)!;
                  return (
                    <div className="be-img">
                      <img src={m[2]} alt={m[1]} />
                      <input
                        defaultValue={m[1]}
                        placeholder="Caption (optional)"
                        onBlur={(e) => { if (e.target.value !== m[1]) setAt(i, `![${e.target.value.replace(/[\]\n]/g, ' ')}](${m[2]})`); }}
                      />
                    </div>
                  );
                })() : (
                  <>
                    <select
                      value={k}
                      onChange={(e) => setAt(i, build(e.target.value as any, bodyOf(b, k)))}
                      aria-label="Block type"
                    >
                      <option value="p">Paragraph</option>
                      <option value="h2">Heading</option>
                      <option value="h3">Subheading</option>
                      <option value="li">Bullet</option>
                    </select>
                    <textarea
                      className="editable-field"
                      defaultValue={bodyOf(b, k)}
                      rows={Math.max(2, Math.ceil(bodyOf(b, k).length / 90))}
                      onBlur={(e) => { const nb = build(k as any, e.target.value); if (nb !== b) setAt(i, nb); }}
                    />
                  </>
                )}
              </div>
              <div className="be-ctl">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label="Move down">↓</button>
                <button type="button" className="be-del" onClick={() => remove(i)} aria-label="Delete this block">✕</button>
              </div>
            </div>
            <Add at={i + 1} />
          </div>
        );
      })}
    </div>
  );
}
