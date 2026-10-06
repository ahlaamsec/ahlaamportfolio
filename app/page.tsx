import Link from 'next/link';
import { research, labs, site, experience } from '@/content/data';
import EditableText from '@/components/EditableText';

const skills: { label: string; color: string }[] = [
  { label: 'Python', color: 'var(--blue)' }, { label: 'SQL', color: 'var(--teal)' }, { label: 'JavaScript', color: 'var(--amber)' },
  { label: 'Nmap', color: 'var(--green)' }, { label: 'Burp Suite', color: 'var(--accent)' }, { label: 'Kali Linux', color: 'var(--violet)' },
  { label: 'MongoDB', color: 'var(--green)' }, { label: 'Flask / FastAPI', color: 'var(--pink)' }, { label: 'Next.js', color: 'var(--ink)' },
  { label: 'Machine Learning', color: 'var(--blue)' }, { label: 'Linux', color: 'var(--amber)' }, { label: 'Teaching', color: 'var(--teal)' },
];

export default function Home() {
  return (<>
    <section className="hero" id="top">
      <div>
        <p className="eyebrow">Field note 001 · Kumasi, Ghana</p>
        <h1>Computer Science, Cybersecurity & Human-Centred Computing</h1>
        <EditableText id="home:hero:lede" as="p" className="lede" multiline value="I'm Ahlaam Abdallah, a KNUST computer science graduate. I build systems, break practice targets on purpose, teach, and write about the gap between what a system requires and what people can actually understand." />
        <div className="hero-actions">
          <a className="btn" href="#contact">Get in touch</a>
          <Link className="btn ghost" href="/cv">View CV</Link>
        </div>
        <div className="meta-row"><span>Ghana</span><span>Computer Science</span><span>Cybersecurity</span><span>HCI</span><span>AI</span></div>
      </div>
      <div className="avatar-card"><span className="avatar-mono">AA</span></div>
    </section>

    <section id="about">
      <p className="eyebrow">About</p><h2>Trained to build. Learning to question.</h2>
      <div className="card">
        <EditableText id="home:about:p1" multiline value="My computer science training taught me how to build computational systems. My cybersecurity practice taught me to question those systems. My teaching and writing experience taught me that a technically correct solution isn't automatically a useful one." />
        <EditableText id="home:about:p2" multiline value="That intersection — cybersecurity, HCI, and secure AI, held together by technical communication — now shapes the work I want to pursue." />
      </div>
    </section>

    <section id="skills">
      <p className="eyebrow">My Skills</p><h2>What I actually work with</h2>
      <div className="grid cols-4">{skills.map(s => <div className="skill" key={s.label}><span className="sq" style={{ background: s.color }}>{s.label[0]}</span>{s.label}</div>)}</div>
    </section>

    <section id="projects">
      <p className="eyebrow">Built &amp; Investigated</p><h2>Selected work</h2>
      <div className="grid cols-2">
        <Link className="tile" href="/projects/petanqueai"><div className="thumb" /><p className="tag">Final-year project</p><h3>PetanqueAI</h3><p className="note">Tournament management for four formats, plus a Random Forest model that predicts scores.</p></Link>
        <Link className="tile" href="/cyber-lab/apache-cve-2021-41773"><div className="thumb alt" /><p className="tag">Cyber Lab · Full write-up</p><h3>Apache Instance Compromise</h3><p className="note">CVE-2021-41773 path traversal chained to a root shell via a sudo/cpio misconfiguration.</p></Link>
      </div>
      <p style={{ marginTop: '1rem' }}><Link href="/cyber-lab">All cyber lab entries →</Link></p>
    </section>

    <section id="experience">
      <p className="eyebrow">Experience</p><h2>Where I've worked</h2>
      <div className="timeline">
        {experience.map(e => <div className="item" key={e.org}><p className="when">{e.when}</p><h3>{e.role}, {e.org}</h3><p className="note">{e.bullets[0]}</p></div>)}
      </div>
    </section>

    <section id="research">
      <p className="eyebrow">Research</p><h2>Questions I want to investigate next</h2>
      {research.map(r => <details key={r.id}><summary>{r.id}: {r.title}</summary><ul>{r.qs.map(q => <li key={q}>{q}</li>)}</ul></details>)}
      <p className="note" style={{ marginTop: '.8rem' }}>This is an agenda, not a publication record.</p>
    </section>

    <section id="writing">
      <p className="eyebrow">Written</p><h2>From the archive</h2>
      <div className="card"><p>The <Link href="/writing">writing archive</Link> holds essays and technical notes on human behaviour, communication, cybersecurity and career — pulled from 100+ days of writing.</p></div>
    </section>

    <section id="contact">
      <p className="eyebrow">Contact</p><h2>Let's talk</h2>
      <div className="card">
        <p><a href={`mailto:${site.email}`}>{site.email}</a> · <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></p>
        <p><a href={site.github}>GitHub</a> · <a href={site.linkedin}>LinkedIn</a></p>
        <EditableText id="home:contact:note" className="note" multiline value="Off the clock: British podcasts, Qur'an competitions, fiction. One day, a novel." />
      </div>
    </section>
  </>);
}
