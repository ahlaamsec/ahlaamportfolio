import Link from 'next/link';
import EditableText from '@/components/EditableText';
export const metadata = { title: 'PetanqueAI case study | Ahlaam Abdallah' };
const s: [string, string, string][] = [
  ['problem', 'Problem', 'Running a pétanque tournament by hand means tracking teams, brackets and scores across several formats.'],
  ['system', 'System', 'Next.js frontend, a Python/Flask and FastAPI backend, MongoDB (NoSQL) as the primary data store, with PostgreSQL and SQLAlchemy also part of the stack per the CV. Supports single elimination, round robin, double elimination and Swiss.'],
  ['data', 'Data', 'Wikipedia-derived, NBA-derived and generated data. About 1,213 records before cleaning, about 714 usable after, split roughly 571 train / 143 test.'],
  ['model', 'Model', 'Random Forest Regressor predicting scores for teams, players and stages. It does not predict ball positions.'],
  ['engineering', 'Engineering', 'TODO: add the decisions you remember: bracket logic, service boundaries, schema choices.'],
  ['limitations', 'Limitations', 'Part of the training data is not from pétanque. No accuracy figures are reported here because none have been supplied, and it was not deployed at production scale.'],
  ['learned', 'What I learned', 'TODO'],
  ['changed', 'What I would change', 'TODO'],
];
export default function P() {
  return (<article>
    <p><Link href="/#projects">&larr; Projects</Link></p>
    <p className="eyebrow">KNUST final-year project · 2025</p><h1>PetanqueAI</h1>
    {s.map(([id, h, t], i) => <details key={id} open={i < 2}>
      <summary>{h}</summary>
      <EditableText id={`project:petanqueai:${id}`} multiline value={t} />
    </details>)}
  </article>);
}
