'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContent } from '../ContentProvider';
import { useEditMode } from '../EditModeProvider';
import { saveOverrideResult, resetOverrides } from '@/lib/saveOverride';
import { HOME_SECTIONS, FEATURED } from '@/lib/profile';
import type { BuiltinEntry } from './AdminDashboard';
import Field from './Field';

export default function HomeTab({ builtins }: { builtins: BuiltinEntry[] }) {
  const { overrides, setLocalOverride, removeLocalOverride } = useContent();
  const { setEditing } = useEditMode();
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [custom, setCustom] = useState<{ slug: string; title: string }[]>([]);
  useEffect(() => {
    fetch('/api/entries').then((r) => r.json()).then((d) => setCustom(d.writing || [])).catch(() => {});
  }, []);

  async function save(id: string, value: string) {
    if (value) setLocalOverride(id, value); else removeLocalOverride(id);
    const r = value ? await saveOverrideResult(id, value) : await resetOverrides([id]);
    setMsg(r.ok ? 'Saved' : r.error);
    setTimeout(() => setMsg(null), 1500);
  }

  const writing = [...custom, ...builtins.filter((b) => b.kind === 'writing')];
  const featuredRaw = (overrides['home:featured'] || '').split(',').map((s) => s.trim()).filter(Boolean);
  const featured = featuredRaw.length ? featuredRaw : FEATURED;
  const slots = [0, 1, 2, 3].map((i) => featured[i] || '');

  function setFeatured(i: number, slug: string) {
    const next = [...slots];
    next[i] = slug;
    save('home:featured', next.filter(Boolean).join(','));
  }

  return (
    <div className="home-tab">
      <div className="actions actions--tight admin-actions">
        <button className="btn btn--sm" onClick={() => { setEditing(true); router.push('/'); }}>Edit home page text in place</button>
        {msg && <span className="note">{msg}</span>}
      </div>
      <p className="note">Every heading, paragraph and button label on the home page can be clicked and changed once you are in edit mode. The settings below are the parts that aren't plain text.</p>

      <section className="admin-card">
        <h3>Sections shown</h3>
        <p className="note">Untick a section to hide it from visitors. Nothing is deleted.</p>
        <ul className="toggle-list">
          {HOME_SECTIONS.map((s) => {
            const on = overrides[`home:hide:${s.key}`] !== '1';
            return (
              <li key={s.key}>
                <label>
                  <input type="checkbox" checked={on} onChange={() => save(`home:hide:${s.key}`, on ? '1' : '')} />
                  <span>{s.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="admin-card">
        <h3>Featured writing</h3>
        <p className="note">The four pieces shown under "From the archive".</p>
        <div className="form-grid">
          {slots.map((slug, i) => (
            <label key={i} className="field-row">
              <span className="mono field-row__label">Slot {i + 1}</span>
              <select value={slug} onChange={(e) => setFeatured(i, e.target.value)}>
                <option value="">(empty)</option>
                {writing.map((w) => <option key={w.slug} value={w.slug}>{overrides[`writing:${w.slug}:title`] || w.title}</option>)}
              </select>
            </label>
          ))}
        </div>
        {featuredRaw.length > 0 && <button className="btn btn--ghost btn--sm" onClick={() => save('home:featured', '')}>Back to the original four</button>}
      </section>

      <section className="admin-card">
        <h3>Lists</h3>
        <Field id="home:practice:list" label="Scrolling strip (comma-separated)" placeholder="BCTF, EchoCTF, TryHackMe, …" />
        <Field id="home:skills:list" label="Tools I use (comma-separated)" multiline placeholder="Python, SQL, JavaScript, …" />
      </section>

      <section className="admin-card">
        <h3>Terminal</h3>
        <p className="note">The two typed answers in the hero terminal. The lab and writing lines update themselves.</p>
        <Field id="home:terminal:whoami" label="$ whoami" placeholder="ahlaam abdallah · cs grad, KNUST" />
        <Field id="home:terminal:focus" label="$ cat focus.txt" placeholder="cybersecurity · hci · secure ai · technical writing" />
      </section>

      <section className="admin-card">
        <h3>Currently</h3>
        <p className="note">This strip only appears when at least one line is filled in.</p>
        <Field id="home:now:reading" label="Reading" />
        <Field id="home:now:building" label="Building" />
        <Field id="home:now:learning" label="Learning" />
      </section>
    </div>
  );
}
