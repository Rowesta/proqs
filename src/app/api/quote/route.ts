import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { projectTypes, site } from "@/lib/site";
import { MAX_FILES, UPLOAD_PREFIX, formatBytes } from "@/lib/uploads";

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

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

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
  const notAttached: string[] = [];
  let attachedBytes = 0;
  for (const f of files) {
    const fileName = clean(f.name, 200) || f.pathname.split("/").pop()!;
    try {
      const result = await get(f.pathname, { access: "private" });
      if (!result || result.statusCode !== 200) throw new Error("missing");
      if (attachedBytes + result.blob.size > MAX_ATTACH_BYTES) {
        notAttached.push(`${fileName} (${formatBytes(result.blob.size)}) — stored as ${f.pathname}`);
        continue;
      }
      const buf = Buffer.from(await new Response(result.stream).arrayBuffer());
      attachedBytes += buf.byteLength;
      attachments.push({ filename: fileName, content: buf.toString("base64") });
    } catch {
      notAttached.push(`${fileName} — could not be retrieved (${f.pathname})`);
    }
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Project type", projectType || "—"],
    ["Location", location || "—"],
  ];

  const html = `
    <h2>New quote request</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escape(v)}</td></tr>`).join("")}
    </table>
    <h3>Project details</h3>
    <p style="white-space:pre-wrap">${escape(message || "—")}</p>
    <h3>Plans</h3>
    <p>${attachments.length ? `${attachments.length} file(s) attached.` : "No files attached."}</p>
    ${
      notAttached.length
        ? `<p>Not attached (too large for email — download from the Vercel Blob dashboard):</p><ul>${notAttached
            .map((n) => `<li>${escape(n)}</li>`)
            .join("")}</ul>`
        : ""
    }`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: process.env.QUOTE_TO_EMAIL || site.email,
      reply_to: email,
      subject: `Quote request: ${name}${projectType ? ` — ${projectType}` : ""}`,
      html,
      attachments,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json({ error: "We couldn't send your request." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
