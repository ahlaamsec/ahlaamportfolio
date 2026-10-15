import Link from 'next/link';
import { research, labs, site, experience, fullWriting } from '@/content/data';
import { getDeletedIds } from '@/lib/store';
import EditableText from '@/components/EditableText';
import AvatarUpload from '@/components/AvatarUpload';
import Currently from '@/components/Currently';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';
const FEATURED = ['diary-day39-reds-1', 'diary-day19-define-yourself-yinka', 'diary-day10', 'diary-day22-appreciation'];

const skills: { label: string; color: string }[] = [
  { label: 'Python', color: 'var(--blue)' }, { label: 'SQL', color: 'var(--teal)' }, { label: 'JavaScript', color: 'var(--amber)' },
  { label: 'Nmap', color: 'var(--green)' }, { label: 'Burp Suite', color: 'var(--accent)' }, { label: 'Kali Linux', color: 'var(--violet)' },
  { label: 'MongoDB', color: 'var(--green)' }, { label: 'Flask / FastAPI', color: 'var(--pink)' }, { label: 'Next.js', color: 'var(--ink)' },
  { label: 'Machine Learning', color: 'var(--blue)' }, { label: 'Linux', color: 'var(--amber)' }, { label: 'Teaching', color: 'var(--teal)' },
];
const skillColors = Object.fromEntries(skills.map((s) => [s.label, s.color]));

export default async function Home() {
  const deleted = await getDeletedIds();
  const featured = FEATURED.map((slug) => fullWriting.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => Boolean(p) && !deleted.includes(`writing:${p!.slug}`));
  return (<>
    <section className="hero" id="top">
      <div>
        <p className="eyebrow">Kumasi, Ghana</p>
        <EditableText id="home:hero:title" as="h1" value="Computer Science, Cybersecurity & Human-Centred Computing" />
        <EditableText id="home:hero:lede" as="p" className="lede" multiline value="I'm Ahlaam Abdallah, a KNUST computer science graduate. I build systems, break practice targets on purpose, teach, and write about the gap between what a system requires and what people can actually understand." />
        <div className="hero-actions">
          <a className="btn" href="#contact">Get in touch</a>
          <Link className="btn ghost" href="/cv">View CV</Link>
        </div>
        <EditableText id="home:hero:tags" className="meta-row" value="Ghana, Computer Science, Cybersecurity, HCI, AI" />
      </div>
      <AvatarUpload />
    </section>

    <Currently />

    <section id="about">
      <p className="eyebrow">About</p><h2>Training and direction</h2>
      <div className="card">
        <EditableText id="home:about:p1" multiline value="My computer science training taught me how to build computational systems. My cybersecurity practice taught me to question those systems. My teaching and writing experience taught me that a technically correct solution isn't automatically a useful one." />
        <EditableText id="home:about:p2" multiline value="That intersection of cybersecurity, HCI and secure AI, held together by technical communication, now shapes the work I want to pursue." />
      </div>
    </section>

    <section id="skills">
      <p className="eyebrow">Skills</p><h2>Tools I use</h2>
      <EditableText id="home:skills:list" className="note" multiline value={skills.map((s) => s.label).join(', ')} />
    </section>

    <section id="projects">
      <p className="eyebrow">Projects</p><h2>Selected work</h2>
      <div className="rows">
        <Link className="tile" href="/projects/petanqueai"><p className="tag">Final-year project</p><h3>PetanqueAI</h3><p className="note">Tournament management for four formats, plus a Random Forest model that predicts scores.</p></Link>
        <Link className="tile" href="/cyber-lab/apache-cve-2021-41773"><p className="tag">Cyber Lab · Full write-up</p><h3>Apache Instance Compromise</h3><p className="note">CVE-2021-41773 path traversal chained to a root shell via a sudo/cpio misconfiguration.</p></Link>
      </div>
      <p style={{ marginTop: '1rem' }}><Link href="/cyber-lab">All cyber lab entries →</Link></p>
    </section>

    <section id="experience">
      <p className="eyebrow">Experience</p><h2>Where I have worked</h2>
      <div className="timeline">
        {experience.map(e => <div className="item" key={e.org}>
          <p className="when">{e.when}</p><h3>{e.role}, {e.org}</h3>
          <EditableText id={`home:experience:${e.org}`} className="note" multiline value={e.bullets.join(' ')} />
        </div>)}
      </div>
    </section>

    <section id="research">
      <p className="eyebrow">Research</p><h2>Questions I want to investigate next</h2>
      {research.map(r => <details key={r.id}>
        <summary>{r.id}: {r.title}</summary>
        <EditableText id={`home:research:${r.id}`} multiline value={r.qs.map((q) => `- ${q}`).join('\n')} />
      </details>)}
      <p className="note" style={{ marginTop: '.8rem' }}>This is an agenda, not a publication record.</p>
    </section>

    <section id="writing">
      <p className="eyebrow">Writing</p><h2>From the archive</h2>
      <div className="rows">
        {featured.map((p) => (
          <Link className="tile" key={p.slug} href={`/writing/${p.slug}`}>
            <p className="tag">{p.category} · {p.mins} min read</p>
            <h3>{p.title}</h3>
            <p className="note">{(p.content.find((b) => !b.startsWith('![') && !b.startsWith('#')) || '').slice(0, 150)}…</p>
          </Link>
        ))}
      </div>
      <p style={{ marginTop: '1rem' }}>
        <Link href="/writing">Full writing archive →</Link> · <a href="/feed.xml">RSS</a>
      </p>
    </section>

    <section id="contact">
      <p className="eyebrow">Contact</p><h2>Get in touch</h2>
      <div className="card">
        <p><a href={`mailto:${site.email}`}>{site.email}</a> · <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></p>
        <p><a href={site.github}>GitHub</a> · <a href={site.linkedin}>LinkedIn</a></p>
        <h3 style={{ margin: '1rem 0 .4rem' }}>Send a message</h3>
        <ContactForm />
        <EditableText id="home:contact:note" className="note" multiline value="Off the clock: British podcasts, Qur'an competitions, fiction. One day, a novel." />
      </div>
    </section>
  </>);
}
