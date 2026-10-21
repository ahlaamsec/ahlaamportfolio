'use client';
import { useContent } from './ContentProvider';
import { profileFrom } from '@/lib/profile';

export default function SocialLinks() {
  const { overrides } = useContent();
  const p = profileFrom(overrides);
  const links: [string, string][] = [
    ['GitHub', p.github],
    ['LinkedIn', p.linkedin],
    ['Email', `mailto:${p.email}`],
  ];
  return (
    <ul className="socials">
      {links.map(([label, href]) => (
        <li key={label}>
          <a href={href} className="pill" {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a>
        </li>
      ))}
    </ul>
  );
}
