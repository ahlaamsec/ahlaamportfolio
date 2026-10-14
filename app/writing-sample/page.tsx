import { fullWriting } from '@/content/data';
import { notFound } from 'next/navigation';
import EditableBody from '@/components/EditableBody';
import PrintButton from '@/components/PrintButton';
import { getDeletedIds } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Writing sample | Ahlaam Abdallah' };

// One printable page, for applications that ask for a short writing sample.
const SAMPLE = 'security-warning-nobody-read';

export default async function WritingSample() {
  const piece = fullWriting.find((p) => p.slug === SAMPLE);
  const deleted = await getDeletedIds();
  if (!piece || deleted.includes(`writing:${SAMPLE}`)) return notFound();
  return (
    <article className="sample prose">
      <p className="no-print note">This page prints on one sheet. Use the button, then choose "Save as PDF" as the destination.</p>
      <PrintButton />
      <h1>{piece.title}</h1>
      <p className="note">Ahlaam Abdallah · Computer Science, KNUST</p>
      <EditableBody id={`writing:${piece.slug}:content`} defaultValue={piece.content.join('\n\n')} />
    </article>
  );
}
