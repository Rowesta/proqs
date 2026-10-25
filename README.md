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

## Deploy

Pushes to `main` deploy to production on Vercel; other branches get preview URLs.
