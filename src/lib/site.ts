export const site = {
  name: "ProQS New Zealand",
  url: "https://www.proqs.co.nz",
  contactName: "Murray Bell",
  email: "murray@proqs.co.nz",
  phoneDisplay: "+64 27 555 0720",
  phoneHref: "tel:+64275550720",
  hours: "Weekdays, 8am – 5pm",
  address: {
    street: "26A Crummer Road",
    suburb: "Ponsonby",
    city: "Auckland",
  },
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=26A+Crummer+Road+Ponsonby+Auckland",
};

export const mailto = (subject: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export const services = [
  {
    title: "Residential cost estimates",
    body: "Accurate pricing for new builds, renovations, and extensions. Get clarity on project costs before construction begins.",
    image: "/images/service-residential.avif",
    alt: "Modern residential home under construction",
  },
  {
    title: "Feasibility & cost planning",
    body: "Detailed reports to help you plan, budget, and make informed decisions for your residential project.",
    image: "/images/service-feasibility.avif",
    alt: "Construction plans laid out on a desk",
  },
  {
    title: "Budget advice",
    body: "Practical guidance to keep your build or renovation on track and within budget from start to finish.",
    image: "/images/service-budget.avif",
    alt: "Residential building site with scaffolding",
  },
  {
    title: "Quote & tender review",
    body: "Independent review of builder quotes and tenders to ensure fair pricing and avoid costly surprises.",
    image: "/images/murray-consulting.png",
    alt: "Murray Bell reviewing plans",
  },
];

export const testimonials = [
  {
    quote:
      "We appreciated the practical advice and fast turnaround. The estimate was spot on.",
    name: "Morgan Lee",
    role: "Architect, Christchurch",
    image: "/images/testimonial-1.avif",
    avatar: "/images/avatar-1.avif",
  },
  {
    quote: "ProQS gives us peace of mind when we are working with our clients.",
    name: "Ursala Gilchrist",
    role: "Northspace Homes",
    image: "/images/testimonial-2.avif",
    avatar: "/images/avatar-ursula.png",
  },
];

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
];
