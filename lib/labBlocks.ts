import type { Lab } from '@/content/data';

// Turns the structured Apache report into the same block format every other
// write-up uses, so each paragraph and screenshot can be edited, moved or deleted.
export function labToBlocks(lab: Lab): string[] {
  const f = lab.full;
  if (!f) return [];
  const out: string[] = [];
  const imgs = (list?: { file: string; caption: string }[]) =>
    (list || []).forEach((e) => out.push(`![${e.caption}](/evidence/${lab.slug}/${e.file})`));
  if (f.methodology) {
    out.push('## Methodology');
    f.methodology.forEach((m) => out.push(`- ${m}`));
  }
  if (f.recon) { out.push('## Reconnaissance', f.recon); imgs(f.reconImages); }
  if (f.enumeration) { out.push('## Enumeration', f.enumeration); imgs(f.enumerationImages); }
  if (f.exploitation) { out.push('## Exploitation', f.exploitation); imgs(f.exploitationImages); }
  if (f.privesc) { out.push('## Privilege Escalation', f.privesc); imgs(f.privescImages); }
  if (f.table) {
    out.push('## Findings');
    f.table.forEach((t) => out.push(`- ${t.title} (${t.severity}): ${t.desc}. Impact: ${t.impact}.`));
  }
  if (f.remediation) {
    out.push('## Remediation');
    f.remediation.forEach((r) => out.push(`- ${r}`));
  }
  if (f.conclusion) out.push('## Conclusion', f.conclusion);
  if (f.evidence) { out.push('## Evidence'); imgs(f.evidence); }
  return out;
}
