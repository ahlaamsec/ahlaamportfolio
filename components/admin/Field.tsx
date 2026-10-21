'use client';
import { useEffect, useRef, useState } from 'react';
import { useContent } from '../ContentProvider';
import { saveOverrideResult, resetOverrides } from '@/lib/saveOverride';

// A dashboard input bound to one editable field. Saves a moment after typing stops.
export default function Field({ id, label, fallback = '', multiline = false, placeholder, hint }: {
  id: string; label: string; fallback?: string; multiline?: boolean; placeholder?: string; hint?: string;
}) {
  const { overrides, setLocalOverride, removeLocalOverride } = useContent();
  const [draft, setDraft] = useState(overrides[id] ?? fallback);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | string>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dirty = useRef(false);

  useEffect(() => { if (!dirty.current) setDraft(overrides[id] ?? fallback); }, [overrides, id, fallback]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function change(v: string) {
    dirty.current = true;
    setDraft(v);
    setStatus('saving');
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      // An emptied box removes the edit, so the original text shows again.
      const clear = !fallback && v.trim() === '';
      if (clear) removeLocalOverride(id); else setLocalOverride(id, v);
      const r = clear ? await resetOverrides([id]) : await saveOverrideResult(id, v);
      dirty.current = false;
      setStatus(r.ok ? 'saved' : r.error);
    }, 600);
  }

  return (
    <label className="field-row">
      <span className="mono field-row__label">
        {label}
        {status === 'saving' && <em> · saving…</em>}
        {status === 'saved' && <em className="ok"> · saved</em>}
        {status !== 'idle' && status !== 'saving' && status !== 'saved' && <em className="bad"> · {status}</em>}
      </span>
      {multiline
        ? <textarea rows={3} value={draft} placeholder={placeholder} onChange={(e) => change(e.target.value)} />
        : <input value={draft} placeholder={placeholder} onChange={(e) => change(e.target.value)} />}
      {hint && <span className="note">{hint}</span>}
    </label>
  );
}
