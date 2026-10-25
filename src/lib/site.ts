export const site = {
  name: "ProQS New Zealand",
  url: "https://www.proqs.co.nz",
  contactName: "Murray Bell",
  email: "murray@proqs.co.nz",
  phoneDisplay: "+64 27 555 0720",
  phoneHref: "tel:+64275550720",
  hours: "Weekdays, 8am – 5pm",
  address: {
    street: "43B Eversleigh Road",
    suburb: "Belmont",
    city: "Auckland",
  },
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=43B+Eversleigh+Road+Belmont+Auckland",
  // Professional memberships shown in the footer and credentials strip,
  // e.g. "NZIQS member". Leave empty until confirmed with Murray.
  memberships: [] as string[],
};

export const quoteHref = "/contact#quote";

export const mailto = (subject: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

/** Facts only — every item here must be something Murray can stand behind. */
export const credentials = [
  { value: "Reg QS", label: "Registered quantity surveyor" },
  { value: "10+ years", label: "Residential cost expertise" },
  { value: "3–5 days", label: "Typical estimate turnaround" },
  { value: "NZ-wide", label: "Estimates prepared from your plans" },
];

export const audiences = [
  {
    title: "Homeowners",
    body: "Know what your new build, renovation or extension should cost before you sign anything.",
  },
  {
    title: "Builders",
    body: "Independent numbers that give your clients confidence in your pricing.",
  },
  {
    title: "Architects",
    body: "Check the design against the budget early, while changes are still cheap.",
  },
];

export type Service = {
  id: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  /** Optional indicative price, e.g. "From $X + GST". Shown only when set. */
  from?: string;
  turnaround?: string;
};

export const services: Service[] = [
  {
    id: "estimates",
    title: "Residential cost estimates",
    body: "Accurate pricing for new builds, renovations, and extensions. Get clarity on project costs before construction begins.",
    image: "/images/service-residential.avif",
    alt: "Modern residential home",
    turnaround: "Typically 3–5 business days",
  },
  {
    id: "feasibility",
    title: "Feasibility & cost planning",
    body: "Detailed reports to help you plan, budget, and make informed decisions for your residential project.",
    image: "/images/service-feasibility.avif",
    alt: "Construction plans laid out on a desk",
  },
  {
    id: "budget-advice",
    title: "Budget advice",
    body: "Practical guidance to keep your build or renovation on track and within budget from start to finish.",
    image: "/images/service-budget.avif",
    alt: "Residential building site with scaffolding",
  },
  {
    id: "tender-review",
    title: "Quote & tender review",
    body: "Independent review of builder quotes and tenders to ensure fair pricing and avoid costly surprises.",
    image: "/images/blueprint.avif",
    alt: "Architectural drawings with a ruler",
  },
];

export const steps = [
  {
    title: "Send your plans",
    body: "Upload your drawings and a few project details. Concept plans are fine — the more detail, the tighter the estimate.",
  },
  {
    title: "Receive your estimate",
    body: "Murray prepares an independent, itemised cost estimate, typically within 3–5 business days.",
  },
  {
    title: "Talk it through",
    body: "Go over the numbers together, understand where the money goes, and decide your next step with confidence.",
  },
];

/**
 * Illustrative only — shown on the homepage as an example of an itemised estimate.
 * Not a quote. Based on Murray's guide rate of $3,000/m²; items must sum to areaM2 × 3000.
 */
export const sampleEstimate = {
  title: "New 3-bedroom home",
  subtitle: "180 m² · single level · Auckland",
  areaM2: 180,
  items: [
    { label: "Site works & foundations", amount: 68000 },
    { label: "Framing & structure", amount: 96000 },
    { label: "Roofing & cladding", amount: 112000 },
    { label: "Windows & doors", amount: 54000 },
    { label: "Plumbing & electrical", amount: 72000 },
    { label: "Linings, kitchen & finishes", amount: 138000 },
  ],
};

export const testimonial = {
  quote: "ProQS gives us peace of mind when we are working with our clients.",
  name: "Ursala Gilchrist",
  role: "Northspace Homes",
  image: "/images/testimonial-2.avif",
  avatar: "/images/avatar-ursula.png",
};

export const faqs = [
  {
    q: "What details should I send for a quote?",
    a: "Send your building plans and project info. This allows us to prepare an accurate estimate for your needs.",
  },
  {
    q: "How fast will I get my estimate?",
    a: "Most estimates are ready in 3–5 business days after we receive your plans. We’ll confirm your timeline after review.",
  },
  {
    q: "Who do you provide estimates for?",
    a: "We work with homeowners, builders, and architects on residential projects throughout New Zealand.",
  },
  {
    q: "Can I get advice before building?",
    a: "Yes, we offer practical advice and budget guidance before you start your project.",
  },
  {
    q: "Why use an independent quantity surveyor?",
    a: "A builder’s quote is prepared to win the job. An independent estimate is prepared for you, so you can check the numbers, compare quotes fairly and spot gaps before you commit.",
  },
];

export const projectTypes = [
  "New build",
  "Renovation",
  "Extension",
  "Feasibility / early budget",
  "Quote or tender review",
  "Other",
];
