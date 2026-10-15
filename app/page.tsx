import Link from 'next/link';
import { research, labs, site, experience, fullWriting, certs, languages } from '@/content/data';
import { getCustomLabs, getCustomWriting, getDeletedIds } from '@/lib/store';
import EditableText from '@/components/EditableText';
import EditableList from '@/components/EditableList';
import AvatarUpload from '@/components/AvatarUpload';
import Currently from '@/components/Currently';
import ContactForm from '@/components/ContactForm';
import SkillsGrid from '@/components/SkillsGrid';
import Terminal from '@/components/Terminal';
import Marquee from '@/components/Marquee';

export const dynamic = 'force-dynamic';
const FEATURED = ['diary-day39-reds-1', 'diary-day19-define-yourself-yinka', 'diary-day10', 'diary-day22-appreciation'];
const SKILLS = 'Python, SQL, JavaScript, Nmap, Burp Suite, Kali Linux, MongoDB, Flask / FastAPI, Next.js, Machine Learning, Linux, Teaching';
const PRACTICE = ['BCTF', 'EchoCTF', 'TryHackMe', 'Kioptrix', 'Burp Suite', 'Nmap', 'Kali Linux', 'Metasploit', 'GTFOBins', 'searchsploit'];

const d = (n: number) => ({ '--d': n } as React.CSSProperties);
const excerpt = (content: string[]) => (content.find((b) => !b.startsWith('![') && !b.startsWith('#')) || '').slice(0, 140);

