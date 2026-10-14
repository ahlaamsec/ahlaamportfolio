import { fullWriting } from '@/content/data';
import { getCustomWriting, getDeletedIds } from '@/lib/store';

export const dynamic = 'force-dynamic';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET(req: Request) {
  const origin = process.env.SITE_URL || new URL(req.url).origin;
  const [custom, deleted] = await Promise.all([getCustomWriting(), getDeletedIds()]);
  const items = [...custom, ...fullWriting].filter((p) => !deleted.includes(`writing:${p.slug}`)).slice(0, 60);
  const body = items.map((p) => {
    const excerpt = (p.content.find((b) => !b.startsWith('![') && !b.startsWith('#')) || '').slice(0, 280);
    return `<item><title>${esc(p.title)}</title><link>${origin}/writing/${p.slug}</link><guid>${origin}/writing/${p.slug}</guid><category>${esc(p.category)}</category><description>${esc(excerpt)}</description></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ahlaam Abdallah: writing</title><link>${origin}/writing</link><description>Essays, fiction and technical notes on security, people and communication.</description>${body}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
