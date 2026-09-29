import { NextResponse } from 'next/server';
import { quotationSchema, type QuotationResponse } from '@/lib/validation/quotation';
import { generateReference } from '@/lib/utils';
import { quotationInbox } from '@/lib/site';

/**
 * Quotation intake endpoint.
 *
 * Rebuilt after being removed by the static-export build step. It is excluded
 * from the Cloudflare Pages static bundle by scripts/prepare-static-export.mjs
 * (which restores it afterwards), and the form falls back to a mailto handoff
 * when the endpoint is not deployed. See docs/CLOUDFLARE.md.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Small in-memory rate limit. Per-instance only — a real deployment should
 *  front this with Cloudflare Turnstile or a KV-backed limiter. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    hits.forEach((stamps, key) => {
      if (stamps.every((t: number) => now - t >= WINDOW_MS)) hits.delete(key);
    });
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json<QuotationResponse>(
      { ok: false, message: 'Too many requests. Wait a minute and try again.' },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<QuotationResponse>(
      { ok: false, message: 'The request body could not be read.' },
      { status: 400 }
    );
  }

  const parsed = quotationSchema.safeParse(payload);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return NextResponse.json<QuotationResponse>(
      { ok: false, message: 'Some details need correcting.', fieldErrors },
      { status: 422 }
    );
  }

  // Honeypot tripped: accept silently so bots get no signal.
  if (parsed.data.website) {
    return NextResponse.json<QuotationResponse>({
      ok: true,
      reference: generateReference(),
      message: 'Request received.',
    });
  }

  const reference = generateReference();

  // Delivery: structured log now, so submissions are captured in platform logs
  // from day one. Wire an email/CRM transport here when credentials are issued.
  console.info(
    JSON.stringify({
      event: 'quotation.received',
      reference,
      receivedAt: new Date().toISOString(),
      inbox: quotationInbox || '(unset)',
      name: parsed.data.name,
      clientType: parsed.data.clientType,
      company: parsed.data.company || null,
      email: parsed.data.email,
      telephone: parsed.data.telephone,
      serviceRequired: parsed.data.serviceRequired,
      projectType: parsed.data.projectType || null,
      projectLocation: parsed.data.projectLocation,
      estimatedTimeline: parsed.data.estimatedTimeline || null,
      budgetRange: parsed.data.budgetRange || null,
      projectDescription: parsed.data.projectDescription,
    })
  );

  return NextResponse.json<QuotationResponse>({
    ok: true,
    reference,
    message: `Request received. Your reference is ${reference}.`,
  });
}

export async function GET() {
  return NextResponse.json(
    { ok: true, service: 'quotation', method: 'POST' },
    { status: 200 }
  );
}
