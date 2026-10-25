# ProQS New Zealand

Marketing site for ProQS (Murray Bell, Reg QS), migrated from Webflow. Next.js App Router, plain CSS, hosted on Vercel.

## Develop

```bash
npm install
npm run dev
```

## Editing content

- Contact details, services, testimonials and FAQs: `src/lib/site.ts`
- Pages: `src/app/page.tsx` (home), `src/app/about/page.tsx`, `src/app/contact/page.tsx`
- Header / footer: `src/components/`
- Styles and colour tokens: `src/app/globals.css`
- Images: `public/images/`

## Quote form setup

The contact page form uploads plans to **private** Vercel Blob storage, then emails Murray via Resend with the plans attached (files too large for email stay in Blob storage and are listed in the email). Until these are configured, the form shows a friendly message pointing people to email instead.

1. In Vercel → Storage, create a Blob store and connect it to this project (adds `BLOB_READ_WRITE_TOKEN`).
2. Create a Resend account, verify `proqs.co.nz` (DNS records), and create an API key.
3. Add `RESEND_API_KEY` and `QUOTE_FROM_EMAIL` to the project's environment variables (see `.env.example`).

## Content still to confirm with Murray

These live in `src/lib/site.ts` and only show when filled in:

- `site.memberships` — e.g. NZIQS membership (credentials strip + footer)
- `services[].from` — indicative pricing per service
- Real testimonials (currently one: Ursala Gilchrist, Northspace Homes)
- The "Meet Murray" bio on the About page (`src/app/about/page.tsx`) is written from facts on the old site; Murray should review it.

## Deploy

Pushes to `main` deploy to production on Vercel; other branches get preview URLs.
