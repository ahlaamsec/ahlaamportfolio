import { certs, site, experience, leadership, education, languages } from '@/content/data';
import EditableText from '@/components/EditableText';
import EditableList from '@/components/EditableList';
import PageHead from '@/components/PageHead';

export const metadata = { title: 'CV | Ahlaam Abdallah' };

export default function CV() {
  return (<>
    <PageHead kicker="Curriculum vitae" title={site.name}>
      <div className="actions hero__in" style={{ '--d': 2 } as React.CSSProperties}>
        <a className="btn" href={site.cv}>Download CV (PDF)</a>
        <a className="btn btn--ghost" href={`mailto:${site.email}`}>{site.email}</a>
      </div>
      <p className="mono hero__in" style={{ '--d': 3, marginTop: '1.2rem' } as React.CSSProperties}>
        {site.phone} · <a href={site.github}>GitHub</a> · <a href={site.linkedin}>LinkedIn</a>
      </p>
    </PageHead>

    <section className="band band--bold">
      <div className="wrap narrow doc">
        <section className="doc-block" data-reveal>
          <h2 className="doc-block__title">Education</h2>
          <div className="doc-block__body">
            <h3>{education.school}</h3>
            <EditableText id="cv:education:standing" value={`${education.degree}. ${education.standing}.`} />
            <EditableText id="cv:education:coursework" className="muted small" multiline value={`Relevant coursework: ${education.coursework}`} />
          </div>
        </section>

        <section className="doc-block" data-reveal>
          <h2 className="doc-block__title">Experience</h2>
          <ol className="timeline timeline--compact doc-block__body">
            {experience.map((e) => (
              <li key={e.org}>
                <p className="mono timeline__when">{e.when}</p>
                <div>
                  <h3>{e.role}</h3>
                  <p className="timeline__org">{e.org}</p>
                  <EditableList id={`cv:experience:${e.org}`} value={e.bullets.map((b) => `- ${b}`).join('\n')} />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="doc-block" data-reveal>
          <h2 className="doc-block__title">Leadership &amp; community</h2>
          <div className="doc-block__body">
            <div className="card-grid card-grid--2">
              {leadership.map((l) => (
                <div className="card" key={l.org + l.role}>
                  <h3>{l.role}</h3>
                  <p className="mono">{l.org}{l.when ? ` · ${l.when}` : ''}</p>
                  {l.note && <EditableText id={`cv:leadership:${l.org}`} className="muted small" multiline value={l.note} />}
                </div>
              ))}
            </div>
            <EditableText id="cv:leadership:note" className="muted small" multiline value="Also: Muslim Girl Codes co-founder; founder of I Am Just a Girl (1,060+ followers, down from a peak of 1,660)." />
          </div>
        </section>

        <section className="doc-block" id="certs" data-reveal>
          <h2 className="doc-block__title">Certifications &amp; training</h2>
          <ul className="cert-list doc-block__body">
            {certs.map((c) => <li key={c.name}><span>{c.name}</span><span className="mono">{c.issuer}</span></li>)}
          </ul>
        </section>

        <section className="doc-block" data-reveal>
          <h2 className="doc-block__title">Languages</h2>
          <div className="doc-block__body">
            <EditableText id="cv:languages" value={languages.join(', ')} />
          </div>
        </section>
      </div>
    </section>
  </>);
}
