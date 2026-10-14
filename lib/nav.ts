export const NAV_ITEMS: { key: string; label: string; href: string }[] = [
  { key: 'about', label: 'About', href: '/#about' },
  { key: 'skills', label: 'Skills', href: '/#skills' },
  { key: 'projects', label: 'Projects', href: '/#projects' },
  { key: 'cyber', label: 'Cyber Lab', href: '/cyber-lab' },
  { key: 'writing', label: 'Writing', href: '/writing' },
  { key: 'experience', label: 'Experience', href: '/#experience' },
  { key: 'contact', label: 'Contact', href: '/#contact' },
];
export const BRAND_NAME = 'Ahlaam Abdallah';
export const CTA_LABEL = 'Get CV';

export const THEME_KEYS: { key: string; label: string; fallback: string }[] = [
  { key: 'bg', label: 'Page background', fallback: '#111219' },
  { key: 'surface', label: 'Cards', fallback: '#1b1d29' },
  { key: 'surface-2', label: 'Raised cards', fallback: '#22242f' },
  { key: 'ink', label: 'Main text', fallback: '#f2f2f5' },
  { key: 'mute', label: 'Soft text', fallback: '#9b9eb0' },
  { key: 'rule', label: 'Borders', fallback: '#2b2d3a' },
  { key: 'accent', label: 'Accent (buttons, links)', fallback: '#ff7a45' },
  { key: 'accent-ink', label: 'Text on accent', fallback: '#1a0f0a' },
];

export const THEME_PRESETS: { name: string; values: Record<string, string> }[] = [
  { name: 'Dark orange (original)', values: Object.fromEntries(THEME_KEYS.map((t) => [t.key, t.fallback])) },
  { name: 'Midnight blue', values: { bg: '#0b1020', surface: '#131a2e', 'surface-2': '#1b2440', ink: '#eef1fb', mute: '#93a0c2', rule: '#26304f', accent: '#4d8bff', 'accent-ink': '#04122e' } },
  { name: 'Forest', values: { bg: '#0e1512', surface: '#16201b', 'surface-2': '#1d2a24', ink: '#eef4ef', mute: '#9bb0a4', rule: '#27362e', accent: '#5fd97a', 'accent-ink': '#06150b' } },
  { name: 'Light paper', values: { bg: '#f6f3ee', surface: '#ffffff', 'surface-2': '#f1ede6', ink: '#1d1b18', mute: '#6b665d', rule: '#ddd6ca', accent: '#c93f12', 'accent-ink': '#ffffff' } },
];
