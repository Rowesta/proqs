// Builds the "new quote request" email sent to Murray.
// Email clients ignore most modern CSS, so this uses tables and inline styles on purpose.

import { formatBytes } from "./uploads";

export type QuoteEmailFile = {
  name: string;
  size: number;
  attached: boolean;
  /** Time-limited private download link, for files too large to attach. */
  downloadUrl?: string;
};

export type QuoteEmailData = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  message: string;
  files: QuoteEmailFile[];
  /** Absolute origin of the site, used for the logo image, e.g. https://www.proqs.co.nz */
  origin: string;
  receivedAt?: Date;
};

const NAVY = "#00001F";
const ACCENT = "#5AC1FF";
const ACCENT_INK = "#0070B8";
const MUTED = "#5C5C70";
const BORDER = "#E3E5EA";
const BG = "#F6F7F9";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const DOWNLOAD_LINK_DAYS = 7;

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

export function buildQuoteEmail(d: QuoteEmailData) {
  const received = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d.receivedAt ?? new Date());

  const subject = `New quote request – ${d.name}${d.projectType ? ` (${d.projectType})` : ""}`;
  const replyHref = `mailto:${d.email}?subject=${encodeURIComponent("Re: Your quote request – ProQS")}`;
  const telHref = d.phone ? `tel:${d.phone.replace(/[^\d+]/g, "")}` : "";

  const detailRows: [string, string][] = [
    ["Name", esc(d.name)],
    ["Email", `<a href="mailto:${esc(d.email)}" style="color:${ACCENT_INK};text-decoration:none;">${esc(d.email)}</a>`],
    ["Phone", d.phone ? `<a href="${esc(telHref)}" style="color:${ACCENT_INK};text-decoration:none;">${esc(d.phone)}</a>` : "—"],
    ["Project type", d.projectType ? esc(d.projectType) : "—"],
    ["Location", d.location ? esc(d.location) : "—"],
  ];

  const row = ([label, value]: [string, string], i: number) => `
    <tr>
      <td style="padding:10px 0;${i ? `border-top:1px solid ${BORDER};` : ""}width:130px;font-size:13px;color:${MUTED};vertical-align:top;">${label}</td>
      <td style="padding:10px 0;${i ? `border-top:1px solid ${BORDER};` : ""}font-size:15px;color:${NAVY};vertical-align:top;">${value}</td>
    </tr>`;

  const attachedCount = d.files.filter((f) => f.attached).length;
  const filesHtml = d.files.length
    ? d.files
        .map(
          (f) => `
    <tr>
      <td style="padding:10px 12px;border:1px solid ${BORDER};border-radius:6px;background:#FFFFFF;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:14px;color:${NAVY};word-break:break-all;">📎 ${esc(f.name)}</td>
          <td align="right" style="font-size:12px;color:${MUTED};white-space:nowrap;padding-left:12px;">
            ${formatBytes(f.size)} · ${
              f.attached
                ? "Attached"
                : f.downloadUrl
                  ? `<a href="${esc(f.downloadUrl)}" style="color:${ACCENT_INK};font-weight:600;text-decoration:none;">Download</a>`
                  : `<span style="color:#B42318;">Not attached</span>`
            }
          </td>
        </tr></table>
      </td>
    </tr>
    <tr><td style="height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>`,
        )
        .join("")
    : `<tr><td style="font-size:14px;color:${MUTED};">No plans were uploaded with this request.</td></tr>`;

  const linked = d.files.filter((f) => !f.attached && f.downloadUrl);
  const missing = d.files.filter((f) => !f.attached && !f.downloadUrl);
  const notAttachedNote = [
    linked.length
      ? `Files too large for email can be downloaded with the link above for ${DOWNLOAD_LINK_DAYS} days.`
      : "",
    missing.length
      ? `Files marked "not attached" are saved in the website's file storage (Vercel → Storage → proqs-plans).`
      : "",
  ]
    .filter(Boolean)
    .map((t) => `<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:${MUTED};">${t}</p>`)
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(
    `${d.name}${d.location ? ` in ${d.location}` : ""} sent ${attachedCount ? `${attachedCount} plan file${attachedCount > 1 ? "s" : ""}` : "an enquiry"} via the website.`,
  )}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:10px;overflow:hidden;font-family:${FONT};">
          <tr><td style="height:4px;background:${ACCENT};font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:28px 28px 20px;border-bottom:1px solid ${BORDER};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td><img src="${esc(d.origin)}/brand/proqs-logo-email.png" width="140" alt="ProQS New Zealand" style="display:block;border:0;width:140px;height:auto;"></td>
                <td align="right" style="padding-left:16px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${ACCENT_INK};font-weight:600;">Website enquiry</td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;">
              <h1 style="margin:0 0 6px;font-size:24px;line-height:1.25;font-weight:600;color:${NAVY};">New quote request from ${esc(firstName(d.name))}</h1>
              <p style="margin:0;font-size:14px;color:${MUTED};">Received ${esc(received)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows.map(row).join("")}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 4px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};font-weight:600;">Project details</p>
              <div style="padding:16px 18px;background:${BG};border-radius:6px;font-size:15px;line-height:1.6;color:${NAVY};white-space:pre-wrap;">${
                d.message ? esc(d.message) : `<span style="color:${MUTED};">No details provided.</span>`
              }</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 4px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};font-weight:600;">Plans &amp; drawings</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filesHtml}</table>
              ${notAttachedNote}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="border-radius:6px;background:${ACCENT};">
                  <a href="${esc(replyHref)}" style="display:inline-block;padding:13px 22px;font-size:15px;font-weight:600;color:${NAVY};text-decoration:none;">Reply to ${esc(firstName(d.name))}</a>
                </td>
                ${
                  telHref
                    ? `<td style="width:10px;">&nbsp;</td>
                <td style="border-radius:6px;border:1px solid ${NAVY};">
                  <a href="${esc(telHref)}" style="display:inline-block;padding:12px 20px;font-size:15px;font-weight:600;color:${NAVY};text-decoration:none;">Call</a>
                </td>`
                    : ""
                }
              </tr></table>
              <p style="margin:14px 0 0;font-size:13px;color:${MUTED};">Hitting reply in your email app also goes straight to ${esc(d.email)}.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:${NAVY};font-size:12px;line-height:1.5;color:#B8B8C8;">
              Sent from the quote form at <a href="${esc(d.origin)}/contact" style="color:${ACCENT};text-decoration:none;">proqs.co.nz</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `NEW QUOTE REQUEST – ProQS website`,
    `Received ${received}`,
    ``,
    `Name:         ${d.name}`,
    `Email:        ${d.email}`,
    `Phone:        ${d.phone || "—"}`,
    `Project type: ${d.projectType || "—"}`,
    `Location:     ${d.location || "—"}`,
    ``,
    `PROJECT DETAILS`,
    d.message || "No details provided.",
    ``,
    `PLANS & DRAWINGS`,
    ...(d.files.length
      ? d.files.map(
          (f) =>
            `- ${f.name} (${formatBytes(f.size)}) – ${
              f.attached
                ? "attached"
                : f.downloadUrl
                  ? `download (link valid ${DOWNLOAD_LINK_DAYS} days): ${f.downloadUrl}`
                  : "not attached, saved in the website's file storage"
            }`,
        )
      : ["No plans were uploaded."]),
    ``,
    `Reply to this email to respond to ${d.name} directly.`,
  ].join("\n");

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Confirmation sent to the person who filled in the form.
// Anyone can type any address into the form, so this email must never echo
// free text (message, location, file names) — only fixed wording plus a
// sanitised first name, the chosen project type and a file count.
// ---------------------------------------------------------------------------

