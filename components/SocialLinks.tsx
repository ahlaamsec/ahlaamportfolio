import { site } from '@/content/data';

export default function SocialLinks() {
  const links: [string, string][] = [
    ['GitHub', site.github],
    ['LinkedIn', site.linkedin],
    ['Email', `mailto:${site.email}`],
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
