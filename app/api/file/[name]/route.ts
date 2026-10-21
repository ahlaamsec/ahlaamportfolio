import { NextResponse } from 'next/server';
import { getFileData } from '@/lib/store';

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (name !== 'cv') return new NextResponse('Not found', { status: 404 });
  const m = (await getFileData(name))?.match(/^data:application\/pdf;base64,(.+)$/);
  if (!m) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(Buffer.from(m[1], 'base64'), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Ahlaam_Abdallah_CV.pdf"',
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
