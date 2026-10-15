import { labs } from '@/content/data';
import LabsGrid from '@/components/LabsGrid';
import PageHead from '@/components/PageHead';

export const metadata = { title: 'Cyber Lab | Ahlaam Abdallah' };

export default function Lab() {
  return (<>
    <PageHead
      kicker="Cyber Lab"
      title="Proof over adjectives"
      lede="Each entry becomes a full case study once its evidence is added; until then it says so plainly."
    />
    <section className="band band--bold">
      <div className="wrap"><LabsGrid staticLabs={labs} /></div>
    </section>
  </>);
}
