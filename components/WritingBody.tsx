'use client';
import EditableBody from './EditableBody';

export default function WritingBody({ slug, defaultContent }: { slug: string; defaultContent: string[] }) {
  return <EditableBody id={`writing:${slug}:content`} defaultValue={defaultContent.join('\n\n')} />;
}
