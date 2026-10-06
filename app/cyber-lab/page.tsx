import { labs } from '@/content/data';
import LabsGrid from '@/components/LabsGrid';
export const metadata = { title: 'Cyber Lab | Ahlaam Abdallah' };
export default function Lab() {
  return (<article>
    <p className="eyebrow">Cyber Lab</p><h1>Proof over adjectives.</h1>
    <p className="lede">Each entry becomes a full case study once its evidence is added; until then it says so plainly.</p>
    <LabsGrid staticLabs={labs} />
  </article>);
}
