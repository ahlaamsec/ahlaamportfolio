import { labs } from '@/content/data';
import { getCustomLabs, getDeletedIds } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/DeleteButton';
import { labToBlocks } from '@/lib/labBlocks';
import LabFindings from '@/components/LabFindings';
export const dynamic = 'force-dynamic';
export function generateStaticParams() { return labs.map(l => ({ slug: l.slug })); }
export default async function LabDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deleted = await getDeletedIds();
  if (deleted.includes(`lab:${slug}`)) return notFound();

  const staticLab = labs.find(l => l.slug === slug);
  const builtin = Boolean(staticLab);
  let lab: { slug: string; title: string; platform: string; status: string; tools: string[]; objective: string; findings: string; full?: typeof staticLab extends infer T ? (T extends { full?: infer F } ? F : never) : never } | undefined = staticLab;

  if (!lab) {
    const custom = await getCustomLabs();
    const match = custom.find(l => l.slug === slug);
    if (match) lab = { ...match, full: undefined };
  }
  if (!lab) return notFound();
  const f = lab.full;
  return (<article>
    <p><Link href="/cyber-lab">&larr; Cyber Lab</Link></p>
    <p className="eyebrow">{lab.platform}</p><h1>{lab.title}</h1>
    <p className="lede">{lab.status}</p>
    <div className="card">
      <dl><dt>Objective</dt><dd>{lab.objective}</dd><dt>Tools</dt><dd>{lab.tools.join(', ')}</dd>
        {f?.target && <><dt>Target</dt><dd>{f.target}</dd></>}</dl>
    </div>
    <section>
      <div className="card prose">
        <LabFindings slug={lab.slug} defaultValue={f && staticLab ? labToBlocks(staticLab).join('\n\n') : lab.findings} />
      </div>
    </section>
    <div style={{ marginTop: '1rem' }}>
      <DeleteButton kind="lab" slug={lab.slug} title={lab.title} builtin={builtin} redirectTo="/cyber-lab" />
    </div>
  </article>);
}
