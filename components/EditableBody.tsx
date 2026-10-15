'use client';
import { useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import { saveOverrideResult } from '@/lib/saveOverride';
import ContentBlocks from './ContentBlocks';
import BlockEditor, { splitBlocks } from './BlockEditor';
import SaveIndicator, { type SaveStatus } from './SaveIndicator';

// A whole write-up body. Read mode renders it; edit mode shows the block editor
// (every paragraph, heading, bullet and picture can be changed, moved or deleted).
export default function EditableBody({ id, defaultValue }: { id: string; defaultValue: string }) {
  const { overrides, setLocalOverride } = useContent();
  const { editing } = useEditMode();
  const current = overrides[id] ?? defaultValue;
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const latest = useRef(current);
  const [status, setStatus] = useState<SaveStatus>({ state: 'idle' });

  function save(next: string) {
    latest.current = next;
    setLocalOverride(id, next);
    setStatus({ state: 'saving' });
    queue.current = queue.current.then(async () => {
      // Skip stale queued saves; only the newest version needs to reach the server.
      if (latest.current !== next) return;
      const result = await saveOverrideResult(id, next);
      if (latest.current !== next) return;
      setStatus(result.ok ? { state: 'saved' } : { state: 'error', error: result.error });
    });
  }

  if (editing) {
    return (
      <>
        <BlockEditor value={current} onChange={save} />
        <SaveIndicator status={status} onRetry={() => save(latest.current)} />
      </>
    );
  }
  return <ContentBlocks blocks={splitBlocks(current)} />;
}
