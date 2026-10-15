import Archive from '@/components/Archive';
import PageHead from '@/components/PageHead';
import { writing } from '@/content/data';

export const metadata = { title: 'Writing Archive | Ahlaam Abdallah' };

export default function W() {
  // Only list metadata goes to the browser, not the full text of every piece.
  const items = writing.map((p) => ({
    title: p.title, date: p.date, category: p.category, type: p.type, tags: p.tags, mins: p.mins, status: p.status,
    slug: 'slug' in p ? (p.slug as string) : undefined,
  }));
  return (<>
    <PageHead
      kicker="100+ notes from the field"
      title="The writing archive"
      lede="Essays and technical notes on human behaviour, communication, cybersecurity and career, pulled from 100+ days of writing."
    />
    <section className="band band--bold">
      <div className="wrap"><Archive items={items} /></div>
    </section>
  </>);
}
