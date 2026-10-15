import { fullWriting } from '@/content/data';
import { getCustomWriting, getDeletedIds } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditableText from '@/components/EditableText';
import WritingBody from '@/components/WritingBody';
import DeleteButton from '@/components/DeleteButton';
import PageHead from '@/components/PageHead';

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
export function generateStaticParams() { return fullWriting.map((p) => ({ slug: p.slug })); }

export default async function PieceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [deleted, custom] = await Promise.all([getDeletedIds(), getCustomWriting()]);
  if (deleted.includes(`writing:${slug}`)) return notFound();

  const builtinPiece = fullWriting.find((p) => p.slug === slug);
  const piece = builtinPiece ?? custom.find((p) => p.slug === slug);
  if (!piece) return notFound();
  const all = [...custom, ...fullWriting].filter((p) => !deleted.includes(`writing:${p.slug}`));
  const idx = all.findIndex((p) => p.slug === piece.slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  return (<>
    <PageHead kicker={`${piece.category} · ${piece.type}`} back={['Writing archive', '/writing']}>
      <div className="hero__in" style={{ '--d': 1 } as React.CSSProperties}>
        <EditableText id={`writing:${piece.slug}:title`} as="h1" className="display display--page" value={piece.title} />
      </div>
      <p className="mono hero__in" style={{ '--d': 2 } as React.CSSProperties}>
        {piece.date} · {piece.mins} min read{piece.tags.length > 0 && ` · ${piece.tags.join(', ')}`}
      </p>
    </PageHead>
    <section className="band band--bright">
      <div className="wrap narrow">
        <div className="prose">
          <WritingBody slug={piece.slug} defaultContent={piece.content} />
        </div>
        <nav className="pager" aria-label="More writing">
          {prev ? <Link href={`/writing/${prev.slug}`} className="pager__link"><span className="mono">← Previous</span>{prev.title}</Link> : <span />}
          {next ? <Link href={`/writing/${next.slug}`} className="pager__link pager__link--next"><span className="mono">Next →</span>{next.title}</Link> : <span />}
        </nav>
        <div className="doc__actions">
          <DeleteButton kind="writing" slug={piece.slug} title={piece.title} builtin={Boolean(builtinPiece)} redirectTo="/writing" />
        </div>
      </div>
    </section>
  </>);
}
