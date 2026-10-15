'use client';

export type SaveStatus = { state: 'idle' | 'saving' | 'saved' } | { state: 'error'; error: string };

export default function SaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  if (status.state === 'idle') return null;
  return (
    <span className={`save-status save-status--${status.state}`} role="status">
      {status.state === 'saving' && 'Saving…'}
      {status.state === 'saved' && 'Saved'}
      {status.state === 'error' && (
        <>
          Not saved: {status.error}{' '}
          <button type="button" onClick={onRetry}>Retry</button>
        </>
      )}
    </span>
  );
}
