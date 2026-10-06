import Archive from '@/components/Archive';
import { writing } from '@/content/data';
export const metadata = { title: 'Writing Archive | Ahlaam Abdallah' };
export default function W() {
  return (<article>
    <p className="eyebrow">100+ Notes From the Field</p><h1>The Writing Archive</h1>
    <p className="lede">Essays and technical notes on human behaviour, communication, cybersecurity and career, pulled from 100+ days of writing. Published pieces are linked; the rest are still to come.</p>
    <div style={{ marginTop: '1.5rem' }}><Archive items={writing} /></div>
  </article>);
}
