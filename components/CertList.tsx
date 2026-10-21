'use client';
import { useContent } from './ContentProvider';
import { useEditMode } from './EditModeProvider';
import EditableText from './EditableText';

const ID = 'cv:certs';

// One certificate per line as "- Name — Issuer"; visitors see the two-column list.
export default function CertList({ value }: { value: string }) {
  const { overrides } = useContent();
  const { editing } = useEditMode();
  if (editing) return <div className="doc-block__body"><EditableText id={ID} multiline value={value} /></div>;
  const rows = (overrides[ID] ?? value).split('\n').map((l) => l.replace(/^\s*[-•]\s*/, '').trim()).filter(Boolean);
  return (
    <ul className="cert-list doc-block__body">
      {rows.map((r, i) => {
        const [name, issuer] = r.split(/\s+[—–]\s+/);
        return <li key={i}><span>{name}</span>{issuer && <span className="mono">{issuer}</span>}</li>;
      })}
    </ul>
  );
}
