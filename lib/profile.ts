import { site } from '@/content/site';

// Contact details and links, editable from the dashboard. Stored as overrides
// under "profile:<key>"; an empty value falls back to content/data.ts.
export const PROFILE_FIELDS = [
  { key: 'name', label: 'Full name', fallback: site.name },
  { key: 'handle', label: 'Handle (the big "AKA" name)', fallback: site.handle },
  { key: 'location', label: 'Location', fallback: 'Kumasi, Ghana' },
  { key: 'email', label: 'Email', fallback: site.email },
  { key: 'phone', label: 'Phone', fallback: site.phone },
  { key: 'github', label: 'GitHub link', fallback: site.github },
  { key: 'linkedin', label: 'LinkedIn link', fallback: site.linkedin },
  { key: 'cv', label: 'CV file link', fallback: site.cv },
] as const;

export type Profile = Record<(typeof PROFILE_FIELDS)[number]['key'], string>;

const SAFE_URL = /^(https?:\/\/|\/|mailto:)/i;

export function profileFrom(overrides: Record<string, string>): Profile {
  const out = {} as Profile;
  for (const f of PROFILE_FIELDS) {
    const v = (overrides[`profile:${f.key}`] || '').trim();
    out[f.key] = v || f.fallback;
  }
  // Links must stay links; anything odd (e.g. "javascript:") falls back.
  for (const k of ['github', 'linkedin', 'cv'] as const) if (!SAFE_URL.test(out[k])) out[k] = PROFILE_FIELDS.find((f) => f.key === k)!.fallback;
  return out;
}

// Home page sections that can be hidden from the dashboard ("home:hide:<key>" = "1").
export const HOME_SECTIONS = [
  { key: 'strip', label: 'Where I practise (scrolling strip)' },
  { key: 'now', label: 'Currently' },
  { key: 'about', label: 'About and numbers' },
  { key: 'skills', label: 'Tools I use' },
  { key: 'projects', label: 'Selected work' },
  { key: 'labs', label: 'Cyber Lab list' },
  { key: 'writing', label: 'From the archive' },
  { key: 'experience', label: 'Experience' },
  { key: 'research', label: 'Research agenda' },
  { key: 'contact', label: 'Contact' },
] as const;

export const isHidden = (overrides: Record<string, string>, key: string) => overrides[`home:hide:${key}`] === '1';

// Editable details of each write-up and lab, layered over the stored values.
export const WRITING_META = ['title', 'category', 'type', 'date', 'tags'] as const;
export const LAB_META = ['title', 'platform', 'status', 'objective', 'tools'] as const;

const list = (s: string) => s.split(',').map((t) => t.trim()).filter(Boolean);

export function withWritingMeta<T extends { slug: string; title: string; category: string; type: string; date: string; tags: string[] }>(p: T, o: Record<string, string>): T {
  const g = (k: string) => (o[`writing:${p.slug}:${k}`] || '').trim();
  return {
    ...p,
    title: g('title') || p.title,
    category: g('category') || p.category,
    type: g('type') || p.type,
    date: g('date') || p.date,
    tags: g('tags') ? list(g('tags')) : p.tags,
  };
}

export function withLabMeta<T extends { slug: string; title: string; platform: string; status: string; objective: string; tools: string[] }>(l: T, o: Record<string, string>): T {
  const g = (k: string) => (o[`lab:${l.slug}:${k}`] || '').trim();
  return {
    ...l,
    title: g('title') || l.title,
    platform: g('platform') || l.platform,
    status: g('status') || l.status,
    objective: g('objective') || l.objective,
    tools: g('tools') ? list(g('tools')) : l.tools,
  };
}

// The four essays shown under "From the archive" unless changed in the dashboard ("home:featured").
export const FEATURED = ['diary-day39-reds-1', 'diary-day19-define-yourself-yinka', 'diary-day10', 'diary-day22-appreciation'];
