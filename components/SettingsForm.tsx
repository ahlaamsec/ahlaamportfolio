'use client';
import { useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import { saveOverride, saveOverrides } from '@/lib/saveOverride';
import { NAV_ITEMS, BRAND_NAME, CTA_LABEL, THEME_KEYS, THEME_PRESETS } from '@/lib/nav';
import { FONT_CHOICES, TEXT_SIZES } from '@/lib/fonts';

// Colours, fonts, text size and menu text. Used by the floating Settings
// button and by the dashboard's Design tab.
export default function SettingsForm({ onDone }: { onDone?: () => void }) {
  const { overrides, setLocalOverride } = useContent();
  const [saved, setSaved] = useState<string | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function flash(ok: boolean) {
    setSaved(ok ? 'Saved' : 'Could not save');
    setTimeout(() => setSaved(null), 1500);
  }
  function set(id: string, value: string, delay = 400) {
    setLocalOverride(id, value);
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(async () => flash(await saveOverride(id, value)), delay);
  }
  async function batch(values: Record<string, string>) {
    Object.entries(values).forEach(([k, v]) => setLocalOverride(k, v));
    flash(await saveOverrides(values));
  }
  function applyPreset(values: Record<string, string>) {
    batch(Object.fromEntries(THEME_KEYS.map((t) => [`theme:${t.key}`, values[t.key] || t.fallback])));
  }
  function resetNav() {
    batch(Object.fromEntries(['brand', 'cta', ...NAV_ITEMS.map((n) => n.key)].map((k) => [`nav:${k}`, ''])));
  }
  function resetType() {
    batch({ 'theme:font-display': '', 'theme:font-body': '', 'theme:size': '', 'theme:caps': '' });
  }

  return (
    <div className="settings-form">
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

      <h3 style={{ marginTop: '1.4rem' }}>Fonts and text</h3>
      <div className="form-grid">
        <label>
          <span className="mono">Headings font</span>
          <select value={overrides['theme:font-display'] || 'anton'} onChange={(e) => set('theme:font-display', e.target.value, 0)}>
            {FONT_CHOICES.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
        </label>
        <label>
          <span className="mono">Body font</span>
          <select value={overrides['theme:font-body'] || 'epilogue'} onChange={(e) => set('theme:font-body', e.target.value, 0)}>
            {FONT_CHOICES.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
        </label>
        <label>
          <span className="mono">Text size</span>
          <select value={overrides['theme:size'] || '100'} onChange={(e) => set('theme:size', e.target.value, 0)}>
            {TEXT_SIZES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </label>
        <label>
          <span className="mono">Big headings</span>
          <select value={overrides['theme:caps'] === 'off' ? 'off' : 'on'} onChange={(e) => set('theme:caps', e.target.value === 'off' ? 'off' : '', 0)}>
            <option value="on">ALL CAPITALS</option>
            <option value="off">Normal case</option>
          </select>
        </label>
      </div>
      <button className="btn btn--ghost btn--sm" type="button" onClick={resetType} style={{ marginTop: '.8rem' }}>Reset fonts and size</button>

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
        {onDone && <button className="btn" type="button" onClick={onDone}>Done</button>}
        {saved && <span className="note">{saved}</span>}
      </div>
    </div>
  );
}
