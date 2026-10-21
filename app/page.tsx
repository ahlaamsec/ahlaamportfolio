import Link from 'next/link';
import { research, labs, experience, fullWriting, certs, languages } from '@/content/data';
import { getCustomLabs, getCustomWriting, getDeletedIds, getOverrides } from '@/lib/store';
import { profileFrom, isHidden, withWritingMeta, withLabMeta, FEATURED } from '@/lib/profile';
import EditableText from '@/components/EditableText';
import EditableList from '@/components/EditableList';
import AvatarUpload from '@/components/AvatarUpload';
import Currently from '@/components/Currently';
import ContactForm from '@/components/ContactForm';
import SkillsGrid from '@/components/SkillsGrid';
import Terminal from '@/components/Terminal';
import PracticeStrip from '@/components/PracticeStrip';

export const dynamic = 'force-dynamic';

const SKILLS = 'Python, SQL, JavaScript, Nmap, Burp Suite, Kali Linux, MongoDB, Flask / FastAPI, Next.js, Machine Learning, Linux, Teaching';
const PRACTICE = 'BCTF, EchoCTF, TryHackMe, Kioptrix, Burp Suite, Nmap, Kali Linux, Metasploit, GTFOBins, searchsploit';

const d = (n: number) => ({ '--d': n } as React.CSSProperties);
const excerpt = (content: string[]) => (content.find((b) => !b.startsWith('![') && !b.startsWith('#')) || '').slice(0, 140);

// Small helper so every heading and label on this page is editable in place.
const T = (id: string, value: string, props: Partial<React.ComponentProps<typeof EditableText>> = {}) => (
  <EditableText id={`home:${id}`} value={value} {...props} />
);

