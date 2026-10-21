'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEditMode } from '../EditModeProvider';
import { useContent } from '../ContentProvider';
import { withWritingMeta, withLabMeta } from '@/lib/profile';
import type { BuiltinEntry } from './AdminDashboard';
import Field from './Field';

type Entry = BuiltinEntry & { builtin: boolean; hidden: boolean };
type Filter = 'all' | 'writing' | 'lab' | 'hidden';

export default function ContentTab({ builtins }: { builtins: BuiltinEntry[] }) {
  const { setEditing } = useEditMode();
  const { overrides } = useContent();
  const router = useRouter();
  const [custom, setCustom] = useState<BuiltinEntry[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [limit, setLimit] = useState(40);

  function refresh() {
    fetch('/api/entries').then((r) => r.json()).then((d) => {
      setCustom([
        ...(d.writing || []).map((e: any) => ({ kind: 'writing', slug: e.slug, title: e.title, category: e.category, type: e.type, date: e.date, tags: e.tags || [] })),
        ...(d.labs || []).map((e: any) => ({ kind: 'lab', slug: e.slug, title: e.title, platform: e.platform, status: e.status, objective: e.objective, tools: e.tools || [] })),
      ]);
      setDeleted(d.deleted || []);
    }).catch(() => {});
  }
  useEffect(refresh, []);

  const all: Entry[] = useMemo(() => [
    ...custom.map((e) => ({ ...e, builtin: false, hidden: false })),
    ...builtins.map((e) => ({ ...e, builtin: true, hidden: deleted.includes(`${e.kind}:${e.slug}`) })),
  ].map((e) => (e.kind === 'writing' ? { ...e, ...withWritingMeta(e, overrides) } : { ...e, ...withLabMeta(e, overrides) })), [custom, builtins, deleted, overrides]);

  const shown = all.filter((e) => {
    if (filter === 'hidden') { if (!e.hidden) return false; }
    else if (e.hidden) return false;
    if (filter === 'writing' && e.kind !== 'writing') return false;
    if (filter === 'lab' && e.kind !== 'lab') return false;
    const sub = e.kind === 'writing' ? `${e.category} ${e.tags.join(' ')}` : `${e.platform} ${e.tools.join(' ')}`;
    return `${e.title} ${sub}`.toLowerCase().includes(q.toLowerCase());
  });

  const counts = {
    writing: all.filter((e) => e.kind === 'writing' && !e.hidden).length,
    lab: all.filter((e) => e.kind === 'lab' && !e.hidden).length,
    hidden: all.filter((e) => e.hidden).length,
  };

  const href = (e: Entry) => (e.kind === 'writing' ? `/writing/${e.slug}` : `/cyber-lab/${e.slug}`);

  function editPage(e: Entry) {
    setEditing(true);
    router.push(href(e));
  }

  async function remove(e: Entry) {
    const msg = e.builtin
      ? `Hide "${e.title}" from the site? You can bring it back from the Hidden list.`
      : `Delete "${e.title}" for good? This cannot be undone.`;
    if (!confirm(msg)) return;
    setBusy(e.slug);
    await fetch('/api/entries', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: e.kind, slug: e.slug, builtin: e.builtin }),
    }).catch(() => {});
    setBusy(null);
    refresh();
  }

  async function restore(e: Entry) {
    setBusy(e.slug);
    await fetch('/api/entries', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore', id: `${e.kind}:${e.slug}` }),
    }).catch(() => {});
    setBusy(null);
    refresh();
  }

  const add = (kind: string) => window.dispatchEvent(new CustomEvent('open-add-entry', { detail: kind }));

  return (
    <div>
      <div className="actions actions--tight admin-actions">
        <button className="btn btn--sm" onClick={() => add('writing')}>New writing</button>
        <button className="btn btn--sm" onClick={() => add('report')}>New lab report</button>
        <button className="btn btn--ghost btn--sm" onClick={() => add('lab')}>Quick lab entry</button>
        <button className="btn btn--ghost btn--sm" onClick={() => window.dispatchEvent(new Event('open-upload'))}>Upload Word / Markdown files</button>
      </div>

      <div className="admin-filter">
        <input type="search" className="field" placeholder="Search titles, tags, tools" value={q} onChange={(e) => { setQ(e.target.value); setLimit(40); }} />
        <div className="chips" role="group" aria-label="Show">
          {([['all', 'Everything'], ['writing', `Writing (${counts.writing})`], ['lab', `Labs (${counts.lab})`], ['hidden', `Hidden (${counts.hidden})`]] as [Filter, string][]).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => { setFilter(k); setLimit(40); }}>{l}</button>
          ))}
        </div>
      </div>

      <ul className="entry-list">
        {shown.slice(0, limit).map((e) => {
          const key = `${e.kind}:${e.slug}`;
          return (
            <li key={key} className={`entry${e.hidden ? ' entry--hidden' : ''}`}>
              <div className="entry__main">
                <span className="mono entry__kind">{e.kind === 'writing' ? 'Writing' : 'Lab'}{!e.builtin && ' · added by you'}</span>
                <span className="entry__title">{e.title}</span>
                <span className="mono">{e.kind === 'writing' ? `${e.category} · ${e.date}` : `${e.platform} · ${e.status}`}</span>
              </div>
              <div className="entry__actions">
                {e.hidden ? (
                  <button className="btn btn--sm" disabled={busy === e.slug} onClick={() => restore(e)}>Restore</button>
                ) : (
                  <>
                    <Link className="btn btn--ghost btn--sm" href={href(e)}>View</Link>
                    <button className="btn btn--sm" onClick={() => editPage(e)}>Edit text and pictures</button>
                    <button className="btn btn--ghost btn--sm" aria-expanded={open === key} onClick={() => setOpen(open === key ? null : key)}>Details</button>
                    <button className="btn btn--ghost btn--sm entry__del" disabled={busy === e.slug} onClick={() => remove(e)}>{e.builtin ? 'Hide' : 'Delete'}</button>
                  </>
                )}
              </div>
              {open === key && !e.hidden && <Details entry={builtins.find((b) => b.kind === e.kind && b.slug === e.slug) || custom.find((b) => b.kind === e.kind && b.slug === e.slug)!} />}
            </li>
          );
        })}
        {shown.length === 0 && <li className="muted empty">Nothing matches.</li>}
      </ul>
      {shown.length > limit && <button className="btn btn--ghost btn--sm" onClick={() => setLimit(limit + 60)}>Show more ({shown.length - limit} left)</button>}
    </div>
  );
}

