import { Anton, Epilogue, JetBrains_Mono, Fraunces, Space_Grotesk } from 'next/font/google';

// Self-hosted at build time, so the strict font-src 'self' CSP still applies.
export const display = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' });
export const body = Epilogue({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
export const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
// Extra choices for Settings → Fonts. Browsers only download them once picked.
const serif = Fraunces({ subsets: ['latin'], display: 'swap', preload: false });
const grotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', preload: false });

export const FONT_CHOICES: { key: string; label: string; family: string }[] = [
  { key: 'anton', label: 'Anton (tall, bold)', family: display.style.fontFamily },
  { key: 'epilogue', label: 'Epilogue (clean)', family: body.style.fontFamily },
  { key: 'grotesk', label: 'Space Grotesk (techy)', family: grotesk.style.fontFamily },
  { key: 'serif', label: 'Fraunces (serif)', family: serif.style.fontFamily },
  { key: 'mono', label: 'JetBrains Mono (code)', family: mono.style.fontFamily },
  { key: 'system', label: 'System default', family: "system-ui,-apple-system,'Segoe UI',sans-serif" },
];

export const TEXT_SIZES = [
  { key: '90', label: 'Small' },
  { key: '100', label: 'Normal' },
  { key: '110', label: 'Large' },
  { key: '120', label: 'Extra large' },
];
