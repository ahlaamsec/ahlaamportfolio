import { certs, site, experience, leadership, education, languages } from '@/content/data';
import EditableText from '@/components/EditableText';
export const metadata = { title: 'CV | Ahlaam Abdallah' };
export default function CV() {
  return (<article>
    <p className="eyebrow">CV</p><h1>Ahlaam Abdallah</h1>
    <div className="hero-actions">
      <a className="btn" href={site.cv}>Download CV (PDF)</a>
    </div>
    <p className="note" style={{ marginTop: '.8rem' }}>{site.email} · {site.phone} · <a href={site.github}>GitHub</a> · <a href={site.linkedin}>LinkedIn</a></p>

    <section><h2>Education</h2><div className="card">
      <p>{education.school}</p>
      <EditableText id="cv:education:standing" value={`${education.degree}. ${education.standing}.`} />
      <EditableText id="cv:education:coursework" className="note" multiline value={`Relevant coursework: ${education.coursework}`} />
    </div></section>

    <section><h2>Experience</h2>
      <div className="timeline">{experience.map(e => <div className="item" key={e.org}>
        <p className="when">{e.when}</p><h3>{e.role}, {e.org}</h3>
        <EditableText id={`cv:experience:${e.org}`} multiline value={e.bullets.map(b => `- ${b}`).join('\n')} />
      </div>)}</div>
    </section>

    <section><h2>Leadership &amp; Community</h2>
      <div className="grid cols-2">{leadership.map(l => <div className="card" key={l.org + l.role}>
        <h3>{l.role}</h3><p className="note">{l.org}{l.when ? ` · ${l.when}` : ''}</p>
        {l.note && <EditableText id={`cv:leadership:${l.org}`} multiline value={l.note} />}
      </div>)}</div>
      <EditableText id="cv:leadership:note" className="note" multiline value="Also: Muslim Girl Codes co-founder; founder of I Am Just a Girl (1,060+ followers, down from a peak of 1,660)." />
    </section>

    <section id="certs"><h2>Certifications &amp; Training</h2>
      <div className="grid cols-3">{certs.map(c => <div className="card" key={c.name}><h3>{c.name}</h3><p className="note">{c.issuer}</p></div>)}</div>
    </section>

    <section><h2>Languages</h2>
      <EditableText id="cv:languages" value={languages.join(', ')} />
    </section>
  </article>);
}
