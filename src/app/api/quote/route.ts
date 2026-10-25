import { get, issueSignedToken, presignUrl } from "@vercel/blob";
import { NextResponse } from "next/server";
import { projectTypes, site } from "@/lib/site";
import { DOWNLOAD_LINK_DAYS, buildConfirmationEmail, buildQuoteEmail, type QuoteEmailFile } from "@/lib/quoteEmail";
import { MAX_FILES, UPLOAD_PREFIX } from "@/lib/uploads";

// Resend caps a whole email at 40 MB; leave headroom for base64 overhead.
const MAX_ATTACH_BYTES = 28 * 1024 * 1024;

type QuoteRequest = {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  location?: string;
  message?: string;
  company?: string; // honeypot
  files?: { pathname: string; name: string; size: number }[];
};

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTE_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json({ error: "Email is not configured" }, { status: 503 });
  }

  let body: QuoteRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Bots fill every field; people never see this one.
  if (body.company) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const projectType = projectTypes.includes(clean(body.projectType, 60)) ? clean(body.projectType, 60) : "";
  const location = clean(body.location, 120);
  const message = clean(body.message, 5000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide your name and a valid email." }, { status: 400 });
  }

  const files = (Array.isArray(body.files) ? body.files : [])
    .slice(0, MAX_FILES)
    .filter((f) => typeof f?.pathname === "string" && f.pathname.startsWith(UPLOAD_PREFIX) && !f.pathname.includes(".."));

  // Attach plans directly while they fit; anything beyond that stays in Blob storage.
  const attachments: { filename: string; content: string }[] = [];
  const emailFiles: QuoteEmailFile[] = [];
  let attachedBytes = 0;
  for (const f of files) {
    const fileName = clean(f.name, 200) || f.pathname.split("/").pop()!;
    try {
      const result = await get(f.pathname, { access: "private" });
      if (!result || result.statusCode !== 200) throw new Error("missing");
      if (attachedBytes + result.blob.size > MAX_ATTACH_BYTES) {
        emailFiles.push({
          name: fileName,
          size: result.blob.size,
          attached: false,
          downloadUrl: await downloadLink(result.blob.pathname),
        });
        continue;
      }
      const buf = Buffer.from(await new Response(result.stream).arrayBuffer());
      attachedBytes += buf.byteLength;
      attachments.push({ filename: fileName, content: buf.toString("base64") });
      emailFiles.push({ name: fileName, size: buf.byteLength, attached: true });
    } catch {
      console.error("Could not retrieve uploaded plan:", f.pathname);
      emailFiles.push({ name: fileName, size: Number(f.size) || 0, attached: false });
    }
  }

  const origin = new URL(request.url).origin;
  const { subject, html, text } = buildQuoteEmail({
    name,
    email,
    phone,
    projectType,
    location,
    message,
    files: emailFiles,
    origin,
  });

  const res = await sendEmail(apiKey, {
    from,
    to: process.env.QUOTE_TO_EMAIL || site.email,
    reply_to: `${name.replace(/[<>"]/g, "")} <${email}>`,
    subject,
    html,
    text,
    attachments,
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json({ error: "We couldn't send your request." }, { status: 502 });
  }

  // Confirmation to the client. Best effort: Murray already has the request, so a failure here
  // is logged but doesn't turn a successful submission into an error for the client.
  let confirmationSent = false;
  try {
    const confirmation = buildConfirmationEmail({
      name,
      projectType,
      fileCount: emailFiles.length,
      origin,
      contact: {
        name: site.contactName,
        email: site.email,
        phoneDisplay: site.phoneDisplay,
        phoneHref: site.phoneHref,
        address: `${site.address.street}, ${site.address.suburb}, ${site.address.city}`,
      },
    });
    const sent = await sendEmail(apiKey, {
      from: withDisplayName(from, "ProQS New Zealand"),
      to: email,
      reply_to: `${site.contactName} <${site.email}>`,
      ...confirmation,
    });
    confirmationSent = sent.ok;
    if (!sent.ok) console.error("Confirmation email failed", sent.status, await sent.text());
  } catch (error) {
    console.error("Confirmation email failed", error);
  }

  return NextResponse.json({ ok: true, confirmationSent });
}

function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** "ProQS website <quotes@proqs.co.nz>" -> "ProQS New Zealand <quotes@proqs.co.nz>" */
function withDisplayName(from: string, displayName: string) {
  const address = from.match(/<([^>]+)>/)?.[1] ?? from.trim();
  return `${displayName} <${address}>`;
}

/** A time-limited link Murray can use to download a private plan file. Falls back to none on failure. */
async function downloadLink(pathname: string): Promise<string | undefined> {
  try {
    const validUntil = Date.now() + DOWNLOAD_LINK_DAYS * 24 * 60 * 60 * 1000;
    const token = await issueSignedToken({ pathname, operations: ["get"], validUntil });
    const { presignedUrl } = await presignUrl(token, { operation: "get", pathname, access: "private", validUntil });
    return presignedUrl;
  } catch (error) {
    console.error("Could not create download link for", pathname, error);
    return undefined;
  }
}
