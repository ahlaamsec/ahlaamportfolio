'use client';
import { useRouter } from 'next/navigation';
import { useEditMode } from './EditModeProvider';

export default function DeleteButton({ kind, slug, title, builtin, redirectTo }: {
  kind: 'writing' | 'lab'; slug: string; title: string; builtin: boolean; redirectTo: string;
}) {
  const { authed } = useEditMode();
  const router = useRouter();
  if (!authed) return null;

  async function remove() {
    if (!confirm(`Delete "${title}"? You can restore it later from the trash.`)) return;
    await fetch('/api/entries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, slug, builtin }),
    }).catch(() => {});
    router.push(redirectTo);
  }

  return <button className="btn ghost" onClick={remove}>Delete this entry</button>;
}
