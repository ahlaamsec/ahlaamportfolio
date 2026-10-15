import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { labs, type Lab } from '@/content/data';
import { getCustomLabs, getDeletedIds } from '@/lib/store';
import DeleteButton from '@/components/DeleteButton';
import { labToBlocks } from '@/lib/labBlocks';
import LabFindings from '@/components/LabFindings';
import PageHead from '@/components/PageHead';

export const dynamic = 'force-dynamic';
export function generateStaticParams() { return labs.map((l) => ({ slug: l.slug })); }

async function findLab(slug: string): Promise<Lab | undefined> {
  return labs.find((l) => l.slug === slug) ?? (await getCustomLabs()).find((l) => l.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lab = await findLab((await params).slug);
  return { title: lab ? `${lab.title} | Cyber Lab | Ahlaam Abdallah` : 'Cyber Lab | Ahlaam Abdallah' };
}

export default async function LabDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deleted = await getDeletedIds();
  if (deleted.includes(`lab:${slug}`)) return notFound();

  const staticLab = labs.find((l) => l.slug === slug);
  const lab = await findLab(slug);
  if (!lab) return notFound();
  const f = staticLab?.full;

  return (<>
    <PageHead
      kicker={lab.platform}
      title={lab.title}
      back={['Cyber Lab', '/cyber-lab']}
      lede={<span className={`status${f ? ' status--done' : ''}`}>{lab.status}</span>}
    />
    <section className="band band--bold">
      <div className="wrap narrow doc">
        <dl className="facts" data-reveal>
          <div><dt>Objective</dt><dd>{lab.objective}</dd></div>
          <div><dt>Tools</dt><dd><ul className="tags">{lab.tools.map((t) => <li key={t}>{t}</li>)}</ul></dd></div>
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
