'use client';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import EditableText from './EditableText';

const ID = 'home:skills:list';

// The skills are one editable comma-separated line; visitors see it as a numbered grid.
export default function SkillsGrid({ defaultValue }: { defaultValue: string }) {
  const { overrides } = useContent();
  const { editing } = useEditMode();
  if (editing) return <EditableText id={ID} multiline value={defaultValue} />;
  const skills = (overrides[ID] ?? defaultValue).split(',').map((s) => s.trim()).filter(Boolean);
  return (
    <ol className="skills">
      {skills.map((s, i) => (
        <li key={s + i} data-reveal style={{ '--d': i % 4 } as React.CSSProperties}>
          <span className="mono">{String(i + 1).padStart(2, '0')}</span>{s}
        </li>
      ))}
    </ol>
  );
}
