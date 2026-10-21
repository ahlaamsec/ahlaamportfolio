'use client';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import EditableText from './EditableText';
import Marquee from './Marquee';

const ID = 'home:practice:list';

// One editable comma-separated line; visitors see it as the scrolling strip.
export default function PracticeStrip({ defaultValue }: { defaultValue: string }) {
  const { overrides } = useContent();
  const { editing } = useEditMode();
  if (editing) return <div className="wrap"><EditableText id={ID} value={defaultValue} /></div>;
  const items = (overrides[ID] ?? defaultValue).split(',').map((s) => s.trim()).filter(Boolean);
  return <Marquee items={items} />;
}
