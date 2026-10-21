'use client';
import { useContent } from './ContentProvider';
import { profileFrom } from '@/lib/profile';
import SocialLinks from './SocialLinks';
import EditableText from './EditableText';

export default function SiteFooter() {
  const { overrides } = useContent();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <p className="site-footer__brand">{profileFrom(overrides).handle}</p>
        <SocialLinks />
        <EditableText id="footer:note" className="mono" value="Kumasi, Ghana" />
      </div>
    </footer>
  );
}
