import { fullWriting } from '@/content/data';
import { getCustomWriting } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditableText from '@/components/EditableText';
import WritingBody from '@/components/WritingBody';
export function generateStaticParams() { return fullWriting.map(p => ({ slug: p.slug })); }
export default async function PieceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let piece: { slug: string; title: string; category: string; type: string; tags: string[]; mins: number; date: string; status: string; content: string[] } | undefined =
    fullWriting.find(p => p.slug === slug);
  if (!piece) {
    const custom = await getCustomWriting();
    piece = custom.find(p => p.slug === slug);
  }
  if (!piece) return notFound();
  return (<article>
    <p><Link href="/writing">&larr; Writing Archive</Link></p>
    <p className="eyebrow">{piece.category} · {piece.type}</p>
    <EditableText id={`writing:${piece.slug}:title`} as="h1" value={piece.title} />
    <p className="note">{piece.date} · {piece.mins} min read · {piece.tags.join(', ')}</p>
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <WritingBody slug={piece.slug} defaultContent={piece.content} />
    </div>
  </article>);
}
