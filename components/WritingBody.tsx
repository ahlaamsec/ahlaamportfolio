'use client';
import { useEffect, useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';

export default function WritingBody({ slug, defaultContent }: { slug: string; defaultContent: string[] }) {
  const id = `writing:${slug}:content`;
  const { overrides, setLocalOverride } = useContent();
  const { editing } = useEditMode();
  const defaultJoined = defaultContent.join('\n\n');
  const current = overrides[id] ?? defaultJoined;
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
    return (
      <textarea
        className="editable-field editable-body"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        rows={20}
      />
    );
  }

  const paragraphs = current.split('\n\n').filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} style={{ marginBottom: '1rem' }}>
          {p}
        </p>
      ))}
    </>
  );
}
