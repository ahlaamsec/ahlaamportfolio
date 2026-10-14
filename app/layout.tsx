import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/content/data';
import ContentProvider from '@/components/ContentProvider';
import EditModeProvider from '@/components/EditModeProvider';
import EditModeToggle from '@/components/EditModeToggle';
import AddEntryButton from '@/components/AddEntryButton';
import UploadPanel from '@/components/UploadPanel';
import Nav from '@/components/Nav';
import ThemeInjector from '@/components/ThemeInjector';
import SiteSettingsButton from '@/components/SiteSettingsButton';
import EditableText from '@/components/EditableText';
const siteUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ahlaam Abdallah | Cybersecurity and Human-Centred Computing, KNUST',
  description: 'Computer Science graduate from KNUST, Ghana, working on cybersecurity, HCI, secure AI and technical communication.',
  openGraph: { title: 'Ahlaam Abdallah', description: 'Cybersecurity, human-centred computing and technical writing.', type: 'website', siteName: 'Ahlaam Abdallah' },
  twitter: { card: 'summary_large_image', title: 'Ahlaam Abdallah', description: 'Cybersecurity, human-centred computing and technical writing.' },
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
};
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>
    <ContentProvider>
    <EditModeProvider>
      <a className="skip" href="#main">Skip to content</a>
      <ThemeInjector />
      <Nav />
      <main id="main">{children}</main>
      <footer><EditableText id="footer:note" value="Kumasi, Ghana · Last updated: September 2026" /></footer>
      <EditModeToggle />
      <AddEntryButton />
      <UploadPanel />
      <SiteSettingsButton />
    </EditModeProvider>
    </ContentProvider>
  </body></html>);
}