// The list details of one entry. Leaving a box empty puts the original back.
function Details({ entry }: { entry: BuiltinEntry }) {
  const p = `${entry.kind}:${entry.slug}:`;
  return (
    <div className="entry__details">
      {entry.kind === 'writing' ? (
        <>
          <Field id={`${p}title`} label="Title" placeholder={entry.title} />
          <div className="form-grid">
            <Field id={`${p}category`} label="Category" placeholder={entry.category} />
            <Field id={`${p}type`} label="Type" placeholder={entry.type} />
            <Field id={`${p}date`} label="Date" placeholder={entry.date} />
          </div>
          <Field id={`${p}tags`} label="Tags (comma-separated)" placeholder={entry.tags.join(', ')} />
        </>
      ) : (
        <>
          <Field id={`${p}title`} label="Title" placeholder={entry.title} />
          <div className="form-grid">
            <Field id={`${p}platform`} label="Platform" placeholder={entry.platform} />
            <Field id={`${p}status`} label="Status" placeholder={entry.status} />
          </div>
          <Field id={`${p}objective`} label="Objective" multiline placeholder={entry.objective} />
          <Field id={`${p}tools`} label="Tools (comma-separated)" placeholder={entry.tools.join(', ')} />
        </>
      )}
      <p className="note">Empty boxes keep the original (shown in grey). The write-up itself, with its pictures, is edited on its page: use "Edit text and pictures".</p>
    </div>
  );
}
