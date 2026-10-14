'use client';
import { useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import { saveOverride, saveOverrides } from '@/lib/saveOverride';
import { NAV_ITEMS, BRAND_NAME, CTA_LABEL, THEME_KEYS, THEME_PRESETS } from '@/lib/nav';

export default function SiteSettingsButton() {
  const { authed } = useEditMode();
  const { overrides, setLocalOverride } = useContent();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  if (!authed) return null;

  function set(id: string, value: string, delay = 400) {
    setLocalOverride(id, value);
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(async () => {
      const ok = await saveOverride(id, value);
      setSaved(ok ? 'Saved' : 'Could not save');
      setTimeout(() => setSaved(null), 1500);
    }, delay);
  }
  async function batch(values: Record<string, string>) {
    Object.entries(values).forEach(([k, v]) => setLocalOverride(k, v));
    const ok = await saveOverrides(values);
    setSaved(ok ? 'Saved' : 'Could not save');
    setTimeout(() => setSaved(null), 1500);
  }
  function applyPreset(values: Record<string, string>) {
    batch(Object.fromEntries(THEME_KEYS.map((t) => [`theme:${t.key}`, values[t.key] || t.fallback])));
  }
  function resetNav() {
    batch(Object.fromEntries(['brand', 'cta', ...NAV_ITEMS.map((n) => n.key)].map((k) => [`nav:${k}`, ''])));
  }

  return (
    <>
      <button className="settings-fab" onClick={() => setOpen(true)} aria-label="Site settings">Settings</button>
      {open && (
        <div className="add-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Colors</h3>
            <div className="chips" role="group" aria-label="Color presets">
              {THEME_PRESETS.map((p) => (
                <button type="button" key={p.name} onClick={() => applyPreset(p.values)}>{p.name}</button>
              ))}
            </div>
            <div className="theme-grid">
              {THEME_KEYS.map((t) => {
                const v = overrides[`theme:${t.key}`] || t.fallback;
                return (
                  <label key={t.key} className="theme-item">
                    <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(v) ? v : t.fallback} onChange={(e) => set(`theme:${t.key}`, e.target.value)} />
                    <span>{t.label}</span>
                  </label>
                );
              })}
            </div>

            <h3 style={{ marginTop: '1.4rem' }}>Menu and header text</h3>
            <label className="mono">Your name in the header</label>
            <input value={overrides['nav:brand'] ?? BRAND_NAME} onChange={(e) => set('nav:brand', e.target.value)} />
            <label className="mono">Button on the right</label>
            <input value={overrides['nav:cta'] ?? CTA_LABEL} onChange={(e) => set('nav:cta', e.target.value)} />
            {NAV_ITEMS.map((n) => (
              <div key={n.key}>
                <label className="mono">Menu: {n.label}</label>
                <input value={overrides[`nav:${n.key}`] ?? n.label} onChange={(e) => set(`nav:${n.key}`, e.target.value)} />
              </div>
            ))}

            <div className="hero-actions" style={{ marginTop: '1rem' }}>
              <button className="btn ghost" type="button" onClick={resetNav}>Reset menu text</button>
              <button className="btn" type="button" onClick={() => setOpen(false)}>Done</button>
              {saved && <span className="note">{saved}</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
