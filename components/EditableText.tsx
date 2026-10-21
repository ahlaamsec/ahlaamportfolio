'use client';
import { useEffect, useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import { saveOverrideResult } from '@/lib/saveOverride';
import SaveIndicator, { type SaveStatus } from './SaveIndicator';

type Tag = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div';

type Props = {
  id: string;
  value: string;
  as?: Tag;
  multiline?: boolean;
  className?: string;
  // Set when the text sits inside a link or button, so clicking the field doesn't navigate.
  inLink?: boolean;
};

export default function EditableText({ id, value, as = 'p', multiline = false, className, inLink = false }: Props) {
  const { overrides, setLocalOverride } = useContent();
  const { editing } = useEditMode();
  const current = overrides[id] ?? value;
  const [draft, setDraft] = useState(current);
  const [status, setStatus] = useState<SaveStatus>({ state: 'idle' });
  const dirty = useRef(false);
  // Saves run one after another so a newer edit is never dropped or overtaken.
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    if (!dirty.current) setDraft(current);
  }, [current]);

  function change(v: string) {
    dirty.current = true;
    setDraft(v);
    if (status.state !== 'idle') setStatus({ state: 'idle' });
  }

  function save() {
    if (!dirty.current) return;
    const v = draft;
    const previous = current;
    setLocalOverride(id, v);
    setStatus({ state: 'saving' });
    queue.current = queue.current.then(async () => {
      const result = await saveOverrideResult(id, v);
      if (result.ok) {
        dirty.current = false;
        setStatus({ state: 'saved' });
      } else {
        // Put the published text back, but keep the typed text in the field for a retry.
        setLocalOverride(id, previous);
        setStatus({ state: 'error', error: result.error });
      }
    });
  }

  if (editing) {
    return (
      <span
        className="editable"
        onClick={inLink ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
      >
        {multiline ? (
          <textarea
            className={`editable-field ${className || ''}`}
            value={draft}
            onChange={(e) => change(e.target.value)}
            onBlur={save}
            rows={Math.max(3, draft.split('\n').length)}
          />
        ) : (
          <input
            className={`editable-field ${className || ''}`}
            value={draft}
            onChange={(e) => change(e.target.value)}
            onBlur={save}
          />
        )}
        <SaveIndicator status={status} onRetry={save} />
      </span>
    );
  }

  const Tag = as;
  return <Tag className={className}>{current}</Tag>;
}