export default async function Home() {
  const [deleted, customWriting, customLabs] = await Promise.all([getDeletedIds(), getCustomWriting(), getCustomLabs()]);
  const liveWriting = [...customWriting, ...fullWriting].filter((p) => !deleted.includes(`writing:${p.slug}`));
  const featured = FEATURED.map((slug) => liveWriting.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const liveLabs = [...customLabs, ...labs].filter((l) => !deleted.includes(`lab:${l.slug}`));
  const stats: [string | number, string][] = [
    [`${liveWriting.length}+`, 'pieces written'],
    [liveLabs.length, 'cyber labs'],
    [certs.length, 'certifications'],
    [languages.length, 'languages spoken'],
  ];
  const terminal = [
    { cmd: 'whoami', out: 'ahlaam abdallah · cs grad, KNUST' },
    { cmd: 'cat focus.txt', out: 'cybersecurity · hci · secure ai · technical writing' },
    { cmd: 'ls ./labs', out: liveLabs.map((l) => l.slug).join('  ') },
    { cmd: 'wc -l ./writing/*', out: `${liveWriting.length} pieces and counting` },
  ];

  return (<>
    {/* HERO */}
    <section className="band band--black hero" id="top">
      <div className="wrap hero__grid">
        <div>
          <p className="kicker hero__in" style={d(0)}>// Kumasi, Ghana</p>
          <h1 className="hero__title hero__in" style={d(1)}>
            <span>Ahlaam</span> <span className="outline">Abdallah</span>
          </h1>
          <div className="hero__in" style={d(2)}>
            <EditableText id="home:hero:title" as="p" className="roles" value="Computer Science, Cybersecurity & Human-Centred Computing" />
          </div>
          <div className="hero__in" style={d(3)}>
            <EditableText id="home:hero:lede" as="p" className="lede" multiline value="I'm Ahlaam Abdallah, a KNUST computer science graduate. I build systems, break practice targets on purpose, teach, and write about the gap between what a system requires and what people can actually understand." />
          </div>
          <div className="actions hero__in" style={d(4)}>
            <Link className="btn" href="/cyber-lab">Read the lab notes</Link>
            <a className="btn btn--ghost" href="#contact">Get in touch</a>
          </div>
          <div className="hero__in" style={d(5)}>
            <EditableText id="home:hero:tags" className="mono hero__tags" value="Ghana, Computer Science, Cybersecurity, HCI, AI" />
          </div>
        </div>
        <div className="hero__in" style={d(3)}>
          <Terminal lines={terminal} label="A terminal introducing Ahlaam: computer science graduate from KNUST focused on cybersecurity, HCI, secure AI and technical writing." />
        </div>
      </div>
      <a href="#about" className="scroll-cue" aria-label="Scroll to About"><span /></a>
    </section>

    {/* PRACTICE STRIP */}
    <section className="band band--bold strip" aria-label="Platforms and tools I practise with">
      <p className="kicker wrap">Where I practise</p>
      <Marquee items={PRACTICE} />
    </section>

    <Currently />

    {/* ABOUT */}
    <section className="band band--bright" id="about">
      <div className="wrap about">
        <div className="about__photo" data-reveal>
          <AvatarUpload />
        </div>
        <div>
          <div data-reveal>
            <p className="kicker">{site.name} AKA</p>
            <h2 className="display about__handle">{site.handle}</h2>
          </div>
          <div data-reveal style={d(1)}>
            <h3 className="subhead">Training and direction</h3>
            <EditableText id="home:about:p1" multiline value="My computer science training taught me how to build computational systems. My cybersecurity practice taught me to question those systems. My teaching and writing experience taught me that a technically correct solution isn't automatically a useful one." />
            <EditableText id="home:about:p2" multiline value="That intersection of cybersecurity, HCI and secure AI, held together by technical communication, now shapes the work I want to pursue." />
          </div>
        </div>
      </div>
      <dl className="wrap stats">
        {stats.map(([n, l], i) => (
          <div key={l} data-reveal style={d(i)}><dt>{l}</dt><dd>{n}</dd></div>
        ))}
      </dl>
    </section>

    {/* SKILLS */}
    <section className="band band--black" id="skills">
      <div className="wrap">
        <header className="section-head" data-reveal>
          <p className="kicker">Toolkit</p>
          <h2 className="display">Tools I use</h2>
        </header>
        <SkillsGrid defaultValue={SKILLS} />
      </div>
    </section>

    {/* SELECTED WORK */}
    <section className="band band--bold" id="projects">
      <div className="wrap">
        <header className="section-head" data-reveal>
          <p className="kicker">Built &amp; investigated</p>
          <h2 className="display">Selected work</h2>
        </header>
        <div className="feature-grid">
          <Link className="feature" href="/projects/petanqueai" data-reveal>
            <span className="feature__index">01</span>
            <p className="kicker">Final-year project · 2025</p>
            <h3>PetanqueAI</h3>
            <p>Tournament management for four formats, plus a Random Forest model that predicts scores.</p>
            <span className="arrow" aria-hidden>→</span>
          </Link>
          <Link className="feature" href="/cyber-lab/apache-cve-2021-41773" data-reveal style={d(1)}>
            <span className="feature__index">02</span>
            <p className="kicker">Cyber Lab · Full write-up</p>
            <h3>Apache Instance Compromise</h3>
            <p>CVE-2021-41773 path traversal chained to a root shell via a sudo/cpio misconfiguration.</p>
            <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>

    {/* LABS */}
    <section className="band band--black" id="labs">
      <div className="wrap">
        <header className="section-head section-head--row" data-reveal>
          <div>
            <p className="kicker">Cyber Lab</p>
            <h2 className="display">Targets I&apos;ve broken</h2>
          </div>
          <Link className="btn btn--ghost" href="/cyber-lab">All lab entries</Link>
        </header>
        <ul className="rows">
          {liveLabs.map((l, i) => (
            <li key={l.slug} data-reveal style={d(i % 4)}>
              <Link href={`/cyber-lab/${l.slug}`} className="row">
                <span className="mono">{l.platform}</span>
                <span className="row__title">{l.title}</span>
                <span className={`status${'full' in l && l.full ? ' status--done' : ''}`}>{l.status}</span>
                <span className="arrow" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* WRITING */}
    <section className="band band--bright" id="writing">
      <div className="wrap">
        <header className="section-head section-head--row" data-reveal>
          <div>
            <p className="kicker">{liveWriting.length}+ notes from the field</p>
            <h2 className="display">From the archive</h2>
          </div>
          <div className="actions actions--tight">
            <Link className="btn" href="/writing">Open the archive</Link>
            <a className="btn btn--ghost" href="/feed.xml">RSS</a>
          </div>
        </header>
        <div className="card-grid card-grid--2">
          {featured.map((p, i) => (
            <Link key={p.slug} href={`/writing/${p.slug}`} className="post" data-reveal style={d(i % 2)}>
              <p className="mono">{p.category} · {p.mins} min read</p>
              <h3>{p.title}</h3>
              <p className="post__excerpt">{excerpt(p.content)}…</p>
              <span className="post__more">Read <span aria-hidden>→</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* EXPERIENCE */}
    <section className="band band--black" id="experience">
      <div className="wrap">
        <header className="section-head" data-reveal>
          <p className="kicker">Experience</p>
          <h2 className="display">Where I have worked</h2>
        </header>
        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.org} data-reveal>
              <p className="mono timeline__when">{e.when}</p>
              <div>
                <h3>{e.role}</h3>
                <p className="timeline__org">{e.org}</p>
                <EditableText id={`home:experience:${e.org}`} className="muted" multiline value={e.bullets.join(' ')} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* RESEARCH */}
    <section className="band band--bold" id="research">
      <div className="wrap narrow">
        <header className="section-head" data-reveal>
          <p className="kicker">Research agenda</p>
          <h2 className="display">Questions I want to investigate next</h2>
        </header>
        {research.map((r) => (
          <details key={r.id} className="accordion" data-reveal>
            <summary><span className="mono">{r.id}</span>{r.title}</summary>
            <EditableList id={`home:research:${r.id}`} value={r.qs.map((q) => `- ${q}`).join('\n')} />
          </details>
        ))}
        <p className="muted small" style={{ marginTop: '1rem' }}>This is an agenda, not a publication record.</p>
      </div>
    </section>

    {/* CONTACT */}
    <section className="band band--black contact" id="contact">
      <div className="wrap contact__grid">
        <div>
          <p className="kicker" data-reveal>Contact</p>
          <h2 className="display display--xl" data-reveal>Let&apos;s talk</h2>
          <a className="contact__email" href={`mailto:${site.email}`} data-reveal>{site.email}</a>
          <p className="mono" data-reveal>
            <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a> · <a href={site.github}>GitHub</a> · <a href={site.linkedin}>LinkedIn</a>
          </p>
          <div data-reveal>
            <EditableText id="home:contact:note" className="muted" multiline value="Off the clock: British podcasts, Qur'an competitions, fiction. One day, a novel." />
          </div>
        </div>
        <div className="contact__form" data-reveal style={d(1)}>
          <h3 className="subhead">Send a message</h3>
          <ContactForm />
        </div>
      </div>
    </section>
  </>);
}
