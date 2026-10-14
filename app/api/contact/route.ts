import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';
import { addMessage, getMessages, deleteMessage, isStoreConfigured } from '@/lib/store';
import { newImageId } from '@/lib/images';

const COOKIE = 'edit_session';
const recent = new Map<string, number>();

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // honeypot: bots fill this in

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 4000);
  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please fill in your name, a valid email and a message.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const last = recent.get(ip) || 0;
  if (Date.now() - last < 30_000) {
    return NextResponse.json({ ok: false, error: 'Please wait a moment before sending another message.' }, { status: 429 });
  }
  recent.set(ip, Date.now());

  let stored = false;
  if (isStoreConfigured()) {
    stored = await addMessage({ id: newImageId(), name, email, message, at: new Date().toISOString() });
  }

  // Optional email copy through Resend, if the keys are set.
  let emailed = false;
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (key && to) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>',
          to: [to],
          reply_to: email,
          subject: `Portfolio message from ${name}`,
          text: `${message}\n\n${name} <${email}>`,
        }),
      });
      emailed = r.ok;
    } catch {}
  }

  if (!stored && !emailed) {
    return NextResponse.json({ ok: false, error: 'Messages are not set up on this site yet. Please email me directly.' }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  if (!isValidSession(req.cookies.get(COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, messages: await getMessages() });
}

export async function DELETE(req: NextRequest) {
  if (!isValidSession(req.cookies.get(COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (typeof body?.id !== 'string') return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json({ ok: await deleteMessage(body.id) });
}