export default async function Home() {
  const [deleted, customWriting, customLabs, overrides] = await Promise.all([getDeletedIds(), getCustomWriting(), getCustomLabs(), getOverrides()]);
  const profile = profileFrom(overrides);
  const show = (key: string) => !isHidden(overrides, key);
  const liveWriting = [...customWriting, ...fullWriting].filter((p) => !deleted.includes(`writing:${p.slug}`)).map((p) => withWritingMeta(p, overrides));
  const featuredSlugs = (overrides['home:featured'] || '').split(',').map((s) => s.trim()).filter(Boolean);
  const featured = (featuredSlugs.length ? featuredSlugs : FEATURED)
    .map((slug) => liveWriting.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const liveLabs = [...customLabs, ...labs].filter((l) => !deleted.includes(`lab:${l.slug}`)).map((l) => withLabMeta(l, overrides));
  const stats: [string, string | number, string][] = [
    ['writing', `${liveWriting.length}+`, 'pieces written'],
    ['labs', liveLabs.length, 'cyber labs'],
    ['certs', certs.length, 'certifications'],
    ['languages', languages.length, 'languages spoken'],
  ];
  const [first, ...rest] = profile.name.trim().split(/\s+/);
  const terminal = [
    { cmd: 'whoami', out: overrides['home:terminal:whoami'] || `${profile.name.toLowerCase()} · cs grad, KNUST` },
    { cmd: 'cat focus.txt', out: overrides['home:terminal:focus'] || 'cybersecurity · hci · secure ai · technical writing' },
    { cmd: 'ls ./labs', out: liveLabs.map((l) => l.slug).join('  ') },
    { cmd: 'wc -l ./writing/*', out: `${liveWriting.length} pieces and counting` },
  ];

  return (<>
    {/* HERO */}
    <section className="band band--black hero" id="top">
      <div className="wrap hero__grid">
        <div>
          <p className="kicker hero__in" style={d(0)}>// {profile.location}</p>
          <h1 className="hero__title hero__in" style={d(1)}>
            <span>{first}</span> <span className="outline">{rest.join(' ')}</span>
          </h1>
          <div className="hero__in" style={d(2)}>
            {T('hero:title', 'Computer Science, Cybersecurity & Human-Centred Computing', { as: 'p', className: 'roles' })}
          </div>
          <div className="hero__in" style={d(3)}>
            {T('hero:lede', "I'm Ahlaam Abdallah, a KNUST computer science graduate. I build systems, break practice targets on purpose, teach, and write about the gap between what a system requires and what people can actually understand.", { as: 'p', className: 'lede', multiline: true })}
          </div>
          <div className="actions hero__in" style={d(4)}>
            <Link className="btn" href="/cyber-lab">{T('btn:labnotes', 'Read the lab notes', { as: 'span', inLink: true })}</Link>
            <a className="btn btn--ghost" href="#contact">{T('btn:contact', 'Get in touch', { as: 'span', inLink: true })}</a>
          </div>
          <div className="hero__in" style={d(5)}>
            {T('hero:tags', 'Ghana, Computer Science, Cybersecurity, HCI, AI', { className: 'mono hero__tags' })}
          </div>
        </div>
        <div className="hero__in" style={d(3)}>
          <Terminal lines={terminal} label={`A terminal introducing ${profile.name}: ${terminal[1].out}.`} />
        </div>
      </div>
      <a href="#about" className="scroll-cue" aria-label="Scroll to About"><span /></a>
    </section>

    {/* PRACTICE STRIP */}
    {show('strip') && (
      <section className="band band--bold strip" aria-label="Platforms and tools I practise with">
        <div className="wrap">{T('strip:kicker', 'Where I practise', { className: 'kicker' })}</div>
        <PracticeStrip defaultValue={PRACTICE} />
      </section>
    )}

    {show('now') && <Currently />}

    {/* ABOUT */}
    {show('about') && (
      <section className="band band--bright" id="about">
        <div className="wrap about">
          <div className="about__photo" data-reveal>
            <AvatarUpload />
          </div>
          <div>
            <div data-reveal>
              <p className="kicker">{profile.name} AKA</p>
              <h2 className="display about__handle">{profile.handle}</h2>
            </div>
            <div data-reveal style={d(1)}>
              {T('about:heading', 'Training and direction', { as: 'h3', className: 'subhead' })}
              {T('about:p1', "My computer science training taught me how to build computational systems. My cybersecurity practice taught me to question those systems. My teaching and writing experience taught me that a technically correct solution isn't automatically a useful one.", { multiline: true })}
              {T('about:p2', 'That intersection of cybersecurity, HCI and secure AI, held together by technical communication, now shapes the work I want to pursue.', { multiline: true })}
            </div>
          </div>
        </div>
        <dl className="wrap stats">
          {stats.map(([key, n, l], i) => (
            <div key={key} data-reveal style={d(i)}><dt>{T(`stats:${key}`, l, { as: 'span' })}</dt><dd>{n}</dd></div>
          ))}
        </dl>
      </section>
    )}

    {/* SKILLS */}
    {show('skills') && (
      <section className="band band--black" id="skills">
        <div className="wrap">
          <header className="section-head" data-reveal>
            {T('skills:kicker', 'Toolkit', { className: 'kicker' })}
            {T('skills:title', 'Tools I use', { as: 'h2', className: 'display' })}
          </header>
          <SkillsGrid defaultValue={SKILLS} />
        </div>
      </section>
    )}

    {/* SELECTED WORK */}
    {show('projects') && (
      <section className="band band--bold" id="projects">
        <div className="wrap">
          <header className="section-head" data-reveal>
            {T('projects:kicker', 'Built & investigated', { className: 'kicker' })}
            {T('projects:title', 'Selected work', { as: 'h2', className: 'display' })}
          </header>
          <div className="feature-grid">
            <Link className="feature" href="/projects/petanqueai" data-reveal>
              <span className="feature__index">01</span>
              {T('projects:1:kicker', 'Final-year project · 2025', { className: 'kicker', inLink: true })}
              {T('projects:1:title', 'PetanqueAI', { as: 'h3', inLink: true })}
              {T('projects:1:text', 'Tournament management for four formats, plus a Random Forest model that predicts scores.', { multiline: true, inLink: true })}
              <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link className="feature" href="/cyber-lab/apache-cve-2021-41773" data-reveal style={d(1)}>
              <span className="feature__index">02</span>
              {T('projects:2:kicker', 'Cyber Lab · Full write-up', { className: 'kicker', inLink: true })}
              {T('projects:2:title', 'Apache Instance Compromise', { as: 'h3', inLink: true })}
              {T('projects:2:text', 'CVE-2021-41773 path traversal chained to a root shell via a sudo/cpio misconfiguration.', { multiline: true, inLink: true })}
              <span className="arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    )}

    {/* LABS */}
    {show('labs') && (
      <section className="band band--black" id="labs">
        <div className="wrap">
          <header className="section-head section-head--row" data-reveal>
            <div>
              {T('labs:kicker', 'Cyber Lab', { className: 'kicker' })}
              {T('labs:title', "Targets I've broken", { as: 'h2', className: 'display' })}
            </div>
            <Link className="btn btn--ghost" href="/cyber-lab">{T('btn:alllabs', 'All lab entries', { as: 'span', inLink: true })}</Link>
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
    )}

    {/* WRITING */}
    {show('writing') && (
      <section className="band band--bright" id="writing">
        <div className="wrap">
          <header className="section-head section-head--row" data-reveal>
            <div>
              <p className="kicker">{liveWriting.length}+ notes from the field</p>
              {T('writing:title', 'From the archive', { as: 'h2', className: 'display' })}
            </div>
            <div className="actions actions--tight">
              <Link className="btn" href="/writing">{T('btn:archive', 'Open the archive', { as: 'span', inLink: true })}</Link>
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
    )}

    {/* EXPERIENCE */}
    {show('experience') && (
      <section className="band band--black" id="experience">
        <div className="wrap">
          <header className="section-head" data-reveal>
            {T('experience:kicker', 'Experience', { className: 'kicker' })}
            {T('experience:title', 'Where I have worked', { as: 'h2', className: 'display' })}
          </header>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.org} data-reveal>
                {T(`experience:${e.org}:when`, e.when, { className: 'mono timeline__when' })}
                <div>
                  {T(`experience:${e.org}:role`, e.role, { as: 'h3' })}
                  <p className="timeline__org">{e.org}</p>
                  <EditableText id={`home:experience:${e.org}`} className="muted" multiline value={e.bullets.join(' ')} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )}

    {/* RESEARCH */}
    {show('research') && (
      <section className="band band--bold" id="research">
        <div className="wrap narrow">
          <header className="section-head" data-reveal>
            {T('research:kicker', 'Research agenda', { className: 'kicker' })}
            {T('research:title', 'Questions I want to investigate next', { as: 'h2', className: 'display' })}
          </header>
          {research.map((r) => (
            <details key={r.id} className="accordion" data-reveal>
              <summary><span className="mono">{r.id}</span>{T(`research:${r.id}:title`, r.title, { as: 'span', inLink: true })}</summary>
              <EditableList id={`home:research:${r.id}`} value={r.qs.map((q) => `- ${q}`).join('\n')} />
            </details>
          ))}
          {T('research:note', 'This is an agenda, not a publication record.', { className: 'muted small' })}
        </div>
      </section>
    )}

    {/* CONTACT */}
    {show('contact') && (
      <section className="band band--black contact" id="contact">
        <div className="wrap contact__grid">
          <div>
            <p className="kicker" data-reveal>Contact</p>
            {T('contact:title', "Let's talk", { as: 'h2', className: 'display display--xl' })}
            <a className="contact__email" href={`mailto:${profile.email}`} data-reveal>{profile.email}</a>
            <p className="mono" data-reveal>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a> · <a href={profile.github}>GitHub</a> · <a href={profile.linkedin}>LinkedIn</a>
            </p>
            <div data-reveal>
              {T('contact:note', "Off the clock: British podcasts, Qur'an competitions, fiction. One day, a novel.", { className: 'muted', multiline: true })}
            </div>
          </div>
          <div className="contact__form" data-reveal style={d(1)}>
            {T('contact:formtitle', 'Send a message', { as: 'h3', className: 'subhead' })}
            <ContactForm />
          </div>
        </div>
      </section>
    )}
  </>);
}
