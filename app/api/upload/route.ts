import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import { externalizeImages } from '@/lib/images';
import { docxToBlocks, textToBlocks, guessTitleFromFilename } from '@/lib/docx';

const COOKIE = 'edit_session';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE)?.value;
  if (!isValidSession(cookie)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ ok: false, error: 'Could not read the upload.' }, { status: 400 });
  }

  const files = form.getAll('files') as File[];
  if (!files.length) {
    return NextResponse.json({ ok: false, error: 'No files received.' }, { status: 400 });
  }

  if (files.length > 40) {
    return NextResponse.json({ ok: false, error: 'Too many files at once (maximum 40).' }, { status: 400 });
  }
  const results = [];
  for (const file of files) {
    const name = file.name || 'untitled';
    const lower = name.toLowerCase();
    if (file.size > 15 * 1024 * 1024) {
      results.push({ filename: name, ok: false, error: 'File is larger than 15 MB.' });
      continue;
    }
    try {
      const buf = Buffer.from(await file.arrayBuffer());
      let blocks: string[];
      if (lower.endsWith('.docx')) {
        blocks = await docxToBlocks(buf);
      } else if (lower.endsWith('.md') || lower.endsWith('.txt')) {
        blocks = textToBlocks(buf.toString('utf-8'));
      } else {
        results.push({ filename: name, ok: false, error: 'Unsupported file type (only .docx, .md, .txt).' });
        continue;
      }
      blocks = await Promise.all(blocks.map((b) => externalizeImages(b)));
      if (blocks.length === 0) {
        results.push({ filename: name, ok: false, error: 'Nothing readable came out of this file.' });
        continue;
      }
      results.push({
        filename: name,
        ok: true,
        title: guessTitleFromFilename(name),
        content: blocks,
      });
    } catch (err: any) {
      results.push({ filename: name, ok: false, error: err?.message || 'Could not parse this file.' });
    }
  }

  return NextResponse.json({ ok: true, results });
}
