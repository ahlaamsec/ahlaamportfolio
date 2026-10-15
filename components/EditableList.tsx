'use client';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import EditableText from './EditableText';

// Text stored as "- item" lines. Edit mode shows the raw text; read mode shows a real list.
export default function EditableList({ id, value, className }: { id: string; value: string; className?: string }) {
  const { overrides } = useContent();
  const { editing } = useEditMode();
  if (editing) return <EditableText id={id} multiline value={value} />;
  const items = (overrides[id] ?? value).split('\n').map((l) => l.replace(/^\s*[-•]\s*/, '').trim()).filter(Boolean);
  return <ul className={className}>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
}
