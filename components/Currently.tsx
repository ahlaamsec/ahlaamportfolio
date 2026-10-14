'use client';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import EditableText from './EditableText';

const ROWS = [
  { id: 'home:now:reading', label: 'Reading' },
  { id: 'home:now:building', label: 'Building' },
  { id: 'home:now:learning', label: 'Learning' },
];

// Only shows rows that have text, so visitors never see empty placeholders.
// In edit mode every row appears so you can fill it in.
export default function Currently() {
  const { overrides } = useContent();
  const { editing } = useEditMode();
  const visible = ROWS.filter((r) => editing || (overrides[r.id] || '').trim());
  if (!visible.length) return null;
  return (
    <section id="now">
      <p className="eyebrow">Currently</p>
      <div className="card now-card">
        {visible.map((r) => (
          <div className="now-row" key={r.id}>
            <span className="mono">{r.label}</span>
            <EditableText id={r.id} as="span" value="" />
          </div>
        ))}
      </div>
    </section>
  );
}
