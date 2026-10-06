import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { site } from '@/content/data';
import ContentProvider from '@/components/ContentProvider';
import EditModeProvider from '@/components/EditModeProvider';
import EditModeToggle from '@/components/EditModeToggle';
import AddEntryButton from '@/components/AddEntryButton';
export const metadata: Metadata = {
  title: 'Ahlaam Abdallah | Cybersecurity and Human-Centred Computing, KNUST',
  description: 'Computer Science graduate from KNUST, Ghana, working on cybersecurity, HCI, secure AI and technical communication.',
};
const nav: [string, string][] = [['About', '/#about'], ['Skills', '/#skills'], ['Projects', '/#projects'], ['Cyber Lab', '/cyber-lab'], ['Writing', '/writing'], ['Experience', '/#experience'], ['Contact', '/#contact']];
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>
    <ContentProvider>
    <EditModeProvider>
      <a className="skip" href="#main">Skip to content</a>
      <header className="bar"><div className="bar-inner">
        <Link href="/" className="brand"><span className="dot">A</span> Ahlaam Abdallah</Link>
        <nav aria-label="Main"><ul>{nav.map(([l, h]) => <li key={l}><Link href={h}>{l}</Link></li>)}</ul></nav>
        <Link href="/cv" className="cta">Get CV</Link>
      </div></header>
      <main id="main">{children}</main>
      <footer>Kumasi, Ghana · Last updated: September 2026</footer>
      <EditModeToggle />
      <AddEntryButton />
    </EditModeProvider>
    </ContentProvider>
  </body></html>);
}
