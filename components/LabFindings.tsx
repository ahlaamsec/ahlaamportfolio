'use client';
import EditableBody from './EditableBody';

export default function LabFindings({ slug, defaultValue }: { slug: string; defaultValue: string }) {
  return <EditableBody id={`lab:${slug}:findings`} defaultValue={defaultValue} />;
}
