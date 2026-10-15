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
    <section id="now" className="band band--bold now">
      <div className="wrap now__inner">
        <p className="kicker">Currently</p>
        <dl className="now__list">
          {visible.map((r) => (
            <div className="now-row" key={r.id}>
              <dt className="mono">{r.label}</dt>
              <dd><EditableText id={r.id} as="span" value="" /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
