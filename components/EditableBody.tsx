'use client';
import { useRef } from 'react';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import ContentBlocks from './ContentBlocks';
import BlockEditor, { splitBlocks } from './BlockEditor';

// A whole write-up body. Read mode renders it; edit mode shows the block editor
// (every paragraph, heading, bullet and picture can be changed, moved or deleted).
export default function EditableBody({ id, defaultValue }: { id: string; defaultValue: string }) {
  const { overrides, setLocalOverride } = useContent();
  const { editing } = useEditMode();
  const current = overrides[id] ?? defaultValue;
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  function save(next: string) {
    setLocalOverride(id, next);
    queue.current = queue.current.then(() =>
      fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value: next }),
      }).catch(() => {})
    );
  }

  if (editing) return <BlockEditor value={current} onChange={save} />;
  return <ContentBlocks blocks={splitBlocks(current)} />;
}
