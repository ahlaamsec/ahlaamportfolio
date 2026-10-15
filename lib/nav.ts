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

// Colours for the dark sections. The light (off-white) sections keep their own
// paper palette but pick up the accent colour.
export const THEME_KEYS: { key: string; label: string; fallback: string }[] = [
  { key: 'bg', label: 'Page background', fallback: '#000000' },
  { key: 'surface', label: 'Cards', fallback: '#111111' },
  { key: 'surface-2', label: 'Raised cards', fallback: '#1a1a1a' },
  { key: 'ink', label: 'Main text', fallback: '#ffffff' },
  { key: 'mute', label: 'Soft text', fallback: '#a1a1a1' },
  { key: 'rule', label: 'Borders', fallback: '#262626' },
  { key: 'accent', label: 'Accent (buttons, links)', fallback: '#ff3b2f' },
  { key: 'accent-ink', label: 'Text on accent', fallback: '#ffffff' },
];

export const THEME_PRESETS: { name: string; values: Record<string, string> }[] = [
  { name: 'Black and red (default)', values: Object.fromEntries(THEME_KEYS.map((t) => [t.key, t.fallback])) },
  { name: 'Black and white', values: { bg: '#000000', surface: '#111111', 'surface-2': '#1a1a1a', ink: '#ffffff', mute: '#a1a1a1', rule: '#262626', accent: '#ffffff', 'accent-ink': '#000000' } },
  { name: 'Dark orange', values: { bg: '#111219', surface: '#1b1d29', 'surface-2': '#22242f', ink: '#f2f2f5', mute: '#9b9eb0', rule: '#2b2d3a', accent: '#ff7a45', 'accent-ink': '#1a0f0a' } },
  { name: 'Midnight blue', values: { bg: '#0b1020', surface: '#131a2e', 'surface-2': '#1b2440', ink: '#eef1fb', mute: '#93a0c2', rule: '#26304f', accent: '#4d8bff', 'accent-ink': '#04122e' } },
  { name: 'Forest', values: { bg: '#0e1512', surface: '#16201b', 'surface-2': '#1d2a24', ink: '#eef4ef', mute: '#9bb0a4', rule: '#27362e', accent: '#5fd97a', 'accent-ink': '#06150b' } },
  { name: 'Light paper', values: { bg: '#f6f3ee', surface: '#ffffff', 'surface-2': '#f1ede6', ink: '#1d1b18', mute: '#6b665d', rule: '#ddd6ca', accent: '#c93f12', 'accent-ink': '#ffffff' } },
];
