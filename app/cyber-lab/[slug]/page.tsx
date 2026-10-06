import { labs } from '@/content/data';
import { getCustomLabs } from '@/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditableText from '@/components/EditableText';
export function generateStaticParams() { return labs.map(l => ({ slug: l.slug })); }
export default async function LabDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staticLab = labs.find(l => l.slug === slug);
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
    {f?.methodology && <section><h2>Methodology</h2><div className="card"><ul>{f.methodology.map(m => <li key={m}>{m}</li>)}</ul></div></section>}
    {f?.recon && <section><h2>Reconnaissance</h2><div className="card"><p>{f.recon}</p></div></section>}
    {f?.enumeration && <section><h2>Enumeration</h2><div className="card"><p>{f.enumeration}</p></div></section>}
    {f?.exploitation && <section><h2>Exploitation</h2><div className="card"><p>{f.exploitation}</p></div></section>}
    {f?.privesc && <section><h2>Privilege Escalation</h2><div className="card"><p>{f.privesc}</p></div></section>}
    {f?.table && <section><h2>Findings</h2><table><thead><tr><th>Title</th><th>Description</th><th>Severity</th><th>Impact</th></tr></thead>
      <tbody>{f.table.map(t => <tr key={t.title}><td>{t.title}</td><td>{t.desc}</td><td>{t.severity}</td><td>{t.impact}</td></tr>)}</tbody></table></section>}
    {f?.remediation && <section><h2>Remediation</h2><div className="card"><ul>{f.remediation.map(r => <li key={r}>{r}</li>)}</ul></div></section>}
    {f?.conclusion && <section><h2>Conclusion</h2><div className="card"><p>{f.conclusion}</p></div></section>}
    {f?.evidence && <section><h2>Evidence</h2><p className="note">Flags redacted from the source report.</p>
      <div className="evidence-grid">{f.evidence.map(e => <figure key={e.file}><img src={`/evidence/${lab.slug}/${e.file}`} alt={e.caption} loading="lazy" /><figcaption>{e.caption}</figcaption></figure>)}</div></section>}
    {!f && <div className="card">
      <p className="note" style={{ marginBottom: '.6rem' }}>Full write-up not yet added. Log your findings below — this saves straight to the live site once you're logged in as editor.</p>
      <EditableText id={`lab:${lab.slug}:findings`} multiline value={lab.findings} />
    </div>}
  </article>);
}
