import type { Metadata } from 'next';
import { fullWriting, labs } from '@/content/data';
import AdminDashboard, { type BuiltinEntry } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = { title: 'Dashboard | Ahlaam Abdallah', robots: { index: false, follow: false } };

export default function AdminPage() {
  // Only the list details of built-in entries go to the browser, not their full text.
  const builtins: BuiltinEntry[] = [
    ...fullWriting.map((p) => ({ kind: 'writing' as const, slug: p.slug, title: p.title, category: p.category, type: p.type, date: p.date, tags: p.tags })),
    ...labs.map((l) => ({ kind: 'lab' as const, slug: l.slug, title: l.title, platform: l.platform, status: l.status, objective: l.objective, tools: l.tools })),
  ];
  return <AdminDashboard builtins={builtins} />;
}