export type ConfirmationEmailData = {
  name: string;
  projectType: string;
  fileCount: number;
  origin: string;
  contact: { name: string; email: string; phoneDisplay: string; phoneHref: string; address: string };
};

/** Letters, apostrophes and hyphens only — no links or other text can ride along. */
const safeFirstName = (name: string) =>
  (name.trim().split(/\s+/)[0] ?? "").replace(/[^\p{L}'’-]/gu, "").slice(0, 30);

export function buildConfirmationEmail(d: ConfirmationEmailData) {
  const first = safeFirstName(d.name);
  const greeting = first ? `Thanks, ${first}` : "Thanks";
  const subject = "We've received your quote request – ProQS";
  const plans =
    d.fileCount > 0 ? `${d.fileCount} plan file${d.fileCount > 1 ? "s" : ""} received` : "No plans attached yet";

  const steps = [
    ["Review", `${d.contact.name} reviews your plans and confirms your timeline.`],
    ["Estimate", "You receive an independent, itemised cost estimate — typically within 3–5 business days."],
    ["Talk it through", "Go over the numbers together and decide your next step with confidence."],
  ];

  const summaryRows: [string, string][] = [
    ["Project type", d.projectType ? esc(d.projectType) : "—"],
    ["Plans", esc(plans)],
  ];

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(
    `${d.contact.name} has your request and will be in touch to confirm your timeline.`,
  )}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:10px;overflow:hidden;font-family:${FONT};">
          <tr><td style="height:4px;background:${ACCENT};font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:28px 28px 20px;border-bottom:1px solid ${BORDER};">
              <img src="${esc(d.origin)}/brand/proqs-logo-email.png" width="140" alt="ProQS New Zealand" style="display:block;border:0;width:140px;height:auto;">
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;">
              <h1 style="margin:0 0 10px;font-size:24px;line-height:1.25;font-weight:600;color:${NAVY};">${esc(greeting)} — we've received your request</h1>
              <p style="margin:0;font-size:16px;line-height:1.6;color:${NAVY};">
                ${esc(d.contact.name)} will review your details and be in touch to confirm your timeline. Most estimates are ready within 3–5 business days.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};border-radius:6px;">
                ${summaryRows
                  .map(
                    ([label, value], i) => `
                <tr>
                  <td style="padding:12px 16px;${i ? `border-top:1px solid ${BORDER};` : ""}width:120px;font-size:13px;color:${MUTED};">${label}</td>
                  <td style="padding:12px 16px;${i ? `border-top:1px solid ${BORDER};` : ""}font-size:15px;color:${NAVY};">${value}</td>
                </tr>`,
                  )
                  .join("")}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 4px;">
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};font-weight:600;">What happens next</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${steps
                  .map(
                    ([title, body], i) => `
                <tr>
                  <td style="width:36px;vertical-align:top;padding:0 0 14px;">
                    <div style="width:26px;height:26px;border-radius:13px;background:${NAVY};color:${ACCENT};font-size:13px;font-weight:600;line-height:26px;text-align:center;">${i + 1}</div>
                  </td>
                  <td style="vertical-align:top;padding:2px 0 14px;font-size:15px;line-height:1.5;color:${NAVY};">
                    <strong>${esc(title)}</strong><br><span style="color:${MUTED};">${esc(body)}</span>
                  </td>
                </tr>`,
                  )
                  .join("")}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:${NAVY};">
                Want to add more plans or details? Just reply to this email, or call ${esc(d.contact.name.split(" ")[0])} on
                <a href="${esc(d.contact.phoneHref)}" style="color:${ACCENT_INK};text-decoration:none;">${esc(d.contact.phoneDisplay)}</a>.
              </p>
              <p style="margin:16px 0 0;font-size:15px;color:${NAVY};">
                ${esc(d.contact.name)}<br>
                <span style="color:${MUTED};">Registered Quantity Surveyor · ProQS New Zealand</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:${NAVY};font-size:12px;line-height:1.6;color:#B8B8C8;">
              ProQS New Zealand · ${esc(d.contact.address)}<br>
              <a href="${esc(d.origin)}" style="color:${ACCENT};text-decoration:none;">proqs.co.nz</a> ·
              <a href="mailto:${esc(d.contact.email)}" style="color:${ACCENT};text-decoration:none;">${esc(d.contact.email)}</a><br>
              You're receiving this because a quote request was submitted with this email address on our website.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `${greeting} — we've received your request`,
    ``,
    `${d.contact.name} will review your details and be in touch to confirm your timeline. Most estimates are ready within 3–5 business days.`,
    ``,
    `Project type: ${d.projectType || "—"}`,
    `Plans:        ${plans}`,
    ``,
    `WHAT HAPPENS NEXT`,
    ...steps.map(([title, body], i) => `${i + 1}. ${title} – ${body}`),
    ``,
    `Want to add more plans or details? Reply to this email, or call ${d.contact.phoneDisplay}.`,
    ``,
    d.contact.name,
    `Registered Quantity Surveyor · ProQS New Zealand`,
    `${d.contact.address} · proqs.co.nz`,
    ``,
    `You're receiving this because a quote request was submitted with this email address on our website.`,
  ].join("\n");

  return { subject, html, text };
}
