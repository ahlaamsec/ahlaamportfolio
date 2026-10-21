'use client';
import { useContent } from './ContentProvider';
import { THEME_KEYS } from '@/lib/nav';
import { FONT_CHOICES, TEXT_SIZES } from '@/lib/fonts';

const HEX = /^#[0-9a-fA-F]{6}$/;

export default function ThemeInjector() {
  const { overrides } = useContent();
  const vars = THEME_KEYS
    .map((t) => ({ k: t.key, v: overrides[`theme:${t.key}`] }))
    .filter((x) => x.v && HEX.test(x.v))
    .map((x) => `--${x.k}:${x.v};`);
  // Font and size choices are picked from fixed lists, never written as raw CSS.
  const headFont = FONT_CHOICES.find((f) => f.key === overrides['theme:font-display']);
  const bodyFont = FONT_CHOICES.find((f) => f.key === overrides['theme:font-body']);
  if (headFont) vars.push(`--font-display:${headFont.family};`);
  if (bodyFont) vars.push(`--font-body:${bodyFont.family};`);
  const size = TEXT_SIZES.find((s) => s.key === overrides['theme:size']);

  let css = vars.length ? `html:root{${vars.join('')}}` : '';
  if (size && size.key !== '100') css += `html{font-size:${size.key}%}`;
  if (overrides['theme:caps'] === 'off') css += '.display,.hero__title,.add-modal h2,.add-modal h3{text-transform:none}';
  if (!css) return null;
  return <style>{css}</style>;
}
