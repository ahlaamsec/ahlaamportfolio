import mammoth from 'mammoth';
import { parse as parseHtml, HTMLElement, Node, NodeType } from 'node-html-parser';

// Converts an uploaded .docx buffer into our content-block convention:
// a flat string[] where each item is either a plain paragraph, a
// "## heading" / "### subheading" line, a "- bullet" line, or an
// image line "![caption](data:...)". Images are embedded as base64 data
// URIs so no file storage is required — order matches the source document.

export async function docxToBlocks(buffer: Buffer): Promise<string[]> {
  const { value: html } = await mammoth.convertToHtml(
    { buffer },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const base64 = await image.read('base64');
        return { src: `data:${image.contentType};base64,${base64}` };
      }),
    }
  );
  return htmlToBlocks(html);
}

function textOf(node: Node): string {
  return node.textContent.replace(/\s+/g, ' ').trim();
}

export function htmlToBlocks(html: string): string[] {
  const root = parseHtml(html);
  const blocks: string[] = [];

  for (const child of root.childNodes) {
    if (child.nodeType !== NodeType.ELEMENT_NODE) continue;
    const el = child as HTMLElement;
    walkBlock(el, blocks);
  }
  return blocks.filter((b) => b.trim().length > 0);
}

function walkBlock(el: HTMLElement, blocks: string[]) {
  const tag = el.tagName?.toLowerCase();

  if (tag === 'img') {
    const src = el.getAttribute('src');
    // File-name style alt text (no spaces) makes a poor caption, so drop it.
    const rawAlt = (el.getAttribute('alt') || '').replace(/[\[\]\n]/g, ' ').trim();
    const alt = /\s/.test(rawAlt) ? rawAlt : '';
    if (src) blocks.push(`![${alt}](${src})`);
    return;
  }

  if (tag === 'h1' || tag === 'h2') {
    const t = textOf(el);
    if (t) blocks.push(`## ${t}`);
    return;
  }
  if (tag === 'h3' || tag === 'h4') {
    const t = textOf(el);
    if (t) blocks.push(`### ${t}`);
    return;
  }

  if (tag === 'ul' || tag === 'ol') {
    for (const li of el.querySelectorAll('li')) {
      const t = textOf(li);
      if (t) blocks.push(`- ${t}`);
    }
    return;
  }

  if (tag === 'table') {
    const rows = el.querySelectorAll('tr').map((tr) =>
      tr.querySelectorAll('td,th').map((cell) => textOf(cell)).join(' | ')
    );
    const t = rows.filter(Boolean).join('\n');
    if (t) blocks.push(t);
    return;
  }

  if (tag === 'p') {
    // Images can sit directly in a paragraph or be wrapped in <em>, <strong>
    // and similar. Walk the whole paragraph so every image keeps its place
    // between the text before it and the text after it.
    let buffer = '';
    const flush = () => {
      const t = buffer.replace(/\s+/g, ' ').trim();
      if (t) blocks.push(t);
      buffer = '';
    };
    const visit = (n: Node) => {
      if (n.nodeType === NodeType.ELEMENT_NODE) {
        const e = n as HTMLElement;
        if (e.tagName?.toLowerCase() === 'img') {
          flush();
          walkBlock(e, blocks);
          return;
        }
        e.childNodes.forEach(visit);
      } else {
        buffer += n.text || '';
      }
    };
    el.childNodes.forEach(visit);
    flush();
    return;
  }

  // Fallback: unknown block-level tag — just take its text.
  const t = textOf(el);
  if (t) blocks.push(t);
}

export function guessTitleFromFilename(filename: string): string {
  return filename
    .replace(/\.(docx|doc|md|txt)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function textToBlocks(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
