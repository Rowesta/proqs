import { buildConfirmationEmail, buildQuoteEmail } from "@/lib/quoteEmail";
import { site } from "@/lib/site";

// Development-only preview of the quote email: http://localhost:3000/api/quote/preview
// Add ?view=text for the plain-text version, ?type=confirmation for the client confirmation.
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }
  const url = new URL(request.url);
  const contact = {
    name: site.contactName,
    email: site.email,
    phoneDisplay: site.phoneDisplay,
    phoneHref: site.phoneHref,
    address: `${site.address.street}, ${site.address.suburb}, ${site.address.city}`,
  };
  const build =
    url.searchParams.get("type") === "confirmation"
      ? () =>
          buildConfirmationEmail({
            name: "Sarah Thompson",
            projectType: "New build",
            fileCount: 3,
            origin: url.origin,
            contact,
          })
      : () =>
          buildQuoteEmail({
            name: "Sarah Thompson",
            email: "sarah.thompson@example.com",
            phone: "021 555 0198",
            projectType: "New build",
            location: "Devonport, Auckland",
            message:
              "We're building a 4-bedroom home on a sloping section and have concept plans from our architect.\n\nBudget is around $1.1M — we'd like to know if that's realistic before we go to developed design. Timing is flexible, ideally starting early next year.",
            files: [
              {
                name: "Concept plans – Rev B.pdf",
                size: 4_200_000,
                attached: true,
              },
              { name: "Site survey.pdf", size: 1_100_000, attached: true },
              {
                name: "Full architectural set.zip",
                size: 46_000_000,
                attached: false,
                downloadUrl: "https://example.com/download",
              },
            ],
            origin: url.origin,
          });
  const { subject, html, text } = build();
  if (url.searchParams.get("view") === "text") {
    return new Response(`Subject: ${subject}\n\n${text}`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
