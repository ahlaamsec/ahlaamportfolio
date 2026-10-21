import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { labs, type Lab } from '@/content/data';
import { getCustomLabs, getDeletedIds, getOverrides } from '@/lib/store';
import { withLabMeta } from '@/lib/profile';
import DeleteButton from '@/components/DeleteButton';
import { labToBlocks } from '@/lib/labBlocks';
import LabFindings from '@/components/LabFindings';
import PageHead from '@/components/PageHead';
import EditableText from '@/components/EditableText';
import LabTools from '@/components/LabTools';

export const dynamic = 'force-dynamic';
export function generateStaticParams() { return labs.map((l) => ({ slug: l.slug })); }

async function findLab(slug: string): Promise<Lab | undefined> {
  return labs.find((l) => l.slug === slug) ?? (await getCustomLabs()).find((l) => l.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lab = await findLab((await params).slug);
  const title = lab && withLabMeta(lab, await getOverrides()).title;
  return { title: title ? `${title} | Cyber Lab | Ahlaam Abdallah` : 'Cyber Lab | Ahlaam Abdallah' };
}

export default async function LabDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [deleted, overrides] = await Promise.all([getDeletedIds(), getOverrides()]);
  if (deleted.includes(`lab:${slug}`)) return notFound();

  const staticLab = labs.find((l) => l.slug === slug);
  const found = await findLab(slug);
  if (!found) return notFound();
  const lab = withLabMeta(found, overrides);
  const f = staticLab?.full;
  const id = (k: string) => `lab:${lab.slug}:${k}`;

  return (<>
    <PageHead
      kicker={<EditableText id={id('platform')} as="span" value={lab.platform} />}
      title={<EditableText id={id('title')} as="span" value={lab.title} />}
      back={['Cyber Lab', '/cyber-lab']}
      lede={<span className={`status${f ? ' status--done' : ''}`}><EditableText id={id('status')} as="span" value={lab.status} /></span>}
    />
    <section className="band band--bold">
      <div className="wrap narrow doc">
        <dl className="facts" data-reveal>
          <div><dt>Objective</dt><dd><EditableText id={id('objective')} as="span" multiline value={lab.objective} /></dd></div>
          <div><dt>Tools</dt><dd><LabTools id={id('tools')} value={lab.tools.join(', ')} /></dd></div>
          {f?.target && <div><dt>Target</dt><dd>{f.target}</dd></div>}
        </dl>
        <div className="prose prose--report">
          <LabFindings slug={lab.slug} defaultValue={f && staticLab ? labToBlocks(staticLab).join('\n\n') : lab.findings} />
        </div>
        <div className="doc__actions">
          <DeleteButton kind="lab" slug={lab.slug} title={lab.title} builtin={Boolean(staticLab)} redirectTo="/cyber-lab" />
        </div>
      </div>
    </section>
  </>);
}
