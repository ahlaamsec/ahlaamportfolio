'use client';
import { useContent } from './ContentProvider';
import { THEME_KEYS } from '@/lib/nav';

const HEX = /^#[0-9a-fA-F]{6}$/;

export default function ThemeInjector() {
  const { overrides } = useContent();
  const rules = THEME_KEYS
    .map((t) => ({ k: t.key, v: overrides[`theme:${t.key}`] }))
    .filter((x) => x.v && HEX.test(x.v))
    .map((x) => `--${x.k}:${x.v};`)
    .join('');
  if (!rules) return null;
  return <style>{`:root{${rules}}`}</style>;
}
