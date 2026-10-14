import { fullWriting } from '@/content/data';
import { getCustomWriting, getDeletedIds } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditableText from '@/components/EditableText';
import WritingBody from '@/components/WritingBody';
import DeleteButton from '@/components/DeleteButton';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const piece = fullWriting.find((p) => p.slug === slug) || (await getCustomWriting()).find((p) => p.slug === slug);
  if (!piece) return {};
  const description = (piece.content.find((b) => !b.startsWith('![') && !b.startsWith('#')) || '').slice(0, 200);
  return {
    title: `${piece.title} | Ahlaam Abdallah`,
    description,
    openGraph: { title: piece.title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title: piece.title, description },
  };
}
export function generateStaticParams() { return fullWriting.map(p => ({ slug: p.slug })); }
export default async function PieceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deleted = await getDeletedIds();
  if (deleted.includes(`writing:${slug}`)) return notFound();

  let piece: { slug: string; title: string; category: string; type: string; tags: string[]; mins: number; date: string; status: string; content: string[] } | undefined =
    fullWriting.find(p => p.slug === slug);
  const builtin = Boolean(piece);
  if (!piece) {
    const custom = await getCustomWriting();
    piece = custom.find(p => p.slug === slug);
  }
  if (!piece) return notFound();
  const all = [...(await getCustomWriting()), ...fullWriting].filter((p) => !deleted.includes(`writing:${p.slug}`));
  const idx = all.findIndex((p) => p.slug === piece!.slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
  return (<article>
    <p><Link href="/writing">&larr; Writing Archive</Link></p>
    <p className="eyebrow">{piece.category} · {piece.type}</p>
    <EditableText id={`writing:${piece.slug}:title`} as="h1" value={piece.title} />
    <p className="note">{piece.date} · {piece.mins} min read · {piece.tags.join(', ')}</p>
    <div className="card prose" style={{ marginTop: '1.5rem' }}>
      <WritingBody slug={piece.slug} defaultContent={piece.content} />
    </div>
    <nav className="pager" aria-label="More writing">
      {prev ? <Link href={`/writing/${prev.slug}`}>&larr; {prev.title}</Link> : <span />}
      {next ? <Link href={`/writing/${next.slug}`}>{next.title} &rarr;</Link> : <span />}
    </nav>
    <div style={{ marginTop: '1rem' }}>
      <DeleteButton kind="writing" slug={piece.slug} title={piece.title} builtin={builtin} redirectTo="/writing" />
    </div>
  </article>);
}
