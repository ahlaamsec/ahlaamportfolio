import { certs, experience, leadership, education, languages } from '@/content/data';
import { getOverrides } from '@/lib/store';
import { profileFrom } from '@/lib/profile';
import EditableText from '@/components/EditableText';
import CertList from '@/components/CertList';
import EditableList from '@/components/EditableList';
import PageHead from '@/components/PageHead';

export const metadata = { title: 'CV | Ahlaam Abdallah' };

export const dynamic = 'force-dynamic';

export default async function CV() {
  const site = profileFrom(await getOverrides());
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
          <EditableText id="cv:title:education" as="h2" className="doc-block__title" value="Education" />
          <div className="doc-block__body">
            <h3>{education.school}</h3>
            <EditableText id="cv:education:standing" value={`${education.degree}. ${education.standing}.`} />
            <EditableText id="cv:education:coursework" className="muted small" multiline value={`Relevant coursework: ${education.coursework}`} />
          </div>
        </section>

        <section className="doc-block" data-reveal>
          <EditableText id="cv:title:experience" as="h2" className="doc-block__title" value="Experience" />
          <ol className="timeline timeline--compact doc-block__body">
            {experience.map((e) => (
              <li key={e.org}>
                <EditableText id={`cv:experience:${e.org}:when`} className="mono timeline__when" value={e.when} />
                <div>
                  <EditableText id={`cv:experience:${e.org}:role`} as="h3" value={e.role} />
                  <p className="timeline__org">{e.org}</p>
                  <EditableList id={`cv:experience:${e.org}`} value={e.bullets.map((b) => `- ${b}`).join('\n')} />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="doc-block" data-reveal>
          <EditableText id="cv:title:leadership" as="h2" className="doc-block__title" value="Leadership & community" />
          <div className="doc-block__body">
            <div className="card-grid card-grid--2">
              {leadership.map((l) => (
                <div className="card" key={l.org + l.role}>
                  <EditableText id={`cv:leadership:${l.org}:role`} as="h3" value={l.role} />
                  <p className="mono">{l.org}{l.when ? ` · ${l.when}` : ''}</p>
                  {l.note && <EditableText id={`cv:leadership:${l.org}`} className="muted small" multiline value={l.note} />}
                </div>
              ))}
            </div>
            <EditableText id="cv:leadership:note" className="muted small" multiline value="Also: Muslim Girl Codes co-founder; founder of I Am Just a Girl (1,060+ followers, down from a peak of 1,660)." />
          </div>
        </section>

        <section className="doc-block" id="certs" data-reveal>
          <EditableText id="cv:title:certs" as="h2" className="doc-block__title" value="Certifications & training" />
          <CertList value={certs.map((c) => `- ${c.name} — ${c.issuer}`).join('\n')} />
        </section>

        <section className="doc-block" data-reveal>
          <EditableText id="cv:title:languages" as="h2" className="doc-block__title" value="Languages" />
          <div className="doc-block__body">
            <EditableText id="cv:languages" value={languages.join(', ')} />
          </div>
        </section>
      </div>
    </section>
  </>);
}
