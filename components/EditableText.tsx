'use client';
import { useEffect, useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';

type Tag = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div';

type Props = {
  id: string;
  value: string;
  as?: Tag;
  multiline?: boolean;
  className?: string;
};

export default function EditableText({ id, value, as = 'p', multiline = false, className }: Props) {
  const { overrides, setLocalOverride } = useContent();
  const { editing } = useEditMode();
  const current = overrides[id] ?? value;
  const [draft, setDraft] = useState(current);
  const savingRef = useRef(false);

  useEffect(() => {
    setDraft(current);
  }, [current]);

  async function save() {
    if (draft === current || savingRef.current) return;
    savingRef.current = true;
    setLocalOverride(id, draft);
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, value: draft }),
    }).catch(() => {});
    savingRef.current = false;
  }

  if (editing) {
    return multiline ? (
      <textarea
        className={`editable-field ${className || ''}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        rows={Math.max(3, draft.split('\n').length)}
      />
    ) : (
      <input
        className={`editable-field ${className || ''}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
      />
    );
  }

  const Tag = as;
  return <Tag className={className}>{current}</Tag>;
}
