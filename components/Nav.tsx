'use client';
import Link from 'next/link';
import { useContent } from './ContentProvider';
import { NAV_ITEMS, BRAND_NAME, CTA_LABEL } from '@/lib/nav';

export default function Nav() {
  const { overrides } = useContent();
  const brand = overrides['nav:brand'] || BRAND_NAME;
  const cta = overrides['nav:cta'] || CTA_LABEL;
  return (
    <header className="bar"><div className="bar-inner">
      <Link href="/" className="brand"><span className="dot">{brand.trim().charAt(0).toUpperCase() || 'A'}</span> {brand}</Link>
      <nav aria-label="Main"><ul>
        {NAV_ITEMS.map((n) => <li key={n.key}><Link href={n.href}>{overrides[`nav:${n.key}`] || n.label}</Link></li>)}
      </ul></nav>
      <Link href="/cv" className="cta">{cta}</Link>
    </div></header>
  );
}
