'use client';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import EditableText from './EditableText';

// Tools are one editable comma-separated line; visitors see them as tags.
export default function LabTools({ id, value }: { id: string; value: string }) {
  const { overrides } = useContent();
  const { editing } = useEditMode();
  if (editing) return <EditableText id={id} value={value} />;
  const tools = (overrides[id] || value).split(',').map((t) => t.trim()).filter(Boolean);
  return <ul className="tags">{tools.map((t) => <li key={t}>{t}</li>)}</ul>;
}
