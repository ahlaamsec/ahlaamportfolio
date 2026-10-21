import type { Metadata } from 'next';
import './globals.css';
import { display, body, mono } from '@/lib/fonts';
import ContentProvider from '@/components/ContentProvider';
import EditModeProvider from '@/components/EditModeProvider';
import EditModeToggle from '@/components/EditModeToggle';
import AddEntryButton from '@/components/AddEntryButton';
import UploadPanel from '@/components/UploadPanel';
import Nav from '@/components/Nav';
import ThemeInjector from '@/components/ThemeInjector';
import SiteSettingsButton from '@/components/SiteSettingsButton';
import RevealObserver from '@/components/RevealObserver';
import SiteFooter from '@/components/SiteFooter';
import VisitTracker from '@/components/VisitTracker';

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
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Scroll-reveal hides content only when JS runs. If the app never starts
            (blocked or failed script), the class is removed so nothing stays hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');setTimeout(function(){if(!window.__reveal)document.documentElement.classList.remove('js')},2500)" }} />
      </head>
      <body>
        <ContentProvider>
          <EditModeProvider>
            <a className="skip" href="#main">Skip to content</a>
            <ThemeInjector />
            <Nav />
            <main id="main">{children}</main>
            <SiteFooter />
            <RevealObserver />
            <VisitTracker />
            <EditModeToggle />
            <AddEntryButton />
            <UploadPanel />
            <SiteSettingsButton />
          </EditModeProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
