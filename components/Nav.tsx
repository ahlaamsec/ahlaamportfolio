'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from './ContentProvider';
import SocialLinks from './SocialLinks';
import { NAV_ITEMS, BRAND_NAME, CTA_LABEL } from '@/lib/nav';

export default function Nav() {
  const { overrides } = useContent();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brand = overrides['nav:brand'] || BRAND_NAME;
  const cta = overrides['nav:cta'] || CTA_LABEL;
  const initials = brand.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'A';
  const items = NAV_ITEMS.map((n) => ({ ...n, label: overrides[`nav:${n.key}`] || n.label }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header${scrolled || open ? ' is-solid' : ''}`}>
      <div className="wrap site-header__inner">
        <Link href="/" className="brand" aria-label={`${brand}, home`}>
          <span className="brand__mark" aria-hidden>{initials}</span>
          <span className="brand__name">{brand}</span>
        </Link>
        <nav aria-label="Main" className="site-nav">
          <ul>{items.map((n) => <li key={n.key}><Link href={n.href}>{n.label}</Link></li>)}</ul>
        </nav>
        <Link href="/cv" className="btn btn--sm site-header__cta">{cta}</Link>
        <button
          type="button"
          className={`menu-toggle${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="menu-toggle__bar" aria-hidden />
          <span className="menu-toggle__bar" aria-hidden />
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {[...items, { key: 'cv', label: cta, href: '/cv' }].map((n, i) => (
              <li key={n.key} style={{ '--i': i } as React.CSSProperties}>
                <Link href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks />
      </div>
    </header>
  );
}
