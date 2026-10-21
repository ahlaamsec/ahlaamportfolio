import EditableText from '@/components/EditableText';
import { labs } from '@/content/data';
import LabsGrid from '@/components/LabsGrid';
import PageHead from '@/components/PageHead';

export const metadata = { title: 'Cyber Lab | Ahlaam Abdallah' };

export default function Lab() {
  return (<>
    <PageHead
      kicker={<EditableText id="page:labs:kicker" as="span" value="Cyber Lab" />}
      title={<EditableText id="page:labs:title" as="span" value="Proof over adjectives" />}
      lede={<EditableText id="page:labs:lede" as="p" multiline value="Each entry becomes a full case study once its evidence is added; until then it says so plainly." />}
    />
    <section className="band band--bold">
      <div className="wrap"><LabsGrid staticLabs={labs} /></div>
    </section>
  </>);
}
